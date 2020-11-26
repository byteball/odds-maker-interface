<template>
	<div v-if="fixture.currencies && fixture.currencies[$store.getters.operatingAsset] && fixture.currencies[$store.getters.operatingAsset].assets">
		<b-icon icon="arrow-left-right-bold" class="mr-05"/>
		<b-tooltip type="is-info" label="home asset on Odex">
			<asset-or-byte-amount 
			:amount="home_asset" 
			class="mr-05" 
			:isNegative="fixture.result && fixture.result !== 'home'" 
			:isPositive="fixture.result == 'home'"
			/>
		</b-tooltip>
		<b-tooltip v-if="has_draw_odds" type="is-info" label="draw asset on Odex">
			<asset-or-byte-amount  
			:amount="draw_asset" 
			class="mr-05"
			:isNegative="fixture.result && fixture.result !== 'draw'" 
			:isPositive="fixture.result == 'draw'"
			/>
		</b-tooltip>
		<b-tooltip type="is-info" label="away asset on Odex">
			<asset-or-byte-amount 
			:amount="away_asset" 
			class="mr-05"
			:isNegative="fixture.result && fixture.result !== 'away'" 
			:isPositive="fixture.result == 'away'"
			/>
		</b-tooltip>
		<b-tooltip v-if="has_cancel_odds" type="is-info" label="canceled asset on Odex">
			<asset-or-byte-amount 
			:amount="canceled_asset" 
			class="mr-05"
			:isNegative="fixture.result && fixture.result !== 'canceled'" 
			:isPositive="fixture.result == 'canceled'"
			/>
		</b-tooltip>
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
			return this.$store.state.odex_balances[this.fixture.feedName+ '-' + this.fixture.feedHomeTeamName + '-' + this.$store.getters.operatingSymbol] || 0;
		},
		away_asset: function(){
			return this.$store.state.odex_balances[this.fixture.feedName+ '-' + this.fixture.feedAwayTeamName + '-' + this.$store.getters.operatingSymbol] || 0;
		},
		draw_asset: function(){
			return this.$store.state.odex_balances[this.fixture.feedName+ '-DRAW'+ '-' + this.$store.getters.operatingSymbol] || 0;
		},
		canceled_asset: function(){
			return this.$store.state.odex_balances[this.fixture.feedName+ '-CANCELED'+ '-' + this.$store.getters.operatingSymbol] || 0;
		},

	},
	created() {
	},
	methods:{

	}
}
</script>

