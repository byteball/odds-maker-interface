<template>
	<div>
		<div class="buttons">
			<span class="title is-6 mr-05 mt-05">For selection: </span>
			<b-button @click="transferToWallet" :disabled="!checkedRows.length" class="is-pulled-left is-primary">Transfer winning assets to wallet</b-button>
			<b-button @click="redeemWinningAsset" :disabled="!checkedRows.length" class="is-pulled-left is-primary">Redeem winning assets from wallet</b-button>

		</div>
		{{checkedRows}}
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
					<div>
						{{props.row.dateMoment.local().format('YYYY-MM-DD HH:mm:ss')}}
					</div>
					<div>
						{{moment().to(props.row.dateMoment)}}
					</div>
				</b-table-column>

				<b-table-column label="Assets"  field="on_wallet" custom-key='on_wallet' >
					<assets-on-wallets :fixture="props.row" />
					<assets-on-odex :fixture="props.row" />
				</b-table-column>

			</template>

		</b-table>
	</div>
</template>

<script>
//import core from '../js/core.js'
import AssetsOnWallets from './AssetsOnWallets.vue'
import AssetsOnOdex from './AssetsOnOdex.vue'
import TransferToWalletModal from './TransferToWalletModal.vue'
import RedeemAssetModal from './RedeemAssetModal.vue'
import moment from 'moment';

import { ModalProgrammatic } from 'buefy'

//const moment = require('moment');
//const conf = require('../js/conf.js');

export default {
	components: {
		AssetsOnWallets,
		AssetsOnOdex,
	},
  props: {
		fixtures: Array
	},
	data() {
		return {
			checkedRows: [],
			moment
		}
	},
	created(){
	

	},
	watch:{

	},
	methods: {

		transferToWallet: function(){
			ModalProgrammatic.open({
				parent: this,
				component: TransferToWalletModal,
				hasModalCard: true,
				props: { fixtures: this.checkedRows },
			})
		},
		redeemWinningAsset: function(){
			ModalProgrammatic.open({
				parent: this,
				component: RedeemAssetModal,
				hasModalCard: true,
				props: { fixtures: this.checkedRows },
			})
		},
	}
}
</script>

