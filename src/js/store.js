import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		connections: {},
		credentials: {},
		wallet_balances: {},
		odex_balances: {},
		wallet_address: false,
		isRunning: false,
	},
	mutations: {
		setConnections(state, data){
			state.connections = data;
		},
		setCredentials(state, data){
			state.credentials = data;
		},
		setRunningStatus(state, data){
			state.isRunning = data;
		},
		setWalletAddress(state, data){
			state.wallet_address = data;
		},
		setWalletBalances(state, data){
			state.wallet_balances = data;
		},
		setOdexBalances(state, data){
			state.odex_balances = data;
		},
	},
	actions: {
  },
  modules: {
  }
})
