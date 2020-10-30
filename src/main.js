import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { vuex } from './vuex.js'

import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap"
import '@fortawesome/fontawesome-free/css/all.css'
import './app-styles.css'

import $ from "jquery"
import axios from 'axios'

Vue.config.productionTip = false
let debug = false;

Vue.prototype.$http = axios;
Vue.prototype.axios = axios;
Vue.prototype.$var = { navbarHeight: 0, mapNavbarHeight: 0 };

axios.interceptors.request.use(function (config) {
  if (debug)
  { 
    console.log(config); 
  }
  else {
    console.log(config.url);
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

// FILTERS

Vue.filter('toHtml', function(value) {
  return value.replace(/(?:\r\n|\r|\n)/g, '<br>');
})

// DIRECTIVES

Vue.directive('tooltip', function(el, binding){
  $(el).tooltip({
    title: binding.value,
    placement: binding.arg,
    trigger: 'hover'             
  })
})

Vue.directive('tooltip-delay', function(el, binding){
  $(el).tooltip({
    title: binding.value,
    placement: binding.arg,
    delay: 1000,
    trigger: 'hover'             
  })
})

new Vue({
  store: vuex,
  router,
  render: h => h(App)
}).$mount('#app')
