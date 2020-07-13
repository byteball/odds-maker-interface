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
						{{championship}}
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
			<b-field label='Canceled odds'>
				<b-numberinput  v-model="canceled_odds" :step="0.01" :controls="false" size="is-small" ></b-numberinput>
			</b-field>
			<b-button class="is-primary" @click="downloadOdds">Get odds</b-button>
	</div>
</template>

<script>

const teamToFeed = require('./TheOddsApi.json');
const moment = require('moment');

export default {
  props: {
	},
	data () {
		return {
			is_form_complete: false,
			is_key_saved: false,
			key_message: '',
			the_odds_api_key: '',
			is_key_valid: false,
			wallet_address: '',
			championships: ['PD', 'SA', 'PL', 'BL1'],
			regions: ['au', 'eu', 'uk', 'us'],
			selected_region: '',
			selected_championship: '',
			markup: 0,
			canceled_odds: this.$store.state.odds_configuration.default_canceled_odds,
			newOdds: {}
		}
	},
	computed: {

	},
	created() {
		this.is_key_saved = !!localStorage.getItem('the_odds_api_key')
		this.the_odds_api_key = localStorage.getItem('the_odds_api_key') || ''
		this.onChange()
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
		downloadOdds(){
			this.axios.get("https://api.the-odds-api.com/v3/odds/?apiKey="+this.the_odds_api_key+"&sport=" 
			+ teamToFeed[this.selected_championship].key + "&region=" + this.selected_region)
			.then((response) => {
				if (response.data.data) {
					response.data.data.forEach((event)=>{
						this.prefillNewOddsForEvent(event);
					});
				}
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
			if (count_odds_1 > 0)
				odds_1 = odds_1 / count_odds_1;
			if (count_odds_x > 0)
				odds_x = odds_x / count_odds_x;
			if (count_odds_2 > 0)
				odds_2 = odds_2 / count_odds_2;

			this.$store.commit('setNewOdds', {
				feedName, 
				odds: {
					home: Number(odds_1.toFixed(2)), 
					draw: Number(odds_x.toFixed(2)), 
					away: Number(odds_2.toFixed(2)), 
					canceled: 50
				}
			});
		}
	}
}
</script>

