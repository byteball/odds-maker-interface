<template>
	<div class="tile is-parent">
		<article class="tile is-child notification is-info">
			<p class="title is-5">Credentials</p>
			<b-field :message="mnemonic_message">
				<template slot="label">
					Seed
					<b-tooltip type="is-dark" label="Seed for your web wallet, make sure to always have a backup for it">
					<b-icon size="is-small" icon="help-circle-outline"></b-icon>
					</b-tooltip>
				</template>
				<b-input @input="onChange" v-model="credentials.mnemonic" autocomplete="off" :disabled="!is_editing_allowed || are_credentials_saved"></b-input>
			</b-field>
			<b-button class="is-primary" v-if="!credentials.mnemonic.length" @click="generateNewMnemonic">New</b-button>

			<div v-if="wallet_address.length">
				<p class="is-3"> Wallet address: {{wallet_address}} </p>
			</div>
			<b-button class="is-primary" v-if="is_editing_allowed && are_credentials_saved" @click="deleteCredentials">Delete from computer</b-button>				
			<b-button class="is-primary" v-if="is_editing_allowed && !are_credentials_saved && is_form_complete" @click="saveCredentials">Save on computer</b-button>
		</article>
	</div>
</template>

<script>
const { toWif, getChash160 } = require('obyte/lib/utils');
const Mnemonic = require('bitcore-mnemonic');
import Vue from 'vue'

export default {
  props: {
	},
	data () {
		return {
			is_form_complete: false,
			are_credentials_saved: false,
			mnemonic_message: '',
			credentials: {},
			wallet_address: '',
		}
	},
	computed: {
		is_editing_allowed(){
			return !this.$store.state.isConnected;
		},
		is_testnet(){
			return this.$store.state.connections.testnet;
		}
	},
	created() {
		this.are_credentials_saved = !!localStorage.getItem('mnemonic')
		this.credentials.mnemonic = localStorage.getItem('mnemonic') || ''
		this.onChange()
	},
	watch:{
		is_testnet: function(){
			this.onChange();
		}
	},
	methods:{
		deleteCredentials(){
			for (var key in this.credentials){
				localStorage.removeItem(key)
				this.credentials[key] = ''
			}
			this.are_credentials_saved = false
			this.onChange()
		},
		saveCredentials(){
			for (var key in this.credentials){
				localStorage.setItem(key, this.credentials[key]) 
			}
			this.are_credentials_saved = true
		},
		generateNewMnemonic(){
			let mnemonic = new Mnemonic();
			while (!Mnemonic.isValid(mnemonic.toString())) {
				mnemonic = new Mnemonic();
			}
			Vue.set(this.credentials, 'mnemonic', mnemonic.toString());
			this.credentials = { mnemonic: mnemonic.toString()};
			this.onChange()
		},
		onChange(){
			if (this.credentials.mnemonic.length == 0 || !Mnemonic.isValid(this.credentials.mnemonic)){
				this.mnemonic_message = 'not valid'
				this.wallet_address = ''
				this.is_form_complete = false;
			} else {
				const mnemonic = new Mnemonic(this.credentials.mnemonic);
				const xPrivKey = mnemonic.toHDPrivateKey();
				const path = this.$store.state.connections.testnet ? "m/44'/1'/0'/0/0" : "m/44'/0'/0'/0/0";
				const { privateKey } = xPrivKey.derive(path);
				const privKeyBuf = privateKey.bn.toBuffer({ size: 32 });
				const wif = toWif(privKeyBuf, this.$store.state.connections.testnet);
				const pubkey = privateKey.publicKey.toBuffer().toString('base64');
				const definition = ['sig', { pubkey }];
				this.mnemonic_message = ''
				this.wallet_address = getChash160(definition);
				this.credentials.wif = wif;
				this.credentials.bComplete = this.is_form_complete = true;
				this.$store.commit("setCredentials", this.credentials)
			}
	
		}
	}
}
</script>

