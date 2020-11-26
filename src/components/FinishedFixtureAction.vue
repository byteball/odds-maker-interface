<template>
	<div class="buttons">
		<div v-if="fixture.currencies && fixture.currencies[$store.getters.operatingAsset] && fixture.currencies[$store.getters.operatingAsset].assets">
			<b-button v-if="has_winning_asset_on_odex" @click="transferToWallet"  class="is-primary" size="is-small">transfer winning assets to wallet</b-button>
			<b-button v-if="has_winning_asset_on_wallet" @click="redeemWinningAsset" class="is-primary" size="is-small">redeem winning assets from wallet</b-button>
		</div>
	</div>
</template>

<script>
//import core from '../js/core.js'
import TransferToWalletModal from './TransferAssetsToWalletModal.vue'
import RedeemAssetModal from './RedeemAssetModal.vue'

import { ModalProgrammatic } from 'buefy'

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
			const winning_asset = this.fixture.currencies[this.$store.getters.operatingAsset].assets.winning_asset;
			console.log(this.$store.state.wallet_balances[winning_asset])
			return winning_asset && this.$store.state.wallet_balances[winning_asset] 
			&& (this.$store.state.wallet_balances[winning_asset].pending > 0 || this.$store.state.wallet_balances[winning_asset].stable > 0);
		},
		has_winning_asset_on_odex: function(){
			const winning_symbol = this.fixture.currencies[this.$store.getters.operatingAsset].assets.winning_symbol;
			return winning_symbol && this.$store.state.odex_balances[winning_symbol];
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

