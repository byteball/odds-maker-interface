<template>
	<div class="tile is-parent">
		<article class="tile is-child notification is-info">
			<p class="title is-5">Connections</p>
			<b-field label="Odex ws URL" :message="odex_ws_message">
				<b-input @input="onChange" v-model="connections.odex_ws_url"  :disabled="!is_editing_allowed"></b-input>
			</b-field>
			<b-field label="Odex http API url" :message="odex_http_message">
				<b-input @input="onChange" v-model="connections.odex_http_base_url" :disabled="!is_editing_allowed" autocomplete="off"></b-input>
			</b-field>
			<b-field label="Hub ws url" :message="hub_ws_message">
				<b-input @input="onChange" v-model="connections.hub_ws_url" :disabled="!is_editing_allowed" autocomplete="off"></b-input>
			</b-field>
			<b-field label="Betting API" :message="betting_api_message">
				<b-input @input="onChange" v-model="connections.betting_api" :disabled="!is_editing_allowed" autocomplete="off"></b-input>
			</b-field>
			<div class="field">
				<b-checkbox @input="onChange" v-model="connections.testnet">
				testnet
				</b-checkbox>
			</div>

			<b-button class="is-primary" v-if="!matchDefaultTestnet && is_editing_allowed" @click="switchToDefaultTestnet" style="margin:10px;">Switch to testnet default</b-button>				
			<b-button class="is-primary" v-if="!matchDefault && is_editing_allowed" @click="switchToDefault" style="margin:10px;">Switch to default</b-button>

			<b-button class="is-primary"  v-if="this.$store.state.isConnected" @click="disconnect" style="margin:10px;">Disconnect</b-button>
			<b-button class="is-primary"  v-else @click="connect" style="margin:10px;">Connect</b-button>
		</article>
	</div>
</template>
<script>
const isUrl = require('is-url')
import core from '../js/core.js'
export default {
  props: {
	},
	data () {
		return {
			is_form_complete: false,
			default_odex_ws_url: "wss://odex.ooo/socket",
			default_odex_http_base_url: "https://odex.ooo",
			default_hub_ws_url: "wss://obyte.org/bb",
			default_betting_api: "https://betting.papabyte.com/api",
			default_odex_ws_url_testnet: "wss://testnet.odex.ooo/socket",
			default_odex_http_base_url_testnet: "https://testnet.odex.ooo",
			default_hub_ws_url_testnet: "wss://obyte.org/bb-test",
			default_betting_api_testnet: "https://betting.papabyte.com/api",
			odex_ws_message:'',
			odex_http_message: '',
			hub_ws_message: '',
			betting_api_message: '',
			wif_message: '',
			connections: {},
		}
	},
	computed: {
		is_editing_allowed(){
			return !this.$store.state.isConnected;
		},
		matchDefaultTestnet() {
			return this.connections.odex_ws_url == this.default_odex_ws_url_testnet 
			&& this.connections.odex_http_base_url == this.default_odex_http_base_url_testnet
			&& this.connections.hub_ws_url == this.default_hub_ws_url_testnet
			&& this.connections.testnet
			&& this.connections.betting_api == this.default_betting_api_testnet
		},
		matchDefault() {
			return this.connections.odex_ws_url == this.default_odex_ws_url 
			&& this.connections.odex_http_base_url == this.default_odex_http_base_url
			&& this.connections.hub_ws_url == this.default_hub_ws_url
			&& !this.connections.testnet
			&& this.connections.betting_api == this.default_betting_api
		},
	},
	created() {
		this.connections.odex_ws_url = localStorage.getItem('odex_ws_url') || this.default_odex_ws_url
		this.connections.odex_http_base_url = localStorage.getItem('odex_http_base_url') || this.default_odex_http_base_url
		this.connections.hub_ws_url = localStorage.getItem('hub_ws_url') || this.default_hub_ws_url
		this.connections.testnet = localStorage.getItem('testnet') === 'true' || false
		this.connections.betting_api = localStorage.getItem('betting_api') || this.default_betting_api
		this.onChange()
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
		},
		disconnect: function(){
			core.stop();
		},

		saveConnections(){
			for (var key in this.connections){
				localStorage.setItem(key, this.connections[key]) 
			}
		},
		switchToDefaultTestnet(){
			const connections = {};
			connections.odex_ws_url = this.default_odex_ws_url_testnet
			connections.odex_http_base_url = this.default_odex_http_base_url_testnet
			connections.hub_ws_url = this.default_hub_ws_url_testnet
			connections.testnet = true
			this.connections = connections // we have to reference new object to refresh form values
			this.onChange();
		},
			switchToDefault(){
			const connections = {};
			connections.odex_ws_url = this.default_odex_ws_url
			connections.odex_http_base_url = this.default_odex_http_base_url
			connections.hub_ws_url = this.default_hub_ws_url
			connections.testnet = false
			this.connections = connections // we have to reference new object to refresh form values
			this.onChange();
		},
		onChange(){
			var bComplete = true;
			if (!isUrl(this.connections.odex_ws_url)){
				this.odex_ws_message = 'not valid'
				bComplete = false
			}
			else {
				this.odex_ws_message = ''
			}
			if (!isUrl(this.connections.odex_http_base_url)){
				this.odex_http_message = 'not valid'
				bComplete = false
			}
			else {
				this.odex_http_message = ''
			}
			if (!isUrl(this.connections.hub_ws_url)){
				this.hub_ws_message = 'not valid'
				bComplete = false
			}
			else {
				this.hub_ws_message = ''
			}
			if (!isUrl(this.connections.betting_api)){
				this.betting_api_message = 'not valid'
				bComplete = false
			}
			else {
				this.hub_ws_message = ''
			}
			this.connections.bComplete = bComplete
			if (bComplete)
				this.saveConnections();
			this.$store.commit("setConnections", this.connections)
		}
	}
}
</script>

