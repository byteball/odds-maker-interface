<template>
	<div v-if="$store.state.newOdds[fixture.feedName]" >
		<div class="columns">
			<div class="column is-2">
				<b-field label='home'>
					<b-numberinput  v-model="$store.state.newOdds[fixture.feedName]['home']" :step="0.01" :controls="false" size="is-small"></b-numberinput>
				</b-field>
			</div>
			<div class="column is-2">
				<b-field label='draw'>
					<b-numberinput v-model="$store.state.newOdds[fixture.feedName]['draw']" :step="0.01" :controls="false" size="is-small"></b-numberinput>
				</b-field>
			</div>
			<div class="column is-2">
				<b-field label='away'>
					<b-numberinput v-model="$store.state.newOdds[fixture.feedName]['away']" :step="0.01" :controls="false" size="is-small"></b-numberinput>
				</b-field>
			</div>
			<div class="column is-2">
				<b-field label='canceled'>
					<b-numberinput  v-model="$store.state.newOdds[fixture.feedName]['canceled']" :step="0.01" :controls="false" size="is-small"></b-numberinput>
				</b-field>
			</div>
			<div class="column is-2">
			<b-button class="is-primary" @click="setOdexOdds(fixture)" size="is-small">set odds</b-button>
		</div>
		</div>

	</div>
</template>



<script>
import core from '../js/core.js'

export default {
	components: {
	},
  props: {
    fixture: Object
	},
	data() {
		return {

		}
	},
	created(){
	

	},
	watch:{

	},
	methods: {

		setOdexOdds: function(fixture){
			core.setOdexOdds([fixture]);
		}
	}
}


</script>