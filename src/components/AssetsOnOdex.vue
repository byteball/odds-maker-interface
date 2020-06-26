<template>
	<div>
		<b-icon icon="arrow-left-right-bold" class="mr-05"/>
		
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
		fixture:Object,
	},
	data () {
		return {
			feedName : this.fixture.championship + '_' + this.fixture.feedHomeTeamName + '_' + this.fixture.feedAwayTeamName + '_' + this.fixture.localDay
		}
	},
	computed: {
		home_asset: function(){
			return this.$store.state.odex_balances[this.feedName+ '-' + this.fixture.feedHomeTeamName] || 0;

		},
		away_asset: function(){
			return this.$store.state.odex_balances[this.feedName+ '-' + this.fixture.feedAwayTeamName] || 0;

		},
		draw_asset: function(){
			return this.$store.state.odex_balances[this.feedName+ '-DRAW'] || 0;

		},
		canceled_asset: function(){
			return this.$store.state.odex_balances[this.feedName+ '-CANCELED'] || 0;
		},
	},
	created() {

	},
	methods:{

	}
}
</script>

