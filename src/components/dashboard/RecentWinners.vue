<template>
  <v-card>
    <v-card-title> Recent Winners </v-card-title>
    <v-card-text>
      <v-fade-transition>
        <v-row v-if="loadingState.finished">
          <template v-for="lottery in lotteries">
            <v-col v-for="winner in lottery" :key="winner.id">
              <v-card elevation="0" style="min-width: 240px">
                <v-card-title>{{ winner.value }} eth</v-card-title>
                <v-card-subtitle>{{ winner.account }}</v-card-subtitle>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-fade-transition>
      <v-sheet
        v-if="!loadingState.finished"
        :color="`grey lighten-2`"
        class="pa-3"
      >
        <v-skeleton-loader
          type="list-item-two-line"
        ></v-skeleton-loader> </v-sheet
    ></v-card-text>
    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<script>
import createLottery from "../../../contracts/createLotteryInstance";

export default {
  name: "RecentWinners",
  data() {
    return {
      loadingState: { finished: true, error: "" },
      search: "",
      lotteries: [],
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loadingState.finished = false;
      await this.$utils.delay(1500).then(() => {
        createLottery.methods
          .getLatestWinners()
          .call()
          .then((res) => {
            for (let i = 0; i < res.length; i++) {
              this.winners = [];
              const response = res[i];
              let values = response[0];
              let accounts = response[1];
              let lotteryAddress = response[2];

              for (let j = 0; j < values.length; j++) {
                let winner = {};
                winner.value = parseFloat(
                  this.$web3.utils.fromWei(values[j], "ether")
                ).toFixed(3);
                winner.account = accounts[j];
                winner.id = winner.account + lotteryAddress;
                this.winners.push(winner);
              }
              this.lotteries.push(this.winners);
            }
          })
          .catch((err) => {
            this.loadingState.error = err;
          })
          .finally(() => {
            this.loadingState.finished = true;
          });
      });
    },
  },
};
</script>
