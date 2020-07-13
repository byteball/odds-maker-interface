import Vue from 'vue'
import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './js/store.js'
import i18n from './i18n'

import "@/assets/custom.scss"

import Buefy from 'buefy'

Vue.use(Buefy);
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;


new Vue({
	el: '#app',
	store,
	i18n,
	render: h => h(App)
})
