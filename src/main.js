import Vue from 'vue';

import '@/plugins'
import '@/components/app'
import '@/components/basic'

import App from './App.vue';

import vuetify from './plugins/vuetify';
import i18n from '@/plugins/i18n';
import router from '@/plugins/router'

import web3 from './plugins/web3';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  i18n,
  render: (h) => h(App, { props: { web3 } }),
}).$mount('#app');
