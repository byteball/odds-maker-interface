<template>
<div>
	<div class="buttons">
		<span class="title is-6 mr-05 mt-05">For selection: </span>
		<b-button @click="issueAsset" :disabled="!checkedRows.length" class="is-pulled-left is-primary">Issue asset</b-button>
		<b-button @click="transferToOdex" :disabled="!checkedRows.length" class="is-pulled-left is-primary">Transfer to Odex</b-button>
		<b-button @click="prefillNewOdds" :disabled="!checkedRows.length" class="is-pulled-left is-primary">Prefill new odds</b-button>
		<b-button @click="setOdexOddsForFixtures" :disabled="!checkedRows.length" class="is-pulled-left is-primary">set odds</b-button>
	</div>
	<b-table 
	:data="fixtures"
	:checked-rows.sync="checkedRows"	
	checkable 
	>
		<template slot-scope="props">

			<b-table-column label="Championship" field="championship" custom-key='championship' >
				{{props.row.championship}}
			</b-table-column>
			<b-table-column label="Home team" field="homeTeam" custom-key='homeTeam' >
				{{props.row.homeTeam}}
			</b-table-column>

			<b-table-column label="Away team" field="awayTeam" custom-key='awayTeam' >
				{{props.row.awayTeam}}
			</b-table-column>

			<b-table-column label="Date/time" field="date" custom-key='date' >
				{{props.row.date}}
			</b-table-column>

			<b-table-column label="Assets"  field="on_wallet" custom-key='on_wallet' >
				<assets-on-wallets :assets="props.row.assets" />
				<assets-on-odex :fixture="props.row" />
			</b-table-column>

			<b-table-column label="Odds"  field="odds" custom-key='odds' >
				<my-odds :fixture="props.row" />
				<new-odds :fixture="props.row" />
			</b-table-column>

		</template>

	</b-table>
	</div>
</template>

<script>
//import core from '../js/core.js'
import AssetsOnWallets from './AssetsOnWallets.vue'
import AssetsOnOdex from './AssetsOnOdex.vue'
import TransferToOdexModal from './TransferToOdexModal.vue'
import IssueAssetsModal from './IssueAssetsModal.vue'
import PrefillNewOdds from './PrefillNewOdds.vue'
import NewOdds from './MainTableNewOdds.vue'
import MyOdds from './MainTableMyOdds.vue'

import core from '../js/core.js'

import { ModalProgrammatic } from 'buefy'
const moment = require('moment');
const conf = require('../js/conf.js');

export default {
	components: {
		AssetsOnWallets,
		AssetsOnOdex,
		NewOdds,
		MyOdds,
	},
  props: {

	},
	data() {
		return {
			fixtures: [],
			checkedRows: [],
			new_odds: false
		}
	},
	created(){
		this.axios.get('/api/fixtures').then((response) => {

			const upcomingFixtures = response.data.filter((fixture)=>{
				return moment(fixture.date).isAfter(moment()) && moment(fixture.date).isBefore(moment().add(conf.upcoming_fixtures_max_days, 'days'))
			}).sort((a,b)=>{
				if(a.date > b.date)
					return 1;
				else
					return -1;
			});

			upcomingFixtures.forEach((fixture)=>{
				fixture.feedName = this.getFeedName(fixture);
				if (fixture.assets){
					fixture.assets.home_symbol = fixture.feedName + '-' + fixture.feedHomeTeamName;
					fixture.assets.away_symbol = fixture.feedName + '-' + fixture.feedAwayTeamName;
					fixture.assets.draw_symbol = fixture.feedName + '-DRAW';
					fixture.assets.canceled_symbol = fixture.feedName + '-CANCELED';
				}
				if (!this.$store.state.newOdds[fixture.feedName])
					this.$store.commit('setNewOdds', {feedName: fixture.feedName, odds:{home:1,draw:1, away:1, canceled: 1}});
			});

			this.fixtures = upcomingFixtures;
		})

	},
	watch:{

	},
	methods: {

		getFeedName: function(fixture){
			return fixture.championship + '_'  + fixture.feedHomeTeamName + '_' + fixture.feedAwayTeamName + '_' + fixture.localDay;
		},
		issueAsset: function(){
			ModalProgrammatic.open({
				parent: this,
				component: IssueAssetsModal,
				hasModalCard: true,
				props: { fixtures: this.checkedRows },
			})
		},
		transferToOdex: function(){
			ModalProgrammatic.open({
				parent: this,
				component: TransferToOdexModal,
				hasModalCard: true,
				props: { fixtures: this.checkedRows },
			})
		},
		prefillNewOdds: function(){
			ModalProgrammatic.open({
				parent: this,
				component: PrefillNewOdds,
				hasModalCard: true
			})
		},
		setOdexOddsForFixtures: function(){
			core.setOdexOdds(this.checkedRows);
		}
	}
}
</script>

