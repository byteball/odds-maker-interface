<template>
	<div id="app">
		<p class="title is-3 p-1">Odds maker interface</p>
		<status />

		<b-tabs v-model="selectedTab">
			<b-tab-item label="Upcoming fixtures">
				<upcoming-fixtures-table :fixtures="upcomingFixtures" />
			</b-tab-item>
			<b-tab-item label="Finished fixtures">
				<finished-fixtures-table :fixtures="finishedFixtures" />
			</b-tab-item>
			<b-tab-item label="Settings">
				<settings />
			</b-tab-item>
		</b-tabs>

  </div>
</template>

<script>
import UpcomingFixturesTable from './components/UpcomingFixturesTable.vue'
import FinishedFixturesTable from './components/FinishedFixturesTable.vue'
import Settings from './components/Settings.vue'
import Status from './components/Status.vue'
import moment from 'moment';
import conf from './js/conf.js';
import { EventBus } from './js/event-bus.js';

import core from './js/core.js'
import Vue from 'vue';

export default {
  name: 'App',
  components: {
		UpcomingFixturesTable,
		FinishedFixturesTable,
		Settings,
		Status,
	},
	data() {
		return {
			upcomingFixtures: [],
			finishedFixtures: [],
			selectedTab: 2, // open on settings,
			timerId: null,
		}
	},
	created(){
		core.initStore(this.$store);

		EventBus.$on('connect', this.connect);
		EventBus.$on('disconnect', this.disconnect);

		Vue.nextTick(this.connect); // we wait next tick for the state variables to be loaded
		
	},
	methods:{
		connect: async function(){

			const err = await core.start(Object.assign(
				{},
				this.$store.state.connections,
				this.$store.state.credentials,
			));
			if (err)
				this.$buefy.toast.open({
					duration: 5000,
					message: err,
					position: 'is-bottom',
					type: 'is-danger'
				});
			
			if (!this.$store.state.connections.bComplete)
				return this.$buefy.toast.open({
						duration: 5000,
						message: "Connections settings not complete",
						position: 'is-bottom',
						type: 'is-danger'
				})
			if (!this.$store.state.credentials.bComplete)
				return this.$buefy.toast.open({
						duration: 5000,
						message: "Credentials settings not complete",
						position: 'is-bottom',
						type: 'is-danger'
				})

			this.selectedTab = 0; // upcoming fixtures
			this.getFixtures();
			this.timerId = setInterval(this.getFixtures, 2*60*1000);

		},
		disconnect: async function(){
			core.stop();
			this.finishedFixtures = [];
			this.upcomingFixtures = [];
			clearInterval(this.timerId);
		},
		getFixtures: function(){
			this.axios.get(this.$store.state.connections.betting_api +'/fixtures').then((response) => {
				const allFixtures = response.data;
				const supportedOperatingAssets = {};
				const supportedOperatingCurrencies = conf.currencies[this.$store.state.connections.testnet ? 'testnet' : 'mainnet'];
				for (var key in supportedOperatingCurrencies){
					supportedOperatingAssets[supportedOperatingCurrencies[key].asset] = key;
				}
				
				allFixtures.forEach((fixture)=>{
					fixture.dateMoment = moment(fixture.date);
					fixture.feedName = this.getFeedName(fixture);

					if (fixture.currencies){
						for(var key in fixture.currencies){
							const assets = fixture.currencies[key].assets;
							if (!assets)
								continue;
							const operatingSymbol = supportedOperatingAssets[key]
							if(!operatingSymbol)
								continue;
							assets.home_symbol = fixture.feedName + '-' + fixture.feedHomeTeamName + '-' + operatingSymbol;
							assets.away_symbol = fixture.feedName + '-' + fixture.feedAwayTeamName+ '-' + operatingSymbol;
							assets.draw_symbol = fixture.feedName + '-DRAW'+ '-' + operatingSymbol;
							assets.canceled_symbol = fixture.feedName + '-CANCELED'+ '-' + operatingSymbol;

							if (fixture.result){
								if (fixture.result === fixture.feedName.split('_')[1]){
									assets.winning_asset = assets.home;
									assets.winning_symbol = assets.home_symbol;
									fixture.result = 'home';
								}
								else if (fixture.result === fixture.feedName.split('_')[2]){
									assets.winning_asset = assets.away;
									assets.winning_symbol = assets.away_symbol;
									fixture.result = 'away';
								}
								else if (fixture.result === 'draw'){
									assets.winning_asset = assets.draw;
									assets.winning_symbol = assets.draw_symbol;
								}
								else if (fixture.result === 'canceled'){
									assets.winning_asset = assets.canceled;
									assets.winning_symbol = assets.canceled_symbol;
								}
							}
						}
					}

					if (!this.$store.state.newOdds[fixture.feedName])
						this.$store.commit('setNewOdds', {feedName: fixture.feedName, odds:{ home:1,draw:1, away:1, canceled: 1}});
				});

				allFixtures.sort((a,b)=>{
					if(a.date > b.date)
						return 1;
					else
						return -1;
				});

				this.upcomingFixtures = allFixtures.filter((fixture)=>{
					return fixture.dateMoment.isAfter(moment()) && fixture.dateMoment.isBefore(moment().add(conf.upcoming_fixtures_max_days, 'days'))
				});

				allFixtures.sort((a,b)=>{
					if(a.date < b.date)
						return 1;
					else
						return -1;
				});

				this.finishedFixtures = allFixtures.filter((fixture)=>{
					return fixture.dateMoment.isBefore(moment())
				});
		
			})
		},
		getFeedName: function(fixture){
			return fixture.championship + '_'  + fixture.feedHomeTeamName + '_' + fixture.feedAwayTeamName + '_' + fixture.localDay;
		},

	}
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
</style>
