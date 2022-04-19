import Vue from 'vue';

import App from './App.vue';

import vuetify from './plugins/vuetify.js';
import i18n from './plugins/i18n/index.js';
import router from './plugins/router/index.js'

import web3 from './plugins/web3.js';

Vue.config.productionTip = false;

import detectEthereumProvider from '@metamask/detect-provider';

// this returns the provider, or null if it wasn't detected
// const provider = detectEthereumProvider();

// startApp(provider); // Initialize your app

function startApp(provider) {
  // If the provider returned by detectEthereumProvider is not the same as
  // window.ethereum, something is overwriting it, perhaps another wallet.
  if (provider !== window.ethereum) {
    console.error('Do you have multiple wallets installed?');
  }
  // Access the decentralized web!
  new Vue({
    vuetify,
    router,
    i18n,
    render: (h) => h(App, { props: { web3 } }),
  }).$mount('#app');
}

new Vue({
  vuetify,
  router,
  i18n,
  render: (h) => h(App),
}).$mount('#app');

