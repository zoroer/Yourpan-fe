import Vue from 'vue'
import App from './App.vue'
import kcLog from 'kc-log'
import service from '@common/publicSource/service'
import '@common/publicSource/rem'

Vue.prototype.$service = service;
Vue.prototype.$kcLog = kcLog;

new Vue({
  el: '#app',
  render: h => h(App)
});
