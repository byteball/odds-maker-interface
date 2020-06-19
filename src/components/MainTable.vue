<template>
<div>
<b-button @click="issueAsset">Issue asset</b-button>
<b-button @click="transferToOdex">Transfer to Odex</b-button>

	<b-table 
	:data="fixtures"
	:checked-rows.sync="checkedRows"	
	checkable 
	>
		<template slot-scope="props">

			<b-table-column field="championship" custom-key='championship' >
				{{props.row.championship}}
			</b-table-column>
			<b-table-column field="homeTeam" custom-key='homeTeam' >
				{{props.row.homeTeam}}
			</b-table-column>

			<b-table-column field="awayTeam" custom-key='awayTeam' >
				{{props.row.awayTeam}}
			</b-table-column>

			<b-table-column field="date" custom-key='date' >
				{{props.row.date}}
			</b-table-column>

			<b-table-column field="on_wallet" custom-key='on_wallet' >
				<assets-on-wallets :assets="props.row.assets" />
			</b-table-column>
		</template>

	</b-table>
	</div>
</template>

<script>
import core from '../js/core.js'
import AssetsOnWallets from './AssetsOnWallets.vue'
export default {
	components: {
		AssetsOnWallets
	},
  props: {
    msg: String
	},
	data() {
		return {
			fixtures: [],
			checkedRows: [],
			new_odds: {

			}
		}
	},
	created(){
			this.axios.get('/api/fixtures').then((response) => {
				console.log(response.data);
				response.data.forEach((fixture)=>{
					fixture.feedName = this.getFeedName(fixture);
					this.new_odds[fixture.feedName] = false;
					fixture.new_odds = this.new_odds[fixture.feedName];
				});

		//	const dateNow = (new Date()).toISOString();
				this.fixtures = response.data.sort((a,b)=>{
					if(a.date > b.date){
						return 1;
					}
					else{
						return -1;
					}
				});
			})

	},
	watch:{

	},
	methods: {

		getFeedName: function(fixture){
			return fixture.championship + '_'  + fixture.feedHomeTeamName + '_' + fixture.feedAwayTeamName + '_' + fixture.date;
		},
		issueAsset: async function(){
			const err = await core.issueAssets(this.checkedRows, 15000);
			if (err)
				this.$buefy.toast.open({
					duration: 5000,
					message: err,
					position: 'is-bottom',
					type: 'is-danger'
				})
		}
	
	}
}
</script>

