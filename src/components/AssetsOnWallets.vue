<template>
	<div>
		<b-icon icon="wallet" class="mr-05"/>
		<b-tooltip type="is-info" label="home asset on wallet"><asset-or-byte-amount :amount="home_asset_balance" class="mr-05"/></b-tooltip> 
		<b-tooltip v-if="has_draw_odds" type="is-info" label="draw asset on wallet"><asset-or-byte-amount :amount="draw_asset_balance" class="mr-05"/></b-tooltip>
		<b-tooltip type="is-info" label="away asset on wallet"><asset-or-byte-amount :amount="away_asset_balance" class="mr-05"/></b-tooltip>
		<b-tooltip v-if="has_cancel_odds" type="is-info" label="canceled asset on wallet"><asset-or-byte-amount :amount="canceled_asset_balance" class="mr-05"/></b-tooltip>
	</div>
</template>
<script>

import AssetOrByteAmount from './commons/AssetOrByteAmount.vue'

export default {
	components:{
		AssetOrByteAmount
	},
  props: {
		fixture: Object
	},
	data () {
		return {

		}
	},
	computed: {
		has_cancel_odds:function(){
			return this.$store.state.odds_configuration && this.$store.state.odds_configuration.with_cancel_championships[this.fixture.championship]
		},
		has_draw_odds:function(){
			return this.$store.state.odds_configuration && this.$store.state.odds_configuration.with_draw_championships[this.fixture.championship]
		},
		home_asset_balance: function(){
			return this.getAssetBalanceOnWalletForOutcome('home');
		},
		away_asset_balance: function(){
			return this.getAssetBalanceOnWalletForOutcome('away');
		},
		draw_asset_balance: function(){
			return this.getAssetBalanceOnWalletForOutcome('draw');
		},
		canceled_asset_balance: function(){
			return this.getAssetBalanceOnWalletForOutcome('canceled');
		},
	},
	created() {

	},
	methods:{
		getAssetBalanceOnWalletForOutcome(outcome){
			if (this.$store.state.wallet_balances && this.fixture.currencies
				&& this.fixture.currencies[this.$store.getters.operatingAsset]
				&& this.fixture.currencies[this.$store.getters.operatingAsset].assets
				&& this.$store.state.wallet_balances[this.fixture.currencies[this.$store.getters.operatingAsset].assets[outcome]]){
					return this.$store.state.wallet_balances[this.fixture.currencies[this.$store.getters.operatingAsset].assets[outcome]].stable || 0
				} else
					return 0;
		}
	}
}
</script>

