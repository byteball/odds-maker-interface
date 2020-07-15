<template>
	<div>
		<div v-if="fixture.assets" class="columns">
			<div class="column is-2">
				<b-field>
					<template slot="label">
							<a :href="conf.odex_url + 'trade/' + fixture.assets.home_symbol + '/GBYTE'" target="_blank" >home	<b-icon icon="open-in-new" /></a>
					</template>
					<b-tooltip type="is-info" label="your current home odds">
						<b-numberinput  v-model="home_odds" :step="0.01" :controls="false" size="is-small" disabled></b-numberinput>
					</b-tooltip>
				</b-field>
			</div>
			<div v-if="has_draw_odds" class="column is-2">
				<b-field >
					<template slot="label">
						<a :href="conf.odex_url + 'trade/' + fixture.assets.draw_symbol + '/GBYTE'" target="_blank" >draw<b-icon icon="open-in-new" /></a>
					</template>
					<b-tooltip type="is-info" label="your current draw odds">
						<b-numberinput v-model="draw_odds" :step="0.01" :controls="false" size="is-small" disabled></b-numberinput>
					</b-tooltip>
				</b-field>
			</div>
			<div class="column is-2">
				<b-field>
					<template slot="label">
						<a :href="conf.odex_url + 'trade/' + fixture.assets.away_symbol + '/GBYTE'" target="_blank" >away<b-icon icon="open-in-new" /></a>
					</template>
					<b-tooltip type="is-info" label="your current away odds">
						<b-numberinput v-model="away_odds" :step="0.01" :controls="false" size="is-small" disabled></b-numberinput>
					</b-tooltip>
				</b-field>
			</div>
			<div v-if="has_cancel_odds" class="column is-2">
				<b-field>
					<template slot="label">
						<a :href="conf.odex_url + 'trade/' + fixture.assets.canceled_symbol + '/GBYTE'" target="_blank" >canceled<b-icon icon="open-in-new" /></a>
					</template>
					<b-tooltip type="is-info" label="your current canceled odds">
						<b-numberinput  v-model="canceled_odds" :step="0.01" :controls="false" size="is-small" disabled></b-numberinput>
					</b-tooltip>
				</b-field>
			</div>
			<div class="column is-2">
				<b-button v-if="home_odds||away_odds||draw_odds||canceled_odds" @click="cancelOdds" type="is-small" class="is-primary">cancel odds</b-button>
			</div>
		</div>
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
		has_cancel_odds:function(){
			return this.$store.state.odds_configuration && this.$store.state.odds_configuration.with_cancel_championships[this.fixture.championship]
		},
		has_draw_odds:function(){
			return this.$store.state.odds_configuration && this.$store.state.odds_configuration.with_draw_championships[this.fixture.championship]
		},
		home_odds: function(){
			if (!this.fixture.assets)
				return null;
			return this.$store.state.myOdexOddsByAsset[this.fixture.assets.home] || null;
		},
		away_odds: function(){
			if (!this.fixture.assets)
				return null;
			return this.$store.state.myOdexOddsByAsset[this.fixture.assets.away] || null;
		},
		draw_odds: function(){
			if (!this.fixture.assets)
				return null;
			return this.$store.state.myOdexOddsByAsset[this.fixture.assets.draw] || null;
		},
		canceled_odds: function(){
			if (!this.fixture.assets)
				return null;
			return this.$store.state.myOdexOddsByAsset[this.fixture.assets.canceled] || null;
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

