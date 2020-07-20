<template>
<div>
	<div class="buttons">
		<b-button @click="getExternalOdds" class="is-primary">Get external odds</b-button>
		<span class="ml-1 mr-05">For selection: </span>
		<b-button @click="issueAsset" :disabled="!checkedRows.length" class="is-pulled-left is-primary">Issue asset</b-button>
		<b-button @click="transferToOdex" :disabled="!checkedRows.length" class="is-pulled-left is-primary">Transfer to Odex</b-button>
	</div>

	<b-table 
	:data="fixtures"
	:checked-rows.sync="checkedRows"	
	checkable 
	>
		<template slot-scope="props">

			<b-table-column label="Championship" field="championship" custom-key='championship' >
				{{$t(props.row.championship)}}
			</b-table-column>
			<b-table-column label="Home team" field="homeTeam" custom-key='homeTeam' >
				{{props.row.homeTeam}}
			</b-table-column>

			<b-table-column label="Away team" field="awayTeam" custom-key='awayTeam' >
				{{props.row.awayTeam}}
			</b-table-column>

			<b-table-column label="Date/time" field="date" custom-key='date' >
				<div>
					{{props.row.dateMoment.local().format('YYYY-MM-DD HH:mm:ss')}}
				</div>
				<div>
					{{moment().to(props.row.dateMoment)}}
				</div>
			</b-table-column>

			<b-table-column label="Balances by asset"  field="on_wallet" custom-key='on_wallet' >
				<assets-on-wallets :fixture="props.row" />
				<fixture-actions :fixture="props.row" />
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
import AssetsOnWallets from './AssetsOnWallets.vue'
import AssetsOnOdex from './AssetsOnOdex.vue'
import TransferToOdexModal from './TransferToOdexModal.vue'
import IssueAssetsModal from './IssueAssetsModal.vue'
import GetExternalOdds from './GetExternalOdds.vue'
import NewOdds from './UpcomingFixturesTableNewOdds.vue'
import MyOdds from './UpcomingFixturesTableMyOdds.vue'
import FixtureActions from './UpcomingFixtureActions.vue'
import moment from 'moment';
import { EventBus } from '../js/event-bus.js';
import { ModalProgrammatic } from 'buefy'
import core from '../js/core.js'


export default {
	components: {
		AssetsOnWallets,
		AssetsOnOdex,
		NewOdds,
		MyOdds,
		FixtureActions
	},
  props: {
		fixtures: Array
	},
	data() {
		return {
			checkedRows: [],
			new_odds: false,
			moment
		}
	},
	created(){
		EventBus.$on('setOddsForChampionship', async (championship)=>{
			const arrFixtures = this.fixtures.filter(fixture => fixture.championship == championship)
			const nb_odds_set = await core.setOdexOdds(arrFixtures);
			EventBus.$emit('oddsSet', nb_odds_set);
			return this.$buefy.toast.open({
				duration: 5000,
				message: nb_odds_set + " odds set",
				position: 'is-bottom',
				type: 'is-success'
			})
		});

	},
	computed: {


	},
	watch:{

	},
	methods: {
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
		getExternalOdds: function(){
			ModalProgrammatic.open({
				parent: this,
				component: GetExternalOdds,
				hasModalCard: true,
			})
		}
	}
}
</script>

