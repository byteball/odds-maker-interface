<template>
<div>
	<div class="columns">
		<span class="title is-6 mr-05 mt-05">For selection: </span>
		<div class="buttons column">
			<b-button @click="issueAsset" :disabled="!checkedRows.length" class="is-pulled-left is-primary">Issue asset</b-button>
			<b-button @click="transferToOdex" :disabled="!checkedRows.length" class="is-pulled-left is-primary">Transfer to Odex</b-button>
			<b-button @click="setOdexOddsForFixtures" :disabled="!checkedRows.length" class="is-pulled-left is-primary">set odds</b-button>
		</div>
		<div class="buttons column">
			<b-button @click="prefillNewOdds" class="is-primary">Get external odds</b-button>
		</div>
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

			<b-table-column label="Balances"  field="on_wallet" custom-key='on_wallet' >
				<assets-on-wallets :fixture="props.row" />
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
import NewOdds from './UpcomingFixturesTableNewOdds.vue'
import MyOdds from './UpcomingFixturesTableMyOdds.vue'
import moment from 'moment';

import core from '../js/core.js'

import { ModalProgrammatic } from 'buefy'
//import conf from '../js/conf.js'

export default {
	components: {
		AssetsOnWallets,
		AssetsOnOdex,
		NewOdds,
		MyOdds,
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

