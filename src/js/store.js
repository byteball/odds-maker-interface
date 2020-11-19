import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		connections: {},
		credentials: {},
		odds_configuration: {},
		wallet_balances: {},
		odex_balances: {},
		wallet_address: false,
		isConnected: false,
		isConnecting : false,
		myOdexOddsByAsset : {},
		newOdds: {},
	},
	mutations: {
		setConnections(state, data){
			state.connections = data;
		},
		setCredentials(state, data){
			state.credentials = data;
		},
		setOddsConfiguration(state, data){
			state.odds_configuration = data;
		},
		setConnectedStatus(state, data){
			state.isConnected = data;
		},
		setConnectingStatus(state, data){
			state.isConnecting = data;
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
		setNewOdds(state, data){
			Vue.set(state.newOdds, data.feedName, data.odds)
		},
		setMyOdexOddsByAsset(state, data){
			Vue.set(state.myOdexOddsByAsset, data.asset, data.odds)
		},
		deleteMyOdexOddsByAsset(state, asset){
			Vue.delete(state.myOdexOddsByAsset, asset)
		}
	},
	getters: {
		operatingAsset: (state) => {
			return state.odds_configuration.currency.asset;
		},
		operatingSymbol: (state) => {
			return state.odds_configuration.currency.symbol;
		},
		operatingDecimals: (state) => {
			return state.odds_configuration.currency.decimals;
		},
	},
	actions: {
	},
	modules: {
	}
})
