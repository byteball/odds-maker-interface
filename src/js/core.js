const odex = require('odex-client-browser');
const obyte = require('obyte');
const conf = require('./conf.js');
const { getChash160 } = require('obyte/lib/utils');

var store,orders,userConf;


async function wait500ms(){
	return new Promise((resolve)=>{
		setTimeout(resolve, 500);
	});
}


async function transferToOdex(arrFixtures, callbackTransferred, callbackCompleted){
	await refreshWalletBalances();
	const client = new obyte.Client(userConf.hub_ws_url, userConf);
		for (var i=0; i<arrFixtures.length; i++){
			const fixture = arrFixtures[i];
			console.log(fixture);
			if (fixture.assets){
				for (var key in fixture.assets){
					const asset = fixture.assets[key];
					if (store.state.wallet_balances[asset]){
						const amount = store.state.wallet_balances[asset].stable + store.state.wallet_balances[asset].pending;
						console.log(amount);

						if (amount === 0){
							callbackTransferred(asset, 0);
							continue;
						}
						const params = [
						{
							app: 'payment',
							payload:{
								asset: asset,
								outputs: [{
									amount: amount,
									address: conf.odex_aa_address
								}]
							}
						},
						{
							app: 'payment',
							payload:{
								outputs: [{
									amount: 10000,
									address: conf.odex_aa_address
								}]
							}
						}];
						console.log(params);
						try {
							const unit = await client.post.multi(params, userConf);
							callbackTransferred(asset, amount, unit);
						} catch (e){
							return callbackCompleted(e);
						}
						await wait500ms();
					}
				}
			}
		}
	callbackCompleted();
	client.close();
}

async function issueAssets(arrFixtures, amount, callbackCompleted){

	let definitions = [];
	let outputs = [];

	arrFixtures.forEach((fixture)=>{
		let parameterized_aa = [
			"autonomous agent",
			{
			base_aa: conf.issuer_base_aa,
			params: {
				oracle: conf.oracle_address,
				home_team: fixture.feedHomeTeamName,
				away_team: fixture.feedAwayTeamName, 
				championship: fixture.championship, 
				expiry_date: fixture.localDay
			}
		}];
		let aa_address = getChash160(parameterized_aa)
		outputs.push({address: aa_address, amount});
		definitions.push({address: aa_address, definition: parameterized_aa});
	});

	const params = [
		{
			app: 'payment',
			payload:{
				outputs
			}
		}];
		definitions.forEach((definition)=>{
			params.push({
				app: 'definition',
				payload: definition
			});
		});

	const client = new obyte.Client(userConf.hub_ws_url, userConf);
	try {
		var unit = await client.post.multi(params, userConf);
	} catch(e){
		client.close();
		callbackCompleted(e.toString());
	} 
	client.close();
	return callbackCompleted(null, unit);
}


function initStore(_store){
	store = _store;
}


async function refreshBalances(){
	await Promise.all([refreshWalletBalances(), refreshOdexBalances()]);
}

async function refreshWalletBalances(){
	const wallet_balances =  await odex.account.getBalance();
	store.commit("setWalletBalances", wallet_balances);
}

async function refreshOdexBalances(){
	const odex_balances =  await odex.rest_api.getBalances(odex.account.getOwnerAddress());
	store.commit("setOdexBalances", odex_balances);
}



async function start(_userConf){

	if (store.state.isConnected){
		return 'already started';
	}
	store.commit("setConnectingStatus", true);

	userConf = _userConf;
	try {
		await odex.start(_userConf);
		orders = odex.orders;
/*		ws_api = odex.ws_api;
		balances = odex.balances;
		exchange= odex.exchange;*/
		await orders.trackMyOrders();
	} catch(e){
		return "Coudln't start Odex client: " + e.toString();
	}

	store.commit("setConnectedStatus", true);
	store.commit("setConnectingStatus", false);

	refreshBalances()
	return null;
}

async function stop(){
	await odex.stop();
	store.commit("setConnectedStatus", false);
}


exports.initStore = initStore;
exports.start = start;
exports.stop = stop;
exports.refreshBalances = refreshBalances;
exports.issueAssets = issueAssets;
exports.transferToOdex = transferToOdex;