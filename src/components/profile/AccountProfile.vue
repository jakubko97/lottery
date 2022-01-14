<template>
  <div style="justify-content: center; display: grid">
    <v-card class="mx-auto">
      <v-row>
        <v-col md="4">
          <v-card-title> Account </v-card-title>
          <v-card-subtitle>
            {{ account }}
          </v-card-subtitle>
        </v-col>
        <v-col md="4">
          <v-card-title> Lottery participated </v-card-title>
          <v-card-subtitle v-if="profileInfo.participatedCount">
            {{ profileInfo.participatedCount }}
          </v-card-subtitle>
        </v-col>
        <v-col md="4">
          <v-card-title> Spent/Won </v-card-title>
          <v-card-subtitle v-if="profileInfo.rewardsWon">
            {{ $web3.utils.fromWei(profileInfo.rewardsWon, "ether") }} eth
            <v-icon large color="green darken-2"> mdi-chevron-up </v-icon>
          </v-card-subtitle>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import createLottery from "../../../contracts/createLotteryInstance";

export default {
  name: "AccountProfile",
  components: {},
  data() {
    return {
      account: null,
      profileInfo: { participatedCount: "", rewardsWon: 0 },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.$web3.eth.getAccounts().then((accounts) => {
        [this.account] = accounts;

        createLottery.methods
          .participatedByAddress(this.account)
          .call()
          .then((res) => {
            this.profileInfo.participatedCount = res;
          });

        createLottery.methods
          .getTotalSpent(this.account)
          .call()
          .then((res) => {
            this.profileInfo.rewardsWon = this.$web3.utils.fromWei(res, "ether");
          });
      });
    },
  },
};
</script>
