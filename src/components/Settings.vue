<template>
	<div class="tile is-ancestor">
		<connections />
		<credentials />
		<odds-configuration />
	</div>
</template>
<script>
import Connections from './Connections.vue'
import Credentials from './Credentials.vue'
import OddsConfiguration from './OddsConfiguration.vue'

export default {
	components:{
		Connections,
		Credentials,
		OddsConfiguration
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

