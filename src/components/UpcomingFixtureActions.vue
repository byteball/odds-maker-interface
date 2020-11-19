<template>
	<div class="buttons">
		<b-button class="is-primary" @click="issueAsset" size="is-small">issue assets</b-button>
		<b-button class="is-primary"  v-if="has_assets_on_wallet" @click="transferToOdex" size="is-small">transfer to Odex</b-button>
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
		has_assets_on_wallet: function(){
			if (this.$store.state.wallet_balances && this.fixture.currencies
					&& this.fixture.currencies[this.$store.getters.operatingAsset]
					&& this.fixture.currencies[this.$store.getters.operatingAsset].assets){
				if (this.sumPendingAndStable(this.fixture.currencies[this.$store.getters.operatingAsset].assets['home']) > 0)
					return true;
				if (this.sumPendingAndStable(this.fixture.currencies[this.$store.getters.operatingAsset].assets['draw']) > 0)
					return true;
				if (this.sumPendingAndStable(this.fixture.currencies[this.$store.getters.operatingAsset].assets['away']) > 0)
					return true;
				if (this.sumPendingAndStable(this.fixture.currencies[this.$store.getters.operatingAsset].assets['canceled']) > 0)
					return true;
				return false;
			} else
				return false;
		}
	},
	created() {

	},
	methods:{
		sumPendingAndStable(asset){
			if (!this.$store.state.wallet_balances[asset])
				return 0;
			return this.$store.state.wallet_balances[asset].stable + this.$store.state.wallet_balances[asset].pending
		},
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

