<template>
	<div>
		<b-loading :is-full-page="false" :active.sync="$store.state.isConnecting" ></b-loading>
		<span v-if="$store.state.wallet_balances.base && $store.state.wallet_balances.base.stable">
			Stable on wallet:	<asset-or-byte-amount :amount="$store.state.wallet_balances.base.stable" class="mr-05"/>GB
		</span>
		<span v-if="$store.state.wallet_balances.base && $store.state.wallet_balances.base.pending">
			Pending on wallet:	<asset-or-byte-amount :amount="$store.state.wallet_balances.base.pending" class="mr-05"/>GB
		</span>
	</div>
</template>
<script>

import AssetOrByteAmount from './commons/AssetOrByteAmount.vue'


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

	}
}
</script>

