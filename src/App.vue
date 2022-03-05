<template>
  <v-app id="fei_dp_lottery">
    <app-app-bar v-if="account" @switch-drawer="switchDrawer"></app-app-bar>
    <app-app-page v-if="account && !loadingAccounts" :account="account"></app-app-page>
    <!-- <app-app-drawer :account="account" v-model="drawer"></app-app-drawer> -->
    <app-landing-page v-if="!account && !loadingAccounts"></app-landing-page>
  </v-app>
</template>

<script>
import bigChainDb from '../db/Transaction'

export default {
  name: "App",

  components: {},

  data() {
    return { 
      drawer: true, 
      account: "",
      loadingAccounts : true };
  },
  created() {
    window.ethereum.on("accountsChanged", this.handleAccountsChanged);
    this.$web3.eth.getAccounts().then((accounts) => {
      [this.account] = accounts;
      this.loadingAccounts = false
    }).catch(e => {
      console.error(e)
      this.loadingAccounts = false
    })
    console.log(bigChainDb.FarmToWork)
    bigChainDb.FarmToWork.createAsset("a cow").then( response => console.log(response) );
  },
  methods: {
    handleAccountsChanged() {
      // We recommend reloading the page, unless you must do otherwise
      window.location.reload();
    },
    switchDrawer(val) {
      this.drawer = val;
    },
    metaInfo() {
      return {
        htmlAttrs: { lang: this.$i18n.locale },
        meta: [
          { name: "viewport", content: "width=device-width, initial-scale=1" },
          { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
        ],
        title: "DPLottery",
        titleTemplate: (titleChunk) => {
          return titleChunk ? `DP | ${titleChunk}` : "DPSmartContracts";
        },
      };
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .v-expansion-panel-content__wrap {
    padding: 0px 12px 12px 12px !important;
  }
}
</style>
