<template>
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Transfer bytes to wallet</p>
			<button class="delete" aria-label="close" @click="$parent.close()"></button>
		</header>	
		<section class="modal-card-body">

			<div class="container">
				<b-field label="Amount" :message="amount_message" >
					<b-numberinput v-model="amount" :max="available_amount" :controls="false" :step="0.000000001"></b-numberinput>
				</b-field>
				<b-button v-if="!unit && !is_requesting" @click="transfer" class="is-primary">Transfer <asset-or-byte-amount :amount="amount*conf.gb_to_bytes"/> GB to wallet</b-button>
				<div v-if="unit">
				Transfer requested, balance will appear once confirmed. <a :href="conf.explorer_url +'#' + unit" target="_blank"><b-icon icon="open-in-new" /></a>
				</div>
			</div>
		</section>

	</div>
</template>
<script>
const conf = require('../js/conf.js')
import core from '../js/core.js'
import AssetOrByteAmount from './commons/AssetOrByteAmount.vue'

	export default {
		components:{
			AssetOrByteAmount
		},
		props: {
		},
		data () {
			return {
				amount: this.$store.state.odex_balances.GBYTE / conf.gb_to_bytes,
				amount_message: '',
				conf,
				unit: false,
				is_requesting: false
			}
		},
		computed: {
			available_amount: function(){
				return this.$store.state.odex_balances.GBYTE / conf.gb_to_bytes;
			}
		},
		created(){
		},
		methods: {
			transfer: function(){
				this.is_requesting = true;
				core.transferBytesToWallet(this.amount * conf.gb_to_bytes, (err, unit)=>{
					this.is_requesting = false;
					if (err)
						return this.$buefy.toast.open({
						duration: 5000,
						message: err,
						position: 'is-bottom',
						type: 'is-danger'
						})
					this.unit = unit;
				});
			}

		},
	}
</script>

<style lang='scss' scoped>
</style>
