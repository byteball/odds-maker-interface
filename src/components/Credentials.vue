<template>
	<div class="tile is-parent">
		<article class="tile is-child notification is-info">
			<p class="title is-5">Credentials</p>
			<b-field :message="wif_message">
				<template slot="label">
					wif
					<b-tooltip type="is-dark" label="Private key for your control address, can be generated on https://bonustrack.github.io/obyte-paperwallet/">
					<b-icon size="is-small" icon="help-circle-outline"></b-icon>
					</b-tooltip>
				</template>
				<b-input @input="onChange" v-model="credentials.wif" type="password" autocomplete="off" :disabled="!is_editing_allowed || are_credentials_saved"></b-input>
			</b-field>
			<div>
				<p class="is-3"> Wallet address: {{wallet_address}} </p>
			</div>
			<b-button class="is-primary" v-if="is_editing_allowed && are_credentials_saved" @click="deleteCredentials">Delete from computer</b-button>				
			<b-button class="is-primary" v-if="is_editing_allowed && !are_credentials_saved && is_form_complete" @click="saveCredentials">Save on computer</b-button>
		</article>
	</div>
</template>

<script>
const { fromWif, getChash160 } = require('obyte/lib/utils');
const ecdsa = require('secp256k1');

export default {
  props: {
	},
	data () {
		return {
			is_form_complete: false,
			are_credentials_saved: false,
			wif_message: '',
			credentials: {},
			wallet_address: '',
		}
	},
	computed: {
		is_editing_allowed(){
			return !this.$store.state.isRunning;
		}
	},
	created() {
		this.are_credentials_saved = !!localStorage.getItem('wif')
		this.credentials.wif = localStorage.getItem('wif') || ''
		this.onChange()
	},
		watch:{
		connections: function() {
			this.onChange()
		}
	},
	methods:{
		deleteCredentials(){
			for (var key in this.credentials){
				localStorage.removeItem(key)
				this.credentials[key] = ''
			}
			this.are_credentials_saved = false
		},
		saveCredentials(){
			for (var key in this.credentials){
				localStorage.setItem(key, this.credentials[key]) 
			}
			this.are_credentials_saved = true
		},
		onChange(){
			var bComplete = true;
			if (this.credentials.wif.length == 0){
				this.wif_message = 'not valid'
				this.wallet_address = ''
				bComplete = false
			} else {
				var privateKey;
				try {
					privateKey = fromWif(this.credentials.wif, this.$store.state.connections.testnet).privateKey;
				} catch (e){
					this.wif_message = e.toString()
					this.wallet_address = ''
					bComplete = false
				}
				if (bComplete){
					const definition = ['sig', { pubkey: ecdsa.publicKeyCreate(privateKey).toString('base64')}];
					this.wif_message = ''
					this.wallet_address = getChash160(definition);
				}
			}

			this.credentials.bComplete = this.is_form_complete = bComplete
			this.$store.commit("setCredentials", this.credentials)
		}
	}
}
</script>

