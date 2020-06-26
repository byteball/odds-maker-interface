<template>
<div>
<b-button @click="issueAsset">Issue asset</b-button>
<b-button @click="transferToOdex">Transfer to Odex</b-button>
<b-button @click="prefillNewOdds">Prefill new odds</b-button>

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
				{{props.row.feedName}}
				<div v-if="$store.state.newOdds[props.row.feedName]" class="columns">
					<div class="column is-3">
						<b-field label='home'>
							<b-numberinput  v-model="$store.state.newOdds[props.row.feedName][0]" :step="0.01"></b-numberinput>
						</b-field>
					</div>
					<div class="column is-3">
						<b-field label='draw'>
							<b-numberinput v-model="$store.state.newOdds[props.row.feedName][1]" :step="0.01"></b-numberinput>
						</b-field>
					</div>
					<div class="column is-3">
						<b-field label='away'>
							<b-numberinput v-model="$store.state.newOdds[props.row.feedName][2]" :step="0.01"></b-numberinput>
						</b-field>
					</div>
					<div class="column is-3">
						<b-field label='canceled'>
							<b-numberinput  v-model="$store.state.newOdds[props.row.feedName][3]" :step="0.01"></b-numberinput>
						</b-field>
					</div>
				</div>
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

import { ModalProgrammatic } from 'buefy'

export default {
	components: {
		AssetsOnWallets,
		AssetsOnOdex,
	},
  props: {
    msg: String
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
			console.log(response.data);
			response.data.forEach((fixture)=>{
				fixture.feedName = this.getFeedName(fixture);
				if (fixture.assets){
					fixture.assets.home_symbol = fixture.feedName + '-' + fixture.feedHomeTeamName;
					fixture.assets.away_symbol = fixture.feedName + '-' + fixture.feedAwayTeamName;
					fixture.assets.draw_symbol = fixture.feedName + '-DRAW';
					fixture.assets.canceled_symbol = fixture.feedName + '-CANCELED';
				}
				if (!this.$store.state.newOdds[fixture.feedName])
					this.$store.commit('setNewOdds', {feedName: fixture.feedName, odds:[1,1,1,1]});
			});

			this.fixtures = response.data.sort((a,b)=>{
				if(a.date > b.date){
					return 1;
				}
				else{
					return -1;
				}
			});
		})

	},
	watch:{

	},
	methods: {

		getFeedName: function(fixture){
			return fixture.championship + '_'  + fixture.feedHomeTeamName + '_' + fixture.feedAwayTeamName + '_' + fixture.localDay;
		},
		issueAsset: async function(){
				ModalProgrammatic.open({
					parent: this,
					component: IssueAssetsModal,
					hasModalCard: true,
					props: { fixtures: this.checkedRows },
				})
		},
		transferToOdex: async function(){
				ModalProgrammatic.open({
					parent: this,
					component: TransferToOdexModal,
					hasModalCard: true,
					props: { fixtures: this.checkedRows },
				})
		},
		prefillNewOdds: async function(){
				ModalProgrammatic.open({
					parent: this,
					component: PrefillNewOdds,
					hasModalCard: true
				})
		},

		
	
	}
}
</script>

