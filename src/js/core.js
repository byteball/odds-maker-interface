const odex = require('odex-client-browser');
const obyte = require('obyte');
const conf = require('./conf.js');
const axios = require('axios');
const { getChash160 } = require('obyte/lib/utils');
const moment = require('moment');

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
							await refreshWalletBalances();
							return callbackCompleted(e);
						}
					}
				}
			}
		}
	await refreshWalletBalances();
	callbackCompleted();
	client.close();
}

async function redeemWinningAsset(arrFixtures, callbackTransferred, callbackCompleted){
	await refreshWalletBalances();
	const client = new obyte.Client(userConf.hub_ws_url, userConf);
		for (var i=0; i<arrFixtures.length; i++){
			const fixture = arrFixtures[i];
			if (fixture.assets){
				if (fixture.assets && fixture.result){
					const asset = fixture.winning_asset;
					if (store.state.wallet_balances[asset]){
						const amount = store.state.wallet_balances[asset].stable;
						let definition = getParameterizedDefinition(fixture);
						let address = getChash160(definition);
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
									address: address
								}]
							}
						},
						{
							app: 'payment',
							payload:{
								outputs: [{
									amount: 10000,
									address: address
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


async function transferBytesToExternalAddress(amount, address, callbackCompleted){

	const client = new obyte.Client(userConf.hub_ws_url, userConf);
	const params =  
	{
		outputs: [{
			amount,
			address
		}]
	};

		try {
			var unit = await client.post.payment(params, userConf);
		} catch (e){
			client.close();
			return callbackCompleted(e);
		}
	callbackCompleted(null, unit);
	client.close();
	refreshWalletBalances();

}

async function transferBytesToWallet(amount, callbackCompleted){
	const client = new obyte.Client(userConf.hub_ws_url, userConf);
	const params = [
		{
			app: 'data',
			payload:{
				asset: 'base',
				withdraw: 1,
				amount
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
		try {
			var unit = await client.post.multi(params, userConf);
		} catch (e){
			client.close();
			return callbackCompleted(e);
		}
	callbackCompleted(null, unit);
	client.close();
}

async function transferAssetToWallet(arrFixtures, callbackRequested, callbackCompleted){
	await refreshOdexBalances();
	const client = new obyte.Client(userConf.hub_ws_url, userConf);
		for (var i=0; i<arrFixtures.length; i++){
			const fixture = arrFixtures[i];
			if (fixture.assets && fixture.result){
				var asset, symbol;
				if (fixture.result === fixture.feedName.split('_')[1]){
					asset = fixture.assets.home;
					symbol = fixture.feedName + '-' + fixture.feedHomeTeamName;
				}
				else if (fixture.result === fixture.feedName.split('_')[2]){
					asset = fixture.assets.away;
					symbol = fixture.feedName + '-' + fixture.feedAwayTeamName;
				}
				else if (fixture.result === 'draw'){
					asset = fixture.assets.draw;
					symbol = fixture.feedName + '-draw';
				}
				else if (fixture.result === 'canceled'){
					asset = fixture.assets.canceled;
					symbol = fixture.feedName + '-canceled';
				}

				if (store.state.odex_balances[symbol]){
					const amount = store.state.odex_balances[symbol];
					if (amount === 0){
						callbackRequested(asset, 0);
						continue;
					}
					const params = [
					{
						app: 'data',
						payload:{
							asset: asset,
							withdraw: 1,
							amount
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
					try {
						const unit = await client.post.multi(params, userConf);
						callbackRequested(asset, amount, unit);
					} catch (e){
						return callbackCompleted(e);
					}
				}
			}
		}
	callbackCompleted();
	client.close();
}

function getParameterizedDefinition(objFixture){
	return [
		"autonomous agent",
		{
		base_aa: conf.issuer_base_aa,
		params: {
			oracle: conf.oracle_address,
			home_team: objFixture.feedHomeTeamName,
			away_team: objFixture.feedAwayTeamName, 
			championship: objFixture.championship, 
			fixture_date: objFixture.localDay
		}
	}];
}

async function issueAssets(arrFixtures, amount, callbackCompleted){

	let definitions = [];
	let outputs = [];

	arrFixtures.forEach((fixture)=>{
		let definition = getParameterizedDefinition(fixture);
		let address = getChash160(definition);
		outputs.push({address, amount});
		definitions.push({address, definition});
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
	_userConf.odex_http_url = _userConf.odex_http_base_url + '/api';
	if (store.state.isConnected){
		return 'already started';
	}
	store.commit("setConnectingStatus", true);

	userConf = _userConf;
	try {
		await odex.start(_userConf);
		orders = odex.orders;
		await orders.trackMyOrders();


	} catch(e){
		store.commit("setConnectingStatus", false);
		return "Coudln't start Odex client: " + e.toString();
	}
	initMyOdexOrders();
	odex.ws_api.on('reset_orders', initMyOdexOrders);
	odex.ws_api.on('my_order_added', myOdexOrderAdded);
	odex.ws_api.on('my_order_removed', myOdexOrderRemoved);

	store.commit("setConnectedStatus", true);
	store.commit("setConnectingStatus", false);

	refreshBalances()
	setInterval(refreshBalances, 3*60*1000);
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
			await orders.createAndSendCancel(assocOrdersByAsset[fixture.assets[type]]);
		} else {
			try {
			await axios.post(store.state.connections.odex_http_base_url + '/api/pairs/create', {
				asset: fixture.assets[type]
			})
			} catch(e){
				console.log(e); //request fails if already created
			}
		}
		if (type === 'draw' && !store.state.odds_configuration.with_draw_championships[fixture.championship]){
			console.log("will not set draw odds");
			return false;
		}
		if (type === 'canceled' && !store.state.odds_configuration.with_cancel_championships[fixture.championship]){
			console.log("will not set cancel odds");
			return false;
		}
		const symbol = fixture.assets[type +'_symbol'];
		const balance = store.state.odex_balances[symbol] / (10 ** conf.asset_decimals);
		if (balance > 0){
			const odds = store.state.newOdds[fixture.feedName][type];
			if (!odds){
				console.log("no " + type +" odds to be set");
				return false;
			}
			let expiry_set_moment = moment().add(store.state.odds_configuration.odds_expiration_in_hours, 'hours');
			let hash = await orders.createAndSendOrder(
				symbol + '/GBYTE',
				'SELL', 
				balance, 
				1 / store.state.newOdds[fixture.feedName][type], 
				null, 
				expiry_set_moment.isAfter(fixture.dateMoment) || store.state.odds_configuration.odds_expiration_in_hours === 0 ? fixture.dateMoment.unix() : expiry_set_moment.unix()
			);
			assocOrdersByAsset[fixture.assets[type]] = hash;
			return true;
		} else {
			return false;
		}
	}

	async function setOddsForFixture(fixture){
		if (!fixture.assets)
			return 0;
		const results = await Promise.all([
			setOddsForAsset(fixture, 'away'),
			setOddsForAsset(fixture, 'home'),
			setOddsForAsset(fixture, 'draw'),
			setOddsForAsset(fixture, 'canceled')
		]);
		return results.reduce((sum, result)=>{ // we return the number of odds set for this fixture
			return sum + (result ? 1 : 0);
		},0);
	}

	const results = await Promise.all(fixtures.map((fixture)=>{
		return setOddsForFixture(fixture);
	}));

	return results.reduce((sum, result)=>{ // we return the number of odds set for all fixtures
		return sum + result;
	},0);

}


exports.initStore = initStore;
exports.start = start;
exports.stop = stop;
exports.refreshBalances = refreshBalances;
exports.issueAssets = issueAssets;
exports.transferToOdex = transferToOdex;
exports.transferAssetToWallet = transferAssetToWallet;
exports.setOdexOdds = setOdexOdds;
exports.cancelOdexOddsForFixture = cancelOdexOddsForFixture;
exports.redeemWinningAsset = redeemWinningAsset;
exports.transferBytesToWallet = transferBytesToWallet;
exports.transferBytesToExternalAddress = transferBytesToExternalAddress;