<template>
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Issue assets</p>
			<button class="delete" aria-label="close" @click="$parent.close()"></button>
		</header>	
		<section class="modal-card-body">

			<div class="container">
				<b-field label="Amount per match" :message="amount_message" :type="amount_field_type">
					<b-numberinput v-model="amount" :max="available_amount" :controls="false" :step="0.000000001"></b-numberinput>
				</b-field>
				<div>
					Available: <asset-or-byte-amount :amount="available_amount" /> {{$store.getters.operatingSymbol}}
				</div>
				<div>
					{{amount}} {{$store.getters.operatingSymbol}} on {{fixtures.length}} fixture{{fixtures.length > 1 ? 's' : ''}} = <asset-or-byte-amount :amount="total_amount" /> {{$store.getters.operatingSymbol}}
				</div>
				<div class="p-1" v-if="!trigger_unit">
					<b-button v-if="total_amount && total_amount < available_amount && !isIssuing" class="is-primary" @click="issueAssets" > Issue assets</b-button>
				</div>
				<div v-else>
					<span class="mr-05">Assets requested, trigger unit: </span> 
					<a :href="explorer_url +'#' + trigger_unit" target="_blank"><b-icon icon="open-in-new"/></a>
				</div>
			</div>
		</section>

	</div>
</template>
<script>
const conf = require('../js/conf.js')
import core from '../js/core.js'
import AssetOrByteAmount from './commons/AssetOrByteAmount.vue'
const issuing_fees = 10000;

	export default {
		components:{
			AssetOrByteAmount
		},
		props: {
			fixtures: Array
		},
		data () {
			return {
				amount: 0,
				isAssetIssued: false,
				isIssuing: false,
				trigger_unit: null,
				conf
			}
		},
		computed: {
			amount_message: function(){
				return this.total_amount >= this.available_amount ? 'Not enough bytes on wallet' : '';
			},
			amount_field_type: function(){
				return this.total_amount >= this.available_amount ? 'is-danger' : '';
			},
			total_amount: function(){
				return this.amount * this.fixtures.length * 10 ** this.$store.getters.operatingDecimals + (this.$store.getters.operatingAsset == 'base' ? issuing_fees : 0)* this.fixtures.length;
			},
			available_amount: function(){
				if (!this.$store.state.wallet_balances || !this.$store.state.wallet_balances[this.$store.getters.operatingAsset])
					return 0;
				return (this.$store.state.wallet_balances[this.$store.getters.operatingAsset].pending + this.$store.state.wallet_balances[this.$store.getters.operatingAsset].stable);
			},
			explorer_url: function(){
				return this.$store.state.connections.testnet ? conf.explorer_url.testnet : conf.explorer_url.mainnet;
			}
		},
		created(){
			if (this.fixtures.length > 60){
				this.popToast("Can't issue asset for more than 60 fixtures at once");
				this.$parent.close()
			}
			if (this.fixtures.length === 0){
				this.popToast("No fixtures selected");
				this.$parent.close()
			}
		},
		methods: {
			issueAssets: async function(){
				this.isIssuing = true;
				const amount = Math.floor(this.amount * 10 ** this.$store.getters.operatingDecimals) + (this.$store.getters.operatingAsset == 'base' ? issuing_fees : 0);
				const err = await core.issueAssets(this.fixtures, amount, this.callbackCompleted);
				if (err)
					this.popToast(err);
				this.isIssuing = false;
			},

			callbackCompleted: function(err, unit){
				if (err)
					return this.popToast(err);
				this.trigger_unit = unit;
			},
			popToast: function(message){
				this.$buefy.toast.open({
					duration: 5000,
					message: message,
					position: 'is-bottom',
					type: 'is-danger'
				})
			}
		},
	}
</script>

<style lang='scss' scoped>
</style>
