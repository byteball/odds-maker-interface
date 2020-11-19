<template>
	<div v-if="assocAssets[type] == assocAssets['winning_asset']">{{ assocAssets[type + '_symbol'] }}
		<span v-if="assocRequested[assocAssets[type]]"> - requested: 
			<asset-or-byte-amount :amount="assocRequested[assocAssets[type]].amount"/> {{$store.getters.operatingSymbol}}
			<a :href="explorer_url +'#' + assocRequested[assocAssets[type]].unit" target="_blank"><b-icon icon="open-in-new" /></a>
		</span>
	</div>
</template>
<script>

import AssetOrByteAmount from './commons/AssetOrByteAmount.vue'
import conf from '../js/conf.js'

export default {
	components:{
		AssetOrByteAmount
	},
  props: {
		assocRequested: Object,
		assocAssets: Object,
		type: String
	},
	data () {
		return {
		}
	},
	computed: {
		explorer_url: function(){
			return this.$store.state.connections.testnet ? conf.explorer_url.testnet : conf.explorer_url.mainnet;
		}
	},
	created() {

	},
	methods:{

	}
}
</script>

