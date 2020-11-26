<template>
	<div>{{ assocAssets[type + '_symbol'] }}
		<span v-if="assocTransferred[assocAssets[type]]"> - transferred: 
			<asset-or-byte-amount :amount="assocTransferred[assocAssets[type]].amount"/>
			<a :href="explorer_url +'#' + assocTransferred[assocAssets[type]].unit" target="_blank"><b-icon icon="open-in-new" /></a>
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
		assocTransferred: Object,
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

