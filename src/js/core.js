const odex = require('odex-client-browser');
const obyte = require('obyte');
const conf = require('./conf.js');
const axios = require('axios');
const { getChash160 } = require('obyte/lib/utils');

var store,orders,userConf;
var assocOrdersByAsset = {};

async function transferToOdex(arrFixtures, callbackTransferred, callbackCompleted){
	await refreshWalletBalances();
	const client = new obyte.Client(userConf.hub_ws_url, userConf);
		for (var i=0; i<arrFixtures.length; i++){
			const fixture = arrFixtures[i];
			if (fixture.assets){
				for (var key in fixture.assets){
					const asset = fixture.assets[key];
					if (store.state.wallet_balances[asset]){
						const amount = store.state.wallet_balances[asset].stable + store.state.wallet_balances[asset].pending;
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


function initMyOdexOrders(){
	assocOrdersByAsset = {};
	for (let key in orders.assocMyOrders){
		const asset = orders.assocMyOrders[key].baseToken;
		const odds = Number((1 / orders.assocMyOrders[key].price).toFixed(2));
		if (!store.state.myOdexOddsByAsset[asset] || store.state.myOdexOddsByAsset[asset] !== odds)
			store.commit("setMyOdexOddsByAsset", {asset, odds, order_hash:key});
		assocOrdersByAsset[asset] = key;
	}

	for (let asset in store.state.myOdexOddsByAsset){
		if (!assocOrdersByAsset[asset])
			store.commit("deleteMyOdexOddsByAsset", asset);
	}

}

function myOdexOrderAdded(hash){
	const asset = orders.assocMyOrders[hash].baseToken;
	assocOrdersByAsset[asset] = hash;
	const odds = Number((1 / orders.assocMyOrders[hash].price).toFixed(2));
	store.commit("setMyOdexOddsByAsset", {asset, odds });
}

function myOdexOrderRemoved(hash){
	console.log('myOdexOrderRemoved ' +  hash);
	for(let asset in assocOrdersByAsset){
		if (assocOrdersByAsset[asset] === hash)
			store.commit("deleteMyOdexOddsByAsset", asset);
	}
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
		store.commit("setConnectingStatus", false);
		return "Coudln't start Odex client: " + e.toString();
	}
	initMyOdexOrders();
	console.log(orders.assocMyOrders);
	odex.ws_api.on('reset_orders', initMyOdexOrders);
	myOdexOrderAdded
	odex.ws_api.on('my_order_added', myOdexOrderAdded);
	odex.ws_api.on('my_order_removed', myOdexOrderRemoved);


	store.commit("setConnectedStatus", true);
	store.commit("setConnectingStatus", false);

	refreshBalances()
	return null;
}

async function stop(){
	await odex.stop();
	store.commit("setConnectedStatus", false);
}


async function cancelOdexOddsForFixture(fixture){
	if (!fixture.assets)
		return console.log("no assets defined for this fixture");
	await Promise.all([
		cancelOdexOddsForAsset(fixture.assets['home']),
		cancelOdexOddsForAsset(fixture.assets['away']),
		cancelOdexOddsForAsset(fixture.assets['draw']),
		cancelOdexOddsForAsset(fixture.assets['canceled'])
	]);
}

async function cancelOdexOddsForAsset(asset){
	if (assocOrdersByAsset[asset])
		await orders.createAndSendCancel(assocOrdersByAsset[asset]);

}

async function setOdexOdds(fixtures){
	async function setOddsForAsset(fixture, type){

		if (assocOrdersByAsset[fixture.assets[type]]){
			console.log('will cancel order');
			await orders.createAndSendCancel(assocOrdersByAsset[fixture.assets[type]]);
		} else {
			try {
			await axios.post(store.state.connections.odex_http_url + '/api/pairs/create', {
				asset: fixture.assets[type]
			})
			} catch(e){
				console.log(e);
			}
		}
		const symbol = fixture.assets[type +'_symbol'];
		const balance = store.state.odex_balances[symbol] / (10 ** conf.asset_decimals);
		if (balance > 0){
			let hash = await orders.createAndSendOrder(symbol + '/GBYTE', 'SELL', balance, 1 / store.state.newOdds[fixture.feedName][type]);
			assocOrdersByAsset[fixture.assets[type]] = hash;
		}
	}


	fixtures.forEach((fixture)=>{
		if (!fixture.assets)
			return;
		setOddsForAsset(fixture, 'away');
		setOddsForAsset(fixture, 'home');
		setOddsForAsset(fixture, 'draw');
		setOddsForAsset(fixture, 'canceled');
	});

}


exports.initStore = initStore;
exports.start = start;
exports.stop = stop;
exports.refreshBalances = refreshBalances;
exports.issueAssets = issueAssets;
exports.transferToOdex = transferToOdex;
exports.setOdexOdds = setOdexOdds;
exports.cancelOdexOddsForFixture = cancelOdexOddsForFixture;