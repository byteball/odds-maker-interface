

	<template>
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Issue assets</p>
			<button class="delete" aria-label="close" @click="$parent.close()"></button>
		</header>	
		<section class="modal-card-body">
		<div>
			<b-tabs>
				<b-tab-item label="The odds API">
					<the-odds-api />
				</b-tab-item>
				<b-tab-item label="another providers">
				</b-tab-item>
			</b-tabs>
  </div>

		</section>

	</div>
</template>
<script>
const conf = require('../js/conf.js')
import TheOddsApi from './oddsProvider/TheOddsApi.vue'

	export default {
		components:{
			TheOddsApi
		},
		props: {
		},
		data () {
			return {

				conf
			}
		},
		computed: {

		},
		created(){

		},
		methods: {


			

		},
	}
</script>

<style lang='scss' scoped>
</style>
