import Vue from 'vue'
import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './js/store.js'

import "@/assets/custom.scss"

import Buefy from 'buefy'

Vue.use(Buefy);
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;


new Vue({
	el: '#app',
	store,
	render: h => h(App)
})
