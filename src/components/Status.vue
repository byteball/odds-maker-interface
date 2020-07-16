<template>
	<div>
		<b-loading :is-full-page="false" :active.sync="$store.state.isConnecting" ></b-loading>
		<div v-if="$store.state.wallet_balances.base" class="level">
			<div class="level-item has-text-centered">
				<div>
					<p class="heading">Stable wallet balance</p>
					<p class="title"><asset-or-byte-amount :amount="$store.state.wallet_balances.base.stable || 0" /> GB
						<b-button @click="transferToExternalAddress" v-if="$store.state.wallet_balances.base.stable" style="margin-top:0.5em;" class="is-primary" size="is-small">withdraw</b-button>
					</p>
				</div>
			</div>
			<div v-if="$store.state.wallet_balances.base.pending" class="level-item has-text-centered">
				<div>
					<p class="heading">Pending wallet balance</p>
					<p class="title"><asset-or-byte-amount :amount="$store.state.wallet_balances.base.pending || 0" /> GB</p>
				</div>
			</div>
			<div v-if="$store.state.odex_balances.GBYTE" class="level-item has-text-centered">
				<div>
					<p class="heading">Odex balance</p>
					<p class="title"><asset-or-byte-amount :amount="$store.state.odex_balances.GBYTE || 0" /> GB
					<b-button @click="transferToWallet" style="margin-top:0.5em;" class="is-primary" size="is-small">transfer to wallet</b-button>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>

import AssetOrByteAmount from './commons/AssetOrByteAmount.vue'
import TransferBytesToWalletModal from './TransferBytesToWalletModal.vue'
import TransferBytesToExternalAddressModal from './TransferBytesToExternalAddressModal.vue'
import { ModalProgrammatic } from 'buefy'


export default {
	components:{
		AssetOrByteAmount
	},
  props: {
	},
	data () {
		return {
		
		}
	},
	computed: {
	
	},
	created() {
	
	},
	methods:{
		transferToWallet: function(){
			ModalProgrammatic.open({
				parent: this,
				component: TransferBytesToWalletModal,
				hasModalCard: true,
			})
		},
		transferToExternalAddress: function(){
			ModalProgrammatic.open({
				parent: this,
				component: TransferBytesToExternalAddressModal,
				hasModalCard: true,
			})
		},
	}
}
</script>

