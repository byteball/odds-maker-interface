<template>
	<div id="app">
		<p class="title is-3 p-1">Odds maker interface</p>
		<status />

		<b-tabs>
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
		}
	},
	created(){
		core.initStore(this.$store);

		Vue.nextTick(async ()=> { // we wait next tick for the state variables to be loaded
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
				})
		})
		this.getFixtures();
		setInterval(this.getFixtures, 2*60*1000);
	},
	methods:{

		getFixtures: function(){
			this.axios.get('/api/fixtures').then((response) => {
				const allFixtures = response.data;
				allFixtures.forEach((fixture)=>{
					fixture.feedName = this.getFeedName(fixture);
					if (fixture.assets){
						fixture.assets.home_symbol = fixture.feedName + '-' + fixture.feedHomeTeamName;
						fixture.assets.away_symbol = fixture.feedName + '-' + fixture.feedAwayTeamName;
						fixture.assets.draw_symbol = fixture.feedName + '-DRAW';
						fixture.assets.canceled_symbol = fixture.feedName + '-CANCELED';

						if (fixture.result){
							if (fixture.result === fixture.feedName.split('_')[1]){
								fixture.winning_asset = fixture.assets.home;
								fixture.winning_symbol = fixture.assets.home_symbol;
							}
							else if (fixture.result === fixture.feedName.split('_')[2]){
								fixture.winning_asset = fixture.assets.away;
								fixture.winning_symbol = fixture.assets.away_symbol;
							}
							else if (fixture.result === 'draw'){
								fixture.winning_asset = fixture.assets.draw;
								fixture.winning_symbol = fixture.assets.draw_symbol;
							}
							else if (fixture.result === 'canceled'){
								fixture.winning_asset = fixture.assets.canceled;
								fixture.winning_symbol = fixture.assets.canceled_symbol;
							}
						}

					}
					fixture.dateMoment = moment(fixture.date);
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
