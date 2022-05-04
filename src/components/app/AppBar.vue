<template>
  <v-app-bar elevate-on-scroll color="primary" app>
    <!-- <v-app-bar-nav-icon @click.stop="switchDrawer" /> -->
    <v-spacer></v-spacer>
    <v-toolbar-title class="headline font-weight-bold primary--text">Smart Lottery Portal</v-toolbar-title>
    <v-spacer></v-spacer>
    <img height="32" src="@/assets/ethereum.svg" />
    <span class="ma-2 subtitle-2">Ethereum Rinkeby</span>
    <v-btn class="ma-2" @click="connect()" outlined>
      <template v-if="!account">
        <v-icon>mdi-wallet</v-icon>
        Connect Wallet
      </template>
      <template v-else>
        <img height="24" src="@/assets/avatar.png" />
        <span class="ml-2">
          {{ truncateString(account) }}
        </span>
      </template>
    </v-btn>
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
export default {
  name: "AppBar",
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
    truncateString(str) {
      return str
        ? str.substr(0, 6) + "..." + str.substr(str.length - 4, str.length)
        : "";
    },
    handleAccountsChanged() {
      // We recommend reloading the page, unless you must do otherwise
      window.location.reload();
    },
    connect() {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then()
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log("Please connect to MetaMask.");
          } else {
            console.error(err);
          }
        });
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
