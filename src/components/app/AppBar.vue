<template>
  <v-app-bar elevate-on-scroll color="primary" app>
    <!-- <v-app-bar-nav-icon @click.stop="switchDrawer" /> -->
    <v-spacer></v-spacer>
    <v-toolbar-title class="headline font-weight-bold primary--text">Smart Lottery Portal</v-toolbar-title>
    <v-spacer></v-spacer>
    <img height="32" src="@/assets/ethereum.svg" />
    <span class="ma-2 subtitle-2">Ethereum Rinkeby</span>
    <ConnectWalletDialog :account="account ? account : ''"/>
    <template v-slot:extension>
      <v-tabs v-model="tab" centered dark>
        <v-tabs-slider></v-tabs-slider>

        <v-tab :to="'/'"> Home </v-tab>

        <v-tab :to="'/Archive'"> Archive </v-tab>

        <v-tab :to="'/AccountProfile'"> Profile </v-tab>
        <v-tab :to="'/CreateProject'"> Create </v-tab>
      </v-tabs>
    </template>

    <v-spacer />
  </v-app-bar>
</template>

<script>
import ConnectWalletDialog from "@/components/reusable/ConnectWalletDialog";

export default {
  name: "AppBar",
  components: {
    ConnectWalletDialog
  },
  data() {
    return {
      drawer: true,
      tab: null,
      account: "",
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
  methods: {
    handleAccountsChanged() {
      // We recommend reloading the page, unless you must do otherwise
      window.location.reload();
    },
    createProject() {
      this.$router.push("/CreateProject");
    },
    switchDrawer() {
      this.drawer = !this.drawer;
      this.$emit("switch-drawer", this.drawer);
    },
  },
};
</script>

<style>
.v-toolbar__content {
  background-color: white;
}
</style>
