<template>
	<div>
		<b-icon icon="wallet" class="mr-05"/>
		<b-tooltip type="is-info" label="home asset on wallet"><asset-or-byte-amount :amount="home_asset" class="mr-05"/></b-tooltip> 
		<b-tooltip v-if="has_draw_odds" type="is-info" label="draw asset on wallet"><asset-or-byte-amount :amount="draw_asset" class="mr-05"/></b-tooltip>
		<b-tooltip type="is-info" label="away asset on wallet"><asset-or-byte-amount :amount="away_asset" class="mr-05"/></b-tooltip>
		<b-tooltip v-if="has_cancel_odds" type="is-info" label="canceled asset on wallet"><asset-or-byte-amount :amount="canceled_asset" class="mr-05"/></b-tooltip>
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
		home_asset: function(){
			if (this.fixture.assets && this.$store.state.wallet_balances[this.fixture.assets.home]){
				return this.$store.state.wallet_balances[this.fixture.assets.home].stable || 0
			} else
				return 0;
		},
		away_asset: function(){
			if (this.fixture.assets && this.$store.state.wallet_balances[this.fixture.assets.away]){
				return this.$store.state.wallet_balances[this.fixture.assets.away].stable || 0
			} else
				return 0;
		},
		draw_asset: function(){
			if (this.fixture.assets && this.$store.state.wallet_balances[this.fixture.assets.draw]){
				return this.$store.state.wallet_balances[this.fixture.assets.draw].stable || 0
			} else
				return 0;
		},
		canceled_asset: function(){
			if (this.fixture.assets && this.$store.state.wallet_balances[this.fixture.assets.canceled]){
				return this.$store.state.wallet_balances[this.fixture.assets.canceled].stable || 0
			} else
				return 0;
		},
	},
	created() {

	},
	methods:{
	}
}
</script>

