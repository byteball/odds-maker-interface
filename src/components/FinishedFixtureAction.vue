<template>
	<div class="buttons">
		<b-button v-if="has_winning_asset_on_odex" @click="transferToWallet"  class="is-primary" size="is-small">transfer winning assets to wallet</b-button>
		<b-button v-if="has_winning_asset_on_wallet" @click="redeemWinningAsset" class="is-primary" size="is-small">redeem winning assets from wallet</b-button>
	</div>
</template>

<script>
//import core from '../js/core.js'
import TransferToWalletModal from './TransferToWalletModal.vue'
import RedeemAssetModal from './RedeemAssetModal.vue'

import { ModalProgrammatic } from 'buefy'

//const moment = require('moment');
//const conf = require('../js/conf.js');

export default {
	components: {
	},
  props: {
		fixture: Object
	},
	data() {
		return {
			
		}
	},
	computed:{
		has_winning_asset_on_wallet: function(){
			return this.fixture.winning_asset && this.$store.state.wallet_balances[this.fixture.winning_asset];
		},
		has_winning_asset_on_odex: function(){
			return this.fixture.winning_symbol && this.$store.state.odex_balances[this.fixture.winning_symbol];
		},

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
				props: { fixtures: [this.fixture] },
			})
		},
		redeemWinningAsset: function(){
			ModalProgrammatic.open({
				parent: this,
				component: RedeemAssetModal,
				hasModalCard: true,
				props: { fixtures: [this.fixture] },
			})
		},
	}
}
</script>

