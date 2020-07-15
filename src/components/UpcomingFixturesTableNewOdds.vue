<template>
	<div v-if="has_odex_balance" >
		<div class="columns">
			<div class="column is-2">
				<b-field>
					<b-numberinput  v-model="$store.state.newOdds[fixture.feedName]['home']" :step="0.01" :controls="false" size="is-small"></b-numberinput>
				</b-field>
			</div>
			<div v-if="has_draw_odds" class="column is-2">
				<b-field>
					<b-numberinput v-model="$store.state.newOdds[fixture.feedName]['draw']" :step="0.01" :controls="false" size="is-small"></b-numberinput>
				</b-field>
			</div>
			<div class="column is-2">
				<b-field>
					<b-numberinput v-model="$store.state.newOdds[fixture.feedName]['away']" :step="0.01" :controls="false" size="is-small"></b-numberinput>
				</b-field>
			</div>
			<div v-if="has_cancel_odds" class="column is-2">
				<b-field>
					<b-numberinput  v-model="$store.state.newOdds[fixture.feedName]['canceled']" :step="0.01" :controls="false" size="is-small"></b-numberinput>
				</b-field>
			</div>
			<div class="column is-2">
				<b-button class="is-primary" @click="setOdexOdds(fixture)" size="is-small">set odds</b-button>
			</div>
		</div>
	</div>
	<div v-else-if="has_wallet_balance">
		Transfer assets to Odex before setting your odds
	</div>
</template>



<script>
import core from '../js/core.js'

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
		has_odex_balance: function(){
			return this.$store.state.odex_balances[this.fixture.feedName+ '-' + this.fixture.feedHomeTeamName]
			|| this.$store.state.odex_balances[this.fixture.feedName+ '-' + this.fixture.feedAwayTeamName]
			|| this.$store.state.odex_balances[this.fixture.feedName+ '-DRAW']
			|| this.$store.state.odex_balances[this.fixture.feedName+ '-CANCELED']
		},
		has_wallet_balance: function(){
			return this.fixture.assets && (this.$store.state.wallet_balances[this.fixture.assets.home]
			|| this.$store.state.wallet_balances[this.fixture.assets.draw]
			|| this.$store.state.wallet_balances[this.fixture.assets.away]
			|| this.$store.state.wallet_balances[this.fixture.assets.canceled])
		},
		has_cancel_odds:function(){
			return this.$store.state.odds_configuration && this.$store.state.odds_configuration.with_cancel_championships[this.fixture.championship]
		},
		has_draw_odds:function(){
			return this.$store.state.odds_configuration && this.$store.state.odds_configuration.with_draw_championships[this.fixture.championship]
		},

	},
	created(){
	

	},
	watch:{

	},
	methods: {

		setOdexOdds: function(fixture){
			core.setOdexOdds([fixture]);
		}
	}
}


</script>