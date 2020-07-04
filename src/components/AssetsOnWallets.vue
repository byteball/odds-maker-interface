<template>
	<div>
		<b-icon icon="wallet" class="mr-05"/>
		<asset-or-byte-amount :amount="home_asset" class="mr-05"/>
		<asset-or-byte-amount :amount="draw_asset" class="mr-05"/>
		<asset-or-byte-amount :amount="away_asset" class="mr-05"/>
		<asset-or-byte-amount :amount="canceled_asset" class="mr-05"/>
	</div>
</template>
<script>

import AssetOrByteAmount from './commons/AssetOrByteAmount.vue'


export default {
	components:{
		AssetOrByteAmount
	},
  props: {
		assets: Object
	},
	data () {
		return {

		}
	},
	computed: {
		home_asset: function(){
			if (this.assets){
				return this.sumBalances(this.$store.state.wallet_balances[this.assets.home])
			} else
				return 0;
		},
		away_asset: function(){
			if (this.assets){
				return this.sumBalances(this.$store.state.wallet_balances[this.assets.away])
			} else
				return 0;
		},
		draw_asset: function(){
			if (this.assets){
				return this.sumBalances(this.$store.state.wallet_balances[this.assets.draw])
			} else
				return 0;
		},
		canceled_asset: function(){
			if (this.assets){
				return this.sumBalances(this.$store.state.wallet_balances[this.assets.canceled])
			} else
				return 0;
		},
	},
	created() {

	},
	methods:{
		sumBalances: function(balances){
			if(!balances)
				return 0;
			return balances.stable + balances.pending



		}
	}
}
</script>

