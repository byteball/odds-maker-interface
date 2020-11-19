<template>
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Transfer to wallet</p>
			<button class="delete" aria-label="close" @click="$parent.close()"></button>
		</header>	
		<section class="modal-card-body">

			<div class="container">
				<span class="mr-05">Request to transfer winning assets from Odex to wallet </span>
				<div v-for="fixture in fixtures" class="row" :key="fixture.feedName">
					<div v-if="fixture.currencies && fixture.currencies[$store.getters.operatingAsset] && fixture.currencies[$store.getters.operatingAsset].assets">
						<requested-item :assocAssets="fixture.currencies[$store.getters.operatingAsset].assets" :assocRequested="assocRequested" type="home" />
						<requested-item :assocAssets="fixture.currencies[$store.getters.operatingAsset].assets" :assocRequested="assocRequested" type="away" />
						<requested-item :assocAssets="fixture.currencies[$store.getters.operatingAsset].assets" :assocRequested="assocRequested" type="canceled" />
						<requested-item :assocAssets="fixture.currencies[$store.getters.operatingAsset].assets" :assocRequested="assocRequested" type="draw" />
					</div>
				</div>
				<div v-if="isTransferCompleted" class="mt-1">
					<span class="mr-05">All transfers requested <b-icon icon="thumb-up" /></span>
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
import RequestedItem from './TransferAssetsToWalletModalRequestedItem.vue'
 
	export default {
		components:{
			RequestedItem
		},
		props: {
			fixtures: Array
		},
		data () {
			return {
				assocRequested: {},
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
			const err = await core.transferAssetToWallet(this.fixtures, this.callbackTransferred, this.callbackCompleted);
			if (err)
			this.popToast(err);
		},
		methods: {
			callbackTransferred: function(asset, amount, unit){
				console.log('transferred ' +asset + ' ' + amount);
				this.$set(this.assocRequested, asset,{
					amount,
					unit
				});
				console.log(this.assocRequested);
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
