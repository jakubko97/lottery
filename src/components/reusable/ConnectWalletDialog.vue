<template>
  <div>
    <v-btn @click="open" class="ma-2" outlined>
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
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 primary--text">
          Connect your wallet
        </v-card-title>

        <v-card-text class="container">
          <v-btn
            id="metamaskBtn"
            elevation="0"
            @click="connect()"
            class="my-4"
            height="175"
            width="250"
          >
            <img height="80" src="@/assets/MetaMask.svg" />
            <div class="bottom primary--text">Metamask</div>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "ConnectWalletDialog",
  components: {},
  props: {
    account: {
      type: String,
      required: true,
    },
  },
  methods: {
    open() {
      if (!this.account) {
        this.dialog = true;
      }
    },
    truncateString(str) {
      return str
        ? str.substr(0, 6) + "..." + str.substr(str.length - 4, str.length)
        : "";
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
  },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style scoped>
/* Container holding the image and the text */
.container {
  position: relative;
  text-align: center;
  color: white;
}
/* Bottom right text */
.bottom {
  position: absolute;
  bottom: -26px;
}

#metamaskBtn {
  background: url("https://smartcontract.imgix.net/newsletter_bg.svg?auto=compress%2Cformat");
}
</style>