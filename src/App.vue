<template>
  <div id="app">
			<status />
			<b-tabs>
				<b-tab-item label="Fixtures">
					<main-table />
				</b-tab-item>
				<b-tab-item label="Settings">
					<settings />
				</b-tab-item>
			</b-tabs>
  </div>
</template>

<script>
import MainTable from './components/MainTable.vue'
import Settings from './components/Settings.vue'
import Status from './components/Status.vue'

import core from './js/core.js'
//import { EventBus } from './js/event-bus.js';
import Vue from 'vue';

export default {
  name: 'App',
  components: {
		MainTable,
		Settings,
		Status
	},
	data() {
		return {
	//		isConnected: false
		}
	},
	created(){
		core.initStore(this.$store);

		Vue.nextTick(async ()=> { // we wait next tick for the state variables to be loaded
			if (!this.$store.state.connections.bComplete)
				return this.$buefy.toast.open({
						duration: 5000,
						message: "Connections settings not complete",
						position: 'is-bottom',
						type: 'is-danger'
				})
			if (!this.$store.state.credentials.bComplete)
				return this.$buefy.toast.open({
						duration: 5000,
						message: "Credentials settings not complete",
						position: 'is-bottom',
						type: 'is-danger'
				})

			const err = await core.start(Object.assign(
				this.$store.state.connections,
				this.$store.state.credentials,
			));
			if (err)
				this.$buefy.toast.open({
					duration: 5000,
					message: err,
					position: 'is-bottom',
					type: 'is-danger'
				})
		})
	},
	methods:{

	}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
