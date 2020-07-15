<template>
	<div class="buttons">
		<b-button class="is-primary" @click="issueAsset" size="is-small">issue assets</b-button>
		<b-button class="is-primary"  v-if="home_asset||draw_asset||away_asset||canceled_asset" @click="transferToOdex" size="is-small">transfer to Odex</b-button>
	</div>
</template>
<script>

import IssueAssetsModal from './IssueAssetsModal.vue'
import { ModalProgrammatic } from 'buefy'
import TransferToOdexModal from './TransferToOdexModal.vue'


export default {
	components:{
		
	},
  props: {
		fixture: Object
	},
	data () {
		return {

		}
	},
	computed: {
		home_asset: function(){
			if (this.fixture.assets){
				return this.sumBalances(this.$store.state.wallet_balances[this.fixture.assets.home])
			} else
				return 0;
		},
		away_asset: function(){
			if (this.fixture.assets){
				return this.sumBalances(this.$store.state.wallet_balances[this.fixture.assets.away])
			} else
				return 0;
		},
		draw_asset: function(){
			if (this.fixture.assets){
				return this.sumBalances(this.$store.state.wallet_balances[this.fixture.assets.draw])
			} else
				return 0;
		},
		canceled_asset: function(){
			if (this.fixture.assets){
				return this.sumBalances(this.$store.state.wallet_balances[this.fixture.assets.canceled])
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

		},
		issueAsset: function(){
			ModalProgrammatic.open({
				parent: this,
				component: IssueAssetsModal,
				hasModalCard: true,
				props: { fixtures: [this.fixture] },
			})
		},
		transferToOdex: function(){
			ModalProgrammatic.open({
				parent: this,
				component: TransferToOdexModal,
				hasModalCard: true,
				props: { fixtures: [this.fixture] },
			})
		},
	}
}
</script>

