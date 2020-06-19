<template>
  <div id="app">
			<status />
			<b-button v-if="isRunning" @click="disconnect">Disconnect</b-button>
			<b-button v-else @click="connect">Connect</b-button>
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

export default {
  name: 'App',
  components: {
		MainTable,
		Settings,
		Status
	},
	data() {
		return {
	//		isRunning: false
		}
	},
		computed: {
			isRunning: function(){
				return this.$store.state.isRunning
			}
	},
	created(){
		core.initStore(this.$store)
		/*core.initEvents(EventBus);
		EventBus.$on('connected', ()=>{
			this.isRunning = true;
		});
		EventBus.$on('disconnected', ()=>{
			this.isRunning = false;
		});*/
	},
	methods:{
		connect: async function(){
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
		//	EventBus.$emit('connect');
		},
		disconnect: function(){
						core.stop();

		//	EventBus.$emit('disconnect');
		}
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
