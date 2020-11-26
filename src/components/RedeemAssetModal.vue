<template>
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Redeem winning assets</p>
			<button class="delete" aria-label="close" @click="$parent.close()"></button>
		</header>	
		<section class="modal-card-body">

			<div class="container">
				<span class="mr-05">Request to redeem winning asset </span>
				<div v-for="fixture in fixtures" class="row" :key="fixture.feedName">
					<div v-if="fixture.result && fixture.currencies[$store.getters.operatingAsset] && fixture.currencies[$store.getters.operatingAsset].assets">
						{{ fixture.currencies[$store.getters.operatingAsset].assets.winning_symbol }}
						<span v-if="assocTransferred[fixture.currencies[$store.getters.operatingAsset].assets.winning_asset]"> - requested
							<asset-or-byte-amount :amount="assocTransferred[fixture.currencies[$store.getters.operatingAsset].assets.winning_asset].amount"/> 
							<a :href="explorer_url +'#' + assocTransferred[fixture.currencies[$store.getters.operatingAsset].assets.winning_asset].unit" target="_blank"><b-icon icon="open-in-new" /></a>
						</span>
					</div>
				</div>
				<div v-if="isTransferCompleted" class="mt-1">
					<span class="mr-05">All redemptions requested <b-icon icon="thumb-up" /></span>
					<span>Bytes will be credited once transactions are confirmed</span>
				</div>
				<div v-else class="mt-1">
					<b-progress></b-progress>
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
			fixtures: Array
		},
		data () {
			return {
				assocTransferred: {},
				isTransferCompleted: false,
				conf
			}
		},
		computed: {
			explorer_url: function(){
				return this.$store.state.connections.testnet ? conf.explorer_url.testnet : conf.explorer_url.mainnet;
			}
		},
		async created(){
			if (this.fixtures.length === 0){
				this.popToast("No fixtures selected");
				this.$parent.close()
			}
			const err = await core.redeemWinningAsset(this.fixtures, this.callbackTransferred, this.callbackCompleted);
			if (err)
			this.popToast(err);
		},
		methods: {
			callbackTransferred: function(asset, amount, unit){
				this.$set(this.assocTransferred, asset,{
					amount,
					unit
				});
			},
			callbackCompleted: function(err){
				if (err)
					this.popToast(err);
				else
					this.isTransferCompleted = true;
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
