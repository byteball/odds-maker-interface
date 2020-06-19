const odex = require('odex-client-browser');
const obyte = require('obyte');
const conf = require('./conf.js');
const { getBase64Hash } = require('obyte/lib/internal');
const { getChash160 } = require('obyte/lib/utils');

var store,orders,userConf;

function initEvents(){



}

async function issueAssets(arrFixtures, amount){

	let additionalMessages = []
	let outputs = []

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
		let payload = {address: aa_address, definition: parameterized_aa};
		outputs.push({address: aa_address, amount});
		additionalMessages.push({
			app: 'definition',
			payload_hash: getBase64Hash(payload, true),
			payload_location: 'inline',
			payload: payload,
		});
	});

	const params = {
		outputs,
		additionalMessages
	};
	const client = new obyte.Client(userConf.hub_ws_url, userConf);
	try{
		await client.post.payment(params, userConf);
	} catch(e){
		client.close();
		return e.toString();
	} 
	client.close();
	return null;
}


function initStore(_store){
	store = _store;
}


async function getBalances(){
	const wallet_balances =  await odex.account.getBalance();
	store.commit("setWalletBalances", wallet_balances);
	const odex_balances =  await odex.rest_api.getBalances(odex.account.getOwnerAddress());
	store.commit("setOdexBalances", odex_balances);
}

async function start(_userConf){

	if (store.state.isRunning){
		return 'already started';
	}

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

	store.commit("setRunningStatus", true);
	getBalances()
	return null;
}

async function stop(){
	await odex.stop();
	store.commit("setRunningStatus", false);
}


exports.initEvents = initEvents;
exports.initStore = initStore;
exports.start = start;
exports.stop = stop;
exports.getBalances = getBalances;
exports.issueAssets = issueAssets;