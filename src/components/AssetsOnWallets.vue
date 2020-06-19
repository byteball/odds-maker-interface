<template>
	<div>
		{{home_asset}} {{draw_asset}} {{away_asset}} {{canceled_asset}}
	</div>
</template>
<script>

export default {
	components:{

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
				return this.sumBalances(this.$store.state.wallet_balances[this.assets.hometeam])
			} else
				return 0;
		},
		away_asset: function(){
			if (this.assets){
				return this.sumBalances(this.$store.state.wallet_balances[this.assets.awayteam])
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

