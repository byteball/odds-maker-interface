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
					<div v-if="fixture.assets">
						<div>{{ fixture.assets.home_symbol }}
							<span v-if="assocTransferred[fixture.assets.home]"> - transferred: 
								<asset-or-byte-amount :amount="assocTransferred[fixture.assets.home].amount"/> 
								<a :href="conf.explorer_url +'#' + assocTransferred[fixture.assets.home].unit" target="_blank"><b-icon icon="open-in-new" /></a>
							</span>
						</div>
						<div>{{ fixture.assets.away_symbol }}
							<span v-if="assocTransferred[fixture.assets.away]"> - transferred:
								<asset-or-byte-amount :amount="assocTransferred[fixture.assets.away].amount"/> 
								<a :href="conf.explorer_url +'#' + assocTransferred[fixture.assets.away].unit" target="_blank"><b-icon icon="open-in-new" /></a>
								</span>
						</div>
						<div>{{ fixture.assets.draw_symbol }}
							<span v-if="assocTransferred[fixture.assets.canceled]"> - transferred:
								<asset-or-byte-amount :amount="assocTransferred[fixture.assets.canceled].amount"/> 
								<a :href="conf.explorer_url +'#' + assocTransferred[fixture.assets.canceled].unit" target="_blank"><b-icon icon="open-in-new" /></a>
							</span>
						</div>
						<div>{{ fixture.assets.canceled_symbol }}
							<span v-if="assocTransferred[fixture.assets.draw]"> - transferred:
								<asset-or-byte-amount :amount="assocTransferred[fixture.assets.draw].amount"/> 
								<a :href="conf.explorer_url +'#' + assocTransferred[fixture.assets.draw].unit" target="_blank"><b-icon icon="open-in-new" /></a>
							</span>
						</div>
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
			callbackTransferred: function(asset, amount, unit){
				console.log('transferred ' +asset + ' ' + amount);
				this.$set(this.assocTransferred, asset,{
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
