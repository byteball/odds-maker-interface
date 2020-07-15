

<template>
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Get odds from external provider</p>
			<button class="delete" aria-label="close" @click="$parent.close()"></button>
		</header>	
		<section class="modal-card-body">
			<div>
				<b-tabs>
					<b-tab-item label="The odds API">
						<the-odds-api />
					</b-tab-item>
				</b-tabs>
			</div>
		</section>
	</div>
</template>
<script>
import TheOddsApi from './oddsProvider/TheOddsApi.vue'

	export default {
		components:{
			TheOddsApi
		},
		props: {
		},
		data () {
			return {
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
