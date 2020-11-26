exports.odex_aa_address = 'FVRZTCFXIDQ3EYRGQSLE5AMWUQF4PRYJ';
exports.issuer_base_aa = "ZZEVOHYFMAR4GOVTD4ZFZOAAHBJS5ZIY";
exports.asset_decimals = 9;
exports.gb_to_bytes = 1e9;
exports.oracle_address = {
	testnet: '4EHFJW5EY74DG6PGSXX5CHF5F2FFIJX4',
	mainnet: 'TKT4UESIKTTRALRRLWS4SENSTJX6ODCW'
};
exports.explorer_url = {
	testnet: 'https://testnetexplorer.obyte.org/',
	mainnet: 'https://explorer.obyte.org/'
};

exports.currencies = {
	testnet: {
		'USDC' : {
			asset: 'UccpQo12uLmufihkzdK7Kcrb5BlHp8GcMrSEA7NVdNw=',
			decimals: 6,
			symbol:'USDC'
		},
		'GBYTE': {
			asset: 'base',
			decimals: 9,
			symbol:'GB'
		},
	},
	mainnet: {
		'OUSD' : {
			asset: 'UccpQo12uLmufihkzdK7Kcrb5BlHp8GcMrSEA7NVdNw=',
			decimals: 4,
			symbol:'OUSD'
		},
		'GBYTE': {
			asset: 'V/jyPXbGIoRhfBXCEMP/xzMzaAsYC4oT0RWzJhdJs0Y==',
			decimals: 9,
			symbol:'GB'
		},
	}
}

exports.upcoming_fixtures_max_days = 7;