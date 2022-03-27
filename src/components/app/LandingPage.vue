<template>
  <div id="inspire">
    <v-parallax src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
      <div class="text-center">
        <img height="280" src="@/assets/ethereum.svg" />
        <div class="display-2 my-7">Smart Contract Lottery</div>
        <v-btn rounded color="primary" dark @click="connect()">
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
    // While you are awaiting the call to eth_requestAccounts, you should disable
    // any buttons the user can click to initiate the request.
    // MetaMask will reject any additional requests while the first is still
    // pending.
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
  },
};
</script>

<style scoped>
</style>