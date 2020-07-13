module.exports = {
	devServer: {
		proxy: {
			"^/api" : { 
				target: process.env.local_server ? 'http://127.0.0.1:1860/' : 'https://betting.papabyte.com/'
			}
		}
		
	},
	configureWebpack: {

	},
	pluginOptions: {
		i18n: {
			locale: 'en',
			fallbackLocale: 'en',
			localeDir: 'locales',
			enableInSFC: false
		}
	}
}
