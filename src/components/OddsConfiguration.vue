<template>
	<div class="tile is-parent">
		<article class="tile is-child notification is-info">
			<p class="title is-5">Odds configuration</p>
			<p class="title is-6">Currency</p>
			<div class="field">
				<b-select v-model="odds_configuration.currency" @input="onChange">
					<option
						v-for="(value,key) in currencies"
						:key="key"
						:value="value"
					>
					{{key}}
					</option>
				</b-select>
			</div>
			<p class="title is-6">Handle canceled asset</p>
			<div class="field">
				<b-switch v-for="(value, key) in odds_configuration.with_cancel_championships" 
				:key="'no_canceled_'+key" 
				v-model="odds_configuration.with_cancel_championships[key]"
				:true-value="true"
				:false-value="false"
				@input="onChange"
				>
				{{ key }}
				</b-switch>
			</div>
			<p class="title is-6">Handle draw asset</p>
			<div class="field">
				<b-switch v-for="(value, key) in odds_configuration.with_draw_championships" 
				:key="'no_canceled_'+key" 
				v-model="odds_configuration.with_draw_championships[key]"
				:true-value="true"
				:false-value="false"
				@input="onChange"
				>
				{{ key }}
				</b-switch>
			</div>

			<b-field label="Default canceled odds">
				<b-numberinput v-model="odds_configuration.default_canceled_odds" :min="1" 	@input="onChange"></b-numberinput>
			</b-field>
			<b-field label="Default odds markup in %">
				<b-numberinput v-model="odds_configuration.default_markup" :step="0.1" 	@input="onChange"></b-numberinput>
			</b-field>
			<b-field label="Orders expires">
				<b-select v-model="odds_configuration.odds_expiration_in_hours" @input="onChange">
					<option
						v-for="option in timer_options"
						:value="option.value"
						:key="'expire_' + option.value">
						{{ option.label }}
					</option>
				</b-select>
			</b-field>
		</article>
	</div>
</template>

<script>
import conf from '../js/conf.js'


export default {
  props: {
	},
	data () {
		return {
			odds_configuration: {},
			timer_options: [
				{
					label: 'when fixture starts',
					value: 0
				},
				{
					label: 'after 1 hour or when fixture starts',
					value: 1
				},
				{
					label: 'after 3 hours or when fixture starts',
					value: 3
				},
				{
					label: 'after 12 hours or when fixture starts',
					value: 12
				},
				{
					label: 'after 1 day or when fixture starts',
					value: 1 * 24
				},
				{
					label: 'after 2 days or when fixture starts',
					value: 2 * 24
				},
				{
					label: 'after 3 days or when fixture starts',
					value: 3 * 24
				},
			],
		}
	},
	computed: {
		is_testnet(){
			return this.$store.state.connections.testnet;
		},
		currencies(){
			return this.$store.state.connections.testnet ? conf.currencies.testnet : conf.currencies.mainnet;
		}
	},
	created() {

		const default_conf = {
			default_canceled_odds: 50,
			default_markup: 0,
			with_cancel_championships: {'BL1': false,'BSA': false,'PL': false,'L1': false,'PD': false,'SA': false,'NBA': false,'DED': false,'CL': false, 'MLB': true},
			with_draw_championships: {'BL1': true,'BSA': true,'PL': true,'L1': true,'PD': true,'SA': true,'NBA': false,'DED': true,'CL': true, 'MLB': false},
			odds_expiration_in_hours: 0,
			currency: 'GB'
		}
		this.odds_configuration = JSON.parse(localStorage.getItem('odds_configuration')) || default_conf;
		this.onChange()
	},
	watch:{
		is_testnet: function(){
			this.odds_configuration.currency = 'GBYTE';
			this.onChange();
		}
	},
	methods:{
	
		saveOddsConfiguration(){
			localStorage.setItem('odds_configuration', JSON.stringify(this.odds_configuration));
		},
		onChange(){
			this.$store.commit("setOddsConfiguration", this.odds_configuration);
			this.saveOddsConfiguration();
		}
	}
}
</script>

