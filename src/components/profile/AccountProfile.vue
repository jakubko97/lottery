<template>
  <div style="justify-content: center; display: grid">
    <v-card class="mx-auto">
      <v-row>
        <v-col md="6">
          <v-card-title> Account </v-card-title>
          <v-card-subtitle>
            {{ account }}
          </v-card-subtitle>
        </v-col>
        <v-col md="6">
          <v-card-title> Balance </v-card-title>
          <v-card-subtitle v-if="profileInfo.rewardsWon">
            {{ profileInfo.rewardsWon }} eth
            <v-icon
              v-if="profileInfo.rewardsWon > 0"
              large
              color="green darken-2"
            >
              mdi-chevron-up
            </v-icon>
            <v-icon
              v-else-if="profileInfo.rewardsWon < 0"
              large
              color="red darken-2"
            >
              mdi-chevron-down
            </v-icon>
          </v-card-subtitle>
        </v-col>
      </v-row>
      <v-card-title>
        Lottery Participated
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="profileInfo.lotteryParticipated"
        :search="search"
        :loading="!callResult.finished"
      >
        <template #[`item.funds`]="{ item }">
        {{ parseFloat($web3.utils.fromWei(item.funds, "ether")).toFixed(5) }}
        </template>
            <template #[`item.amountWon`]="{ item }">
        {{ parseFloat($web3.utils.fromWei(item.amountWon, "ether")).toFixed(5) }}
        </template>
            <template #[`item.state`]="{ item }">
        {{ getState(item.state) }}
        </template>
      </v-data-table>
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
      callResult: { finished: true, authorized: false, error: null, info: null },
      search: "",
      headers: [
        {
          text: "Lottery address",
          align: "start",
          sortable: false,
          value: "address",
        },
        {
          text: "Funds (eth)",
          align: "start",
          sortable: true,
          value: "funds",
        },
        {
          text: "Tickets",
          align: "start",
          sortable: true,
          value: "tickets",
        },
        {
          text: "State",
          align: "start",
          sortable: true,
          value: "state",
        },
         {
          text: "Won",
          align: "start",
          sortable: false,
          value: "won",
        },
        {
          text: "AmountWon",
          align: "start",
          sortable: true,
          value: "amountWon",
        }
      ],
      profileInfo: { lotteryParticipated: [], rewardsWon: 0 },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getState(state) {
      return state == 0 ? "Open" : "Closed"
    },
    getData() {
      this.$web3.eth.getAccounts().then((accounts) => {
        [this.account] = accounts;
        this.callResult.finished = false
        createLottery.methods
          .participatedByAddress(this.account)
          .call()
          .then((res) => {
            for (let i = 0; i < res[0].length; i++) {
              this.winner = {};
              let array = res[0];
              let array2 = res[1];
              let array3 = res[2];
              let array4 = res[3];
              let array5 = res[4];
              let array6 = res[5];

              let participated = {};
              participated.address = array[i];
              participated.funds = array2[i];
              participated.tickets = array3[i];
              participated.state = array4[i];
              participated.won = array5[i];
              participated.amountWon = array6[i];
              this.profileInfo.lotteryParticipated.push(participated);
              this.callResult.finished = true
            }
          })
          .catch(() => {
            this.callResult.finished = true
          })
          .finally(() => this.callResult.finished = true);

        createLottery.methods
          .getRewardsWonByAddress(this.account)
          .call()
          .then((rewardsWon) => {
            this.profileInfo.rewardsWon = this.$web3.utils.fromWei(
              rewardsWon,
              "ether"
            );

            createLottery.methods
              .getSpentState(this.account)
              .call()
              .then((spent) => {
                this.profileInfo.rewardsWon -= this.$web3.utils.fromWei(
                  spent,
                  "ether"
                );
                this.profileInfo.rewardsWon =
                  this.profileInfo.rewardsWon.toFixed(4);
              });
          });
      });
    },
  },
};
</script>
