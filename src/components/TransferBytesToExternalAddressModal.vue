<template>
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Withdraw bytes to external address</p>
			<button class="delete" aria-label="close" @click="$parent.close()"></button>
		</header>	
		<section class="modal-card-body">

			<div class="container">
				<b-field label="To address" :message="address_message" >
					<b-input v-model="address"  autocomplete="off" />
				</b-field>
				<b-field label="Amount" :message="amount_message" >
					<b-numberinput v-model="amount" :max="available_amount" :controls="false" :step="0.000000001"></b-numberinput>
				</b-field>
				<b-button v-if="!unit && !is_transferring &&is_valid_address" @click="transfer" class="is-primary">
					Transfer <asset-or-byte-amount :amount="amount*conf.gb_to_bytes"/> GB to {{address}}</b-button>
				<div v-if="unit">
					Bytes tranferred, balance will appear once confirmed. <a :href="conf.explorer_url +'#' + unit" target="_blank"><b-icon icon="open-in-new" /></a>
				</div>
			</div>
		</section>

	</div>
</template>
<script>
const conf = require('../js/conf.js')
import core from '../js/core.js'
import AssetOrByteAmount from './commons/AssetOrByteAmount.vue'
const { isValidAddress } = require('obyte/lib/utils');

	export default {
		components:{
			AssetOrByteAmount
		},
		props: {
		},
		data () {
			return {
				amount: this.$store.state.wallet_balances.base / conf.gb_to_bytes,
				amount_message: '',
				address: '',
				conf,
				unit: false,
				is_transferring: false,
			}
		},
		computed: {
			available_amount: function(){
				return this.$store.state.wallet_balances.base / conf.gb_to_bytes;
			},
			address_message: function(){
				return this.is_valid_address ? '' : 'Invalid address';
			},
			is_valid_address: function(){
				return isValidAddress(this.address);
			},
		},
		created(){
		},
		methods: {
			transfer: function(){
				this.is_transferring = true;
				core.transferBytesToExternalAddress(this.amount * conf.gb_to_bytes, this.address, (err, unit)=>{
					this.is_transferring = false;
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
