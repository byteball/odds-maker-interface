<template>
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Transfer to Odex</p>
			<button class="delete" aria-label="close" @click="$parent.close()"></button>
		</header>	
		<section class="modal-card-body">

			<div class="container">
				<span class="mr-05">Transferring assets to Odex </span>
				<div v-for="fixture in fixtures" class="row" :key="fixture.feedName">
					<div v-if="fixture.currencies && fixture.currencies[$store.getters.operatingAsset] && fixture.currencies[$store.getters.operatingAsset].assets">
						<transferred-item :assocAssets="fixture.currencies[$store.getters.operatingAsset].assets" :assocTransferred="assocTransferred" type="home" />
						<transferred-item :assocAssets="fixture.currencies[$store.getters.operatingAsset].assets" :assocTransferred="assocTransferred" type="away" />
						<transferred-item :assocAssets="fixture.currencies[$store.getters.operatingAsset].assets" :assocTransferred="assocTransferred" type="draw" />
						<transferred-item :assocAssets="fixture.currencies[$store.getters.operatingAsset].assets" :assocTransferred="assocTransferred" type="canceled" />
					</div>
				</div>
				<div v-if="isTransferCompleted" class="mt-1">
					<span class="mr-05">All transfers completed</span><b-icon icon="thumb-up" />
					<div>Balances on Odex will appear once transactions are confirmed</div>
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
import TransferredItem from './TransferToOdexModalTransferredItem.vue'

	export default {
		components:{
			TransferredItem
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
			const err = await core.transferToOdex(this.fixtures, this.callbackTransferred, this.callbackCompleted);
			if (err)
			this.popToast(err);
		},
		methods: {
			callbackTransferred: function(outcome, amount, unit){
				console.log('transferred ' +outcome + ' ' + amount);
				this.$set(this.assocTransferred, outcome,{
					amount,
					unit
				});
				console.log(this.assocTransferred);
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
