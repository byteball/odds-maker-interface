<template>
	<div>
		<b-field :message="key_message">
			<template slot="label">
				Api Key
				<b-tooltip type="is-dark" label="Register on https://the-odds-api.com/ to get an API key">
				<b-icon size="is-small" icon="help-circle-outline"></b-icon>
				</b-tooltip>
			</template>
			<b-input class="mr-05" @input="onChange" v-model="the_odds_api_key" type="password" autocomplete="off" :disabled="is_key_saved"></b-input>
			<b-button class="is-primary" v-if="is_key_saved" @click="deleteApiKey">Delete from computer</b-button>
			<b-button class="is-primary" v-if="!is_key_saved && is_key_valid" @click="saveApiKey">Save on computer</b-button>
		</b-field>

		<div v-if="is_key_valid">
			<b-field label="Championship" >
				<b-select placeholder="Select a championship" v-model="selected_championship">
					<option
						v-for="championship in championships"
						:value="championship"
						:key="championship">
						{{$t(championship)}}
					</option>
				</b-select>
			</b-field>

			<b-field label="Region">
				<b-select placeholder="Select a region" v-model="selected_region">
					<option
						v-for="region in regions"
						:value="region"
						:key="region">
						{{region}}
					</option>
				</b-select>
			</b-field>
		</div>
		<b-field v-if="has_cancel_odds" label='Canceled odds'>
			<b-numberinput  v-model="canceled_odds" :step="0.01" :controls="false" size="is-small" ></b-numberinput>
		</b-field>
		<b-field label='Markup in percent'>
			<b-numberinput  v-model="markup" :step="0.01" :controls="true" size="is-small" ></b-numberinput>
		</b-field>
		<div class="buttons">
			<b-button :disabled="is_setting_odds" class="is-primary" @click="getAndPrefillOdds">Get odds and prefill form</b-button>
			<b-button :disabled="is_setting_odds" class="is-primary" @click="getAndSetOdds">Get and set odds</b-button>
		</div>
		<div>
		{{odds_downloaded_message}}
		</div>
	</div>
</template>

<script>

const teamToFeed = require('./TheOddsApi.json');
const moment = require('moment');
import { EventBus } from '../../js/event-bus.js';

export default {
  props: {
	},
	data () {
		return {
			is_form_complete: false,
			is_key_saved: false,
			key_message: '',
			odds_downloaded_message: '',
			the_odds_api_key: '',
			is_key_valid: false,
			wallet_address: '',
			championships: ['PD', 'SA', 'PL', 'BL1', 'NBA', 'BSA'],
			regions: ['uk', 'au', 'eu', 'us'],
			selected_region: '',
			selected_championship: '',
			markup: this.$store.state.odds_configuration.default_markup,
			canceled_odds: this.$store.state.odds_configuration.default_canceled_odds,
			newOdds: {},
			is_setting_odds: false
		}
	},
	computed: {
		has_cancel_odds:function(){
			return this.$store.state.odds_configuration && this.$store.state.odds_configuration.with_cancel_championships[this.selected_championship]
		},
	},
	created() {
		this.selected_region = this.regions[0];
		this.is_key_saved = !!localStorage.getItem('the_odds_api_key')
		this.the_odds_api_key = localStorage.getItem('the_odds_api_key') || ''
		this.onChange();

	},
	watch:{

	},
	methods:{
		deleteApiKey(){
			localStorage.removeItem('the_odds_api_key')
			this.is_key_saved = false
		},
		saveApiKey(){
			localStorage.setItem('the_odds_api_key', this.the_odds_api_key) 
			this.is_key_saved = true
		},
		onChange(){
			if (this.the_odds_api_key.length != 32){
				this.is_key_valid = false;
				this.key_message = 'not valid'
			} else {
				this.is_key_valid = true;
				this.key_message = ''
			}
			this.$store.commit("setCredentials", this.credentials)
		},
		getAndSetOdds(){
			this.getAndPrefillOdds(true);
		},
		getAndPrefillOdds(andSet){
			if (!this.selected_championship.length)
				return this.$buefy.toast.open({
					duration: 5000,
					message: 'Championship not selected',
					position: 'is-bottom',
					type: 'is-danger'
				})
			if (!this.selected_region.length)
				return this.$buefy.toast.open({
					duration: 5000,
					message: 'Region not selected',
					position: 'is-bottom',
					type: 'is-danger'
				})
			this.odds_downloaded_message = '';
			const selected_championship = this.selected_championship;
			this.is_setting_odds = true;
			this.axios.get("https://api.the-odds-api.com/v3/odds/?apiKey="+this.the_odds_api_key+"&sport=" 
			+ teamToFeed[selected_championship].key + "&region=" + this.selected_region)
			.then((response) => {
				if (response.data.data) {
					response.data.data.forEach((event)=>{
						this.prefillNewOddsForEvent(event);
					});
					if (andSet){
						EventBus.$emit('setOddsForChampionship', selected_championship)
						EventBus.$once('oddsSet', ()=>{
							this.is_setting_odds = false;
						})
					} else 
						this.is_setting_odds = false;
				}

				this.odds_downloaded_message = "Got odds for " + response.data.data.length + " fixtures, " + response.headers['x-requests-remaining'] 
				+ " requests remaining for the month.";
			}).catch((err)=>{
				this.is_setting_odds = false;
				this.$buefy.toast.open({
					duration: 5000,
					message: err,
					position: 'is-bottom',
					type: 'is-danger'
				})
			});

		},
		prefillNewOddsForEvent(event){

			var day = moment.unix(Number(event.commence_time)).format("YYYY-MM-DD");

			var odds_1 = 0;
			var odds_x = 0;
			var odds_2 = 0;

			var count_odds_1 = 0;
			var count_odds_x = 0;
			var count_odds_2 = 0;
			var feedName;
			if (event.home_team == event.teams[0]) {
				feedName = this.selected_championship + '_' + 
				teamToFeed[this.selected_championship][event.teams[0]] + "_" 
				+ teamToFeed[this.selected_championship][event.teams[1]] + "_" 
				+ day;
				for (let site in event.sites) {
					if (Number(event.sites[site].odds.h2h[0]) > 1) {
						odds_1 += Number(event.sites[site].odds.h2h[0]);
						count_odds_1++;
					}
					if (Number(event.sites[site].odds.h2h[2]) > 1) {
						odds_x += Number(event.sites[site].odds.h2h[2]);
						count_odds_x++;
					}
					if (Number(event.sites[site].odds.h2h[1]) > 1) {
						odds_2 += Number(event.sites[site].odds.h2h[1]);
						count_odds_2++;
					}
				}

			} else if (event.home_team == event.teams[1]) {
				feedName = this.selected_championship + '_' + 
				teamToFeed[this.selected_championship][event.teams[1]] + "_" 
				+ teamToFeed[this.selected_championship][event.teams[0]] + "_" 
				+ day;

				for (let site in event.sites) {

					if (Number(event.sites[site].odds.h2h[1]) > 1) {
						odds_1 += Number(event.sites[site].odds.h2h[1]);
						count_odds_1++;
					}
					if (Number(event.sites[site].odds.h2h[2]) > 1) {
						odds_x += Number(event.sites[site].odds.h2h[2]);
						count_odds_x++;
					}
					if (Number(event.sites[site].odds.h2h[0]) > 1) {
						odds_2 += Number(event.sites[site].odds.h2h[0]);
						count_odds_2++;
					}
				}
			}
			// we average odds from different bookmakers
			if (count_odds_1 > 0)
				odds_1 = odds_1 / count_odds_1;
			if (count_odds_x > 0)
				odds_x = odds_x / count_odds_x;
			if (count_odds_2 > 0)
				odds_2 = odds_2 / count_odds_2;

			odds_1 = odds_1 - (odds_1 - 1) * this.markup/100;
			odds_x = odds_x - (odds_x - 1) * this.markup/100;
			odds_2 = odds_2 - (odds_2 - 1) * this.markup/100;

			this.$store.commit('setNewOdds', {
				feedName, 
				odds: {
					home: Number(odds_1.toFixed(2)), 
					draw: Number(odds_x.toFixed(2)), 
					away: Number(odds_2.toFixed(2)), 
					canceled: this.canceled_odds
				}
			});
		}
	}
}
</script>

