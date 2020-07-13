<template>
	<div>
		<div>
		<b-icon icon="wallet" class="mr-05"/>
		<asset-or-byte-amount :amount="home_asset" class="mr-05"/>
		<asset-or-byte-amount v-if="has_draw_odds" :amount="draw_asset" class="mr-05"/>
		<asset-or-byte-amount :amount="away_asset" class="mr-05"/>
		<asset-or-byte-amount v-if="has_cancel_odds" :amount="canceled_asset" class="mr-05"/>
	</div>
		<div class="buttons">
		<b-button class="is-primary" @click="issueAsset" size="is-small">issue assets</b-button>
		<b-button class="is-primary"  v-if="home_asset||draw_asset||away_asset||canceled_asset" @click="transferToOdex" size="is-small">Transfer to Odex</b-button>
	</div>
	</div>
</template>
<script>

import AssetOrByteAmount from './commons/AssetOrByteAmount.vue'
import IssueAssetsModal from './IssueAssetsModal.vue'
import { ModalProgrammatic } from 'buefy'
import TransferToOdexModal from './TransferToOdexModal.vue'


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

