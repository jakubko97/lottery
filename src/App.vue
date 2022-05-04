<template>
  <v-app id="fei_dp_lottery">
    <app-app-bar v-if="!isMobile" />
    <app-app-page :account="account"></app-app-page>
    <app-app-bottom-bar v-if="isMobile" />
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data() {
    return {
      drawer: true,
      account: "",
      loadingAccounts: true,
      isMobile: false,
    };
  },
  created() {
    window.ethereum.on("accountsChanged", this.handleAccountsChanged);
    this.$web3.eth
      .getAccounts()
      .then((accounts) => {
        [this.account] = accounts;
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        this.loadingAccounts = false;
      });
  },
  beforeDestroy () {
      if (typeof window === 'undefined') return

      window.removeEventListener('resize', this.onResize, { passive: true })
    },
  mounted () {
      this.onResize()

      window.addEventListener('resize', this.onResize, { passive: true })
    },
  methods: {
    onResize() {
      this.isMobile = window.innerWidth < 600;
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
