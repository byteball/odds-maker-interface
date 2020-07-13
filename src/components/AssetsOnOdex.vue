<template>
	<div v-if="fixture.assets">
		<b-icon icon="arrow-left-right-bold" class="mr-05"/>
			<a :href="conf.odex_url + 'trade/' + fixture.assets.home_symbol + '/GBYTE'" target="_blank" ><asset-or-byte-amount :amount="home_asset" class="mr-05"/></a>
		<a v-if="has_draw_odds" :href="conf.odex_url + 'trade/' + fixture.assets.draw_symbol + '/GBYTE'" target="_blank"><asset-or-byte-amount :amount="draw_asset" class="mr-05"/></a>
		<a :href="conf.odex_url + 'trade/' + fixture.assets.away_symbol + '/GBYTE'" target="_blank"><asset-or-byte-amount :amount="away_asset" class="mr-05"/></a>
		<a v-if="has_cancel_odds" :href="conf.odex_url + 'trade/' + fixture.assets.canceled_symbol + '/GBYTE'" target="_blank"><asset-or-byte-amount :amount="canceled_asset" class="mr-05"/></a>
	</div>
</template>
<script>

const conf = require('../js/conf.js')
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
			conf,
			feedName : this.fixture.championship + '_' + this.fixture.feedHomeTeamName + '_' + this.fixture.feedAwayTeamName + '_' + this.fixture.localDay
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

