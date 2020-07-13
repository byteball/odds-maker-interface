<template>
	<span>
		<span v-if="label"> {{label}}</span>
		<span>{{amount/gb_to_bytes >=1 ? ((amount/gb_to_bytes).toPrecision(6)/1).toLocaleString(): ((amount/gb_to_bytes).toPrecision(6)/1)}}</span>
	</span>
</template>

<script>
	const conf = require('../../js/conf.js')

	export default {
		props: {
			amount: {
				type: Number,
				required: true,
			},
			label: {
				type: String,
				required: false,
			},
		},
		data () {
			return {
				gb_to_bytes: conf.gb_to_bytes,
			}
		},
		computed: {

		},
	}
</script>

<style lang='scss' scoped>

</style>


