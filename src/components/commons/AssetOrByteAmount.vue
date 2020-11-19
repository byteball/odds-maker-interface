<template>
	<span>
		<span v-if="label"> {{label}}</span>
		<span>{{amount/decimalsFactor >=1 ? ((amount/decimalsFactor).toPrecision(6)/1).toLocaleString(): ((amount/decimalsFactor).toPrecision(6)/1)}}</span>
	</span>
</template>

<script>

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
			}
		},
		computed: {
			decimalsFactor: function(){
				return 10 ** this.$store.getters.operatingDecimals;
			}
		},
	}
</script>

<style lang='scss' scoped>

</style>


