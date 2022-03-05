<template>
  <div id="inspire">
    <v-parallax src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
      <div class="text-center">
        <img height="280" src="@/assets/ethereum.svg" />
        <div class="display-2 my-7">Smart Contract Lottery</div>
        <v-btn rounded color="primary" dark @click="connectWallet()">
          Connect Wallet
        </v-btn>
      </div>
    </v-parallax>
  </div>
</template>

<script>
const Web3 = require("web3");

export default {
  name: "LandingPage",
  components: {},
  methods: {
    handleAccountsChanged(_chainId) {
      // We recommend reloading the page, unless you must do otherwise
      window.location.reload();
    },
    async connectWallet() {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        this.handleAccountsChanged(chainId);
        window.ethereum.on("accountsChanged", this.handleAccountsChanged);
        return true;
      } else {
        alert("Please install MetaMask to use this dApp!");
        return false;
      }
    },
  },
};
</script>

<style scoped>

</style>