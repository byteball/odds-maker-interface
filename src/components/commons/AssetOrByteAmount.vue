<template>
	<span>
		<span v-if="label"> {{label}}</span>
		<span :style="amountStyle">{{amount/decimalsFactor >=1 ? ((amount/decimalsFactor).toPrecision(6)/1).toLocaleString(): ((amount/decimalsFactor).toPrecision(6)/1)}}</span>
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
			isNegative: {
				type: Boolean,
				required: false,
			},
			isPositive: {
				type: Boolean,
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
			},
			amountStyle: function(){
				if (this.isNegative)
					return {
						color: 'red'
					};
				if (this.isPositive)
					return {
						color: 'green'
					};
				return {

				};

			}
		},
	}
</script>

<style lang='scss' scoped>

</style>


