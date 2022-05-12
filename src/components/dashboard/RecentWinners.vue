<template>
  <v-carousel cycle height="160" hide-delimiter-background show-arrows-on-hover>
    <v-carousel-item v-for="(lottery, i) in lotteries" :key="i">
      <v-sheet elevation="4" rounded color="secondary" height="100%">
        <v-fade-transition>
          <v-row
            class="fill-height"
            align="center"
            justify="center"
            v-if="loadingState.finished"
          >
            <v-col
              :cols="$vuetify.breakpoint.xs ? '12' : getColumnSize(lottery.length)"
              v-for="(winner, i) in lottery"
              :key="winner.id"
            >
              <v-card id="column" class="ma-3" elevation="0" style="min-width: 200px">
                <v-card-title class="accent--text">
                  {{ i + 1 }}
                  <v-icon class="mr-4" color="accent">mdi-trophy-award</v-icon>
                  <div>{{ winner.value }} eth</div></v-card-title
                >
                <v-card-subtitle>{{ winner.account }}</v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-fade-transition>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
  <!-- <v-card>
    <v-card-title>Recent Winners </v-card-title>
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
  </v-card> -->
</template>

<script>
import createLottery from "../../../contracts/BuildLotteryInstance";

export default {
  name: "RecentWinners",
  data() {
    return {
      loadingState: { finished: true, error: "" },
      search: "",
      lotteries: [],
      colors: [
        "indigo",
        "warning",
        "pink darken-2",
        "red lighten-1",
        "deep-purple accent-4",
      ],
      slides: ["First", "Second", "Third", "Fourth", "Fifth"],
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    getColumnSize(length) {
      switch (length) {
        case 1:
          return "12";
        case 2:
          return "6";
        case 3:
          return "4";
        case 4:
          return "3";
        case 5:
          return "2";
        case 6:
          return "1";
        default:
          return "12";
      }
    },
    async loadData() {
      this.loadingState.finished = false;
      await this.$utils.delay(200).then(() => {
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

              if(values.length != 0){
                for (let j = 0; j < values.length; j++) {
                  let winner = {};
                  winner.value = parseFloat(
                    this.$web3.utils.fromWei(values[j], "ether")
                  ).toFixed(4);
                  winner.account = accounts[j];
                  winner.id = winner.account + lotteryAddress;
                  this.winners.push(winner);
                }
              this.lotteries.push(this.winners);
              }
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
<style>
/* #column {
  background: url("https://smartcontract.imgix.net/newsletter_bg.svg?auto=compress%2Cformat");
} */
</style>
