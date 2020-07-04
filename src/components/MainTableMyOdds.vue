<template>
	<div v-if="fixture.assets">
		<b-icon icon="arrow-left-right-bold" class="mr-05"/>
		<span class="mr-05"><a :href="conf.odex_url + 'trade/' + fixture.assets.home_symbol + '/GBYTE'" target="_blank">{{home_odds}}</a></span>
		<span class="mr-05"><a :href="conf.odex_url + 'trade/' + fixture.assets.draw_symbol + '/GBYTE'" target="_blank">{{away_odds}}</a></span>
		<span class="mr-05"><a :href="conf.odex_url + 'trade/' + fixture.assets.away_symbol + '/GBYTE'" target="_blank">{{draw_odds}}</a></span>
		<span class="mr-05"><a :href="conf.odex_url + 'trade/' + fixture.assets.canceled_symbol + '/GBYTE'" target="_blank">{{canceled_odds}}</a></span>
		<b-button @click="cancelOdds" type="is-small" class="is-primary">cancel odds</b-button>
	</div>
</template>
<script>

import conf from '../js/conf.js'
import core from '../js/core.js'

export default {
	components:{
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
		home_odds: function(){
			if (!this.fixture.assets)
				return 'x';
			return this.$store.state.myOdexOddsByAsset[this.fixture.assets.home] || 'x';
		},
		away_odds: function(){
			if (!this.fixture.assets)
				return 'x';
			return this.$store.state.myOdexOddsByAsset[this.fixture.assets.away] || 'x';
		},
		draw_odds: function(){
			if (!this.fixture.assets)
				return 'x';
			return this.$store.state.myOdexOddsByAsset[this.fixture.assets.draw] || 'x';
		},
		canceled_odds: function(){
			if (!this.fixture.assets)
				return 'x';
			return this.$store.state.myOdexOddsByAsset[this.fixture.assets.canceled] || 'x';
		},
	},
	created() {

	},
	methods:{
		cancelOdds: function(){
			core.cancelOdexOddsForFixture(this.fixture);
		}
	}
}
</script>

