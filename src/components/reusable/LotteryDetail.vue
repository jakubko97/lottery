<template>
  <div>
    <v-card style="max-width: 600px; margin: 0 auto">
      <CountDownTimer
        v-if="lottery.deadlineTime > new Date().getTime()"
        class="timer"
        :date="formatDateToTimer(lottery.deadlineTime)"
      />
      <v-card-title>{{ lottery.id }}</v-card-title>
      <v-card-text>
        <div v-if="lottery.projectStarter == account">ADMIN</div>
        <div>
          <v-icon class="mr-2" color="accent">mdi-cash</v-icon>
          Price {{ lottery.ticketPrice }} ETH
        </div>
        <div>
          <v-icon class="mr-2" color="accent">mdi-account-multiple</v-icon>
          {{ numberOfPlayers }} participated
        </div>
         <div>
          <v-icon class="mr-2" color="accent">mdi-trophy-award</v-icon>
          {{ lottery.lotteryRewards }}
        </div>
        <div>
          <v-icon class="mr-2" color="accent">mdi-bank</v-icon>
          Bank {{ getCurrentAmount() }} ETH
        </div>
        <div>
          <v-icon class="mr-2" color="accent">mdi-timer-sand</v-icon>
          {{ getDateFormat(lottery.deadlineTime) }}
        </div>

        <v-divider class="ma-2 pa-2"></v-divider>
        <v-row>
          <v-col>
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="15"
              :value="winProbability"
              color="accent"
              >{{ winProbability }} %</v-progress-circular
            >
            <span class="ml-4"
              >{{ ticketsBought }} tickets bought with value of
              {{ lottery.purchased }} eth {{ getPurchasedEthCurrentPrice() }}
            </span>
          </v-col>
        </v-row>

        <v-divider class="ma-2 pa-2"></v-divider>

        <v-list v-if="winners.length != 0" two-line>
          <v-icon class="mr-2" color="orange">mdi-trophy</v-icon>Winners:
          <v-list-item v-for="(wnr, index) in winners" :key="wnr.address">
            <v-list-item-content>
              {{ index + 1 }}. prize
              <v-list-item-title>{{ wnr.address }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ fromWeiToEth(wnr.reward), }}
                eth ({{
                  parseFloat(
                    ethData.current_price * fromWeiToEth(wnr.reward)
                  ).toFixed(2)
                }}
                €)
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <!-- <p class="text-h6 text--primary">Admin: {{ lottery.projectStarter }}</p> -->
        <p v-if="lottery.deadlineTime > new Date().getTime()">
          Kupit viac sa oplati!
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon color="blue lighten-1"> mdi-information </v-icon>
              </v-btn>
            </template>
            <span v-for="item in discount" :key="item.tickets">
            {{ item.tickets }} tickets for {{ item.percent}}
            </span>
          </v-tooltip>
        </p>

        <p
          class="title"
          v-if="
            winners.length == 0 && lottery.deadlineTime < new Date().getTime()
          "
        >
          Lottery has ended. Waiting for draw.
        </p>

        <v-row v-if="winners.length == 0">
          <v-col md="2" cols="12">
            <v-text-field
              v-model="lottery.amount"
              v-if="lottery.deadlineTime > new Date().getTime()"
              label="Tickets"
              type="number"
              height="30"
            ></v-text-field>
          </v-col>
          <v-col md="4" cols="12">
            <v-btn
              v-if="lottery.deadlineTime > new Date().getTime()"
              depressed
              color="accent"
              :loading="callResult.loading"
              @click.prevent="buyTicket()"
              >{{ showPayAmount() }} Pay</v-btn
            >
          </v-col>
        </v-row>
        <v-row
          v-if="
            winners.length == 0 &&
            lottery.deadlineTime < new Date().getTime() &&
            lottery.projectStarter == account
          "
        >
          <v-col>
            <v-btn
              v-if="!callResult.drawLoading"
              depressed
              color="accent"
              @click.prevent="drawWinner()"
              >DRAW</v-btn
            >
            <img v-else height="200px" width="300px" src="../../assets/drawing.gif" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <RecentTransactions
      class="my-2"
      :project-addresses="[lottery.contract._address]"
    />
  </div>
</template>

<script>
import CountDownTimer from "./CountDownTimer.vue";
import RecentTransactions from "@/components/dashboard/RecentTransactions.vue";

export default {
  name: "LotteryDetail",
  components: {
    CountDownTimer,
    RecentTransactions,
  },
  data() {
    return {
      dialog: false,
      ethData: null,
      lottery: { playersLength: 0, ticketsLength: 0 },
      account: null,
      winProbability: 0,
      ticketsBought: 0,
      callResult: { loading: false, drawLoading: false, error: "" },
      winners: [],
      winner: {},
      rules: {
        amount: [(val) => val > 10 || `Max is 10 tickets per account!`],
      },
      discount: [ {tickets: 2, percent: 5},
      {tickets: 3, percent: 7.5},
      {tickets: 4, percent: 10},
      {tickets: 5, percent: 12.5},
      {tickets: 6, percent: 15},
      {tickets: 7, percent: 17.5},
      {tickets: 8, percent: 20},
      {tickets: 9, percent: 22.5},
      {tickets: 10, percent: 25}
      ]
    };
  },
  mounted() {
    // window.ethereum.on("accountsChanged", function (accounts) {
    //   // Time to reload your interface with accounts[0]!
    //   [this.account] = accounts;
    // });
    // this code snippet takes the account (wallet) that is currently active
  },
  async created() {
    this.lottery = this.$route.params.obj;
    this.ethData = this.$route.params.ethData;
    this.lottery.address = this.$route.params.address;
    this.loadData();
  },
  computed: {
    numberOfPlayers: function () {
      return this.lottery.players != null ? this.lottery.players.length : 0;
    },
    numberOfTickets: function () {
      return this.lottery.tickets != null ? this.lottery.tickets.length : 0;
    },
    // winProbability: function () {
    //   if (this.lottery.purchased ? this.lottery.purchased != 0 : false) {
    //     return (
    //       (this.lottery.purchased /
    //         this.lottery.ticketPrice /
    //         this.lottery.tickets.length) *
    //       100
    //     );
    //   } else {
    //     return 0;
    //   }
    // },
  },
  methods: {
    async loadData() {
      await this.$web3.eth.getAccounts().then((accounts) => {
        [this.account] = accounts;
        this.lottery.contract.methods
          .getWinProbabiltyByAccount(this.account)
          .call()
          .then((result) => {
            this.winProbability = result / 100;
          })
          .catch(() => {});

        this.lottery.contract.methods
          .getEnteredTicketsByAccount(this.account)
          .call()
          .then((result) => {
            this.ticketsBought = result;
          })
          .catch(() => {});
      });
      await this.lottery.contract.methods
        .revealWinners()
        .call()
        .then((res) => {
          for (let i = 0; i < res[0].length; i++) {
            this.winner = {};
            let array = res[0];
            let array2 = res[1];

            this.winner.reward = array[i];
            this.winner.address = array2[i];
            this.winners.push(this.winner);
          }
        })
        .catch(() => {});
      this.lottery.purchased = parseFloat(
        this.$web3.utils.fromWei(this.lottery.purchased, "ether")
      ).toFixed(4);
    },
    getPurchasedEthCurrentPrice() {
      return (
        parseFloat(this.ethData.current_price * this.lottery.purchased).toFixed(
          2
        ) + "€"
      );
    },
    getCurrentAmount() {
      let amount = parseFloat(
        this.$web3.utils.fromWei(this.lottery.currentAmount, "ether")
      );
      return amount.toFixed(4);
    },
    showPayAmount() {
      return this.lottery.amount != null && this.lottery.amount > 0
        ? this.$web3.utils.fromWei(
            this.calculateDiscountForTickets(),
            "ether"
          ) + "eth"
        : "";
    },
    ticketAmountChange() {
      return this.lottery.amount;
    },
    formatDateToTimer(uintDate) {
      return this.$utils.formatDateToTimer(new Date(+uintDate));
    },
    getDateFormat(uintDate) {
      return this.$utils.formatDate(new Date(+uintDate));
    },
    fromWeiToEth(value) {
      return parseFloat(this.$web3.utils.fromWei(value, "ether")).toFixed(4);
    },
    openDialog(item) {
      this.dialog = true;
      this.lottery = item;
    },
    close() {
      this.dialog = false;
    },
    calculateDiscountForTickets() {
      const ticketAmount = this.lottery.amount;
      let overralPrice = ticketAmount * this.lottery.ticketPrice;
      let ticketPrice = this.$web3.utils.toWei(
        overralPrice.toString(),
        "ether"
      );
      if (ticketAmount >= 2 && ticketAmount <= 20) {
        ticketPrice -= ticketPrice * (ticketAmount / 40);
      }
      return ticketPrice.toString();
    },
    buyTicket() {
      if (this.lottery.amount != null) {
        this.callResult.loading = true;
        const overralPrice = this.calculateDiscountForTickets();
        this.lottery.contract.methods
          .buyTicket(this.lottery.amount)
          .send({
            from: this.account,
            to: this.lottery.contract.options.address,
            value: overralPrice
                      })
          .then((res) => {
            console.log(res.data);
          })
          .catch(() => {})
          .finally(() => {
            this.callResult.loading = false;
            this.loadData()
          });
      }
    },

    drawWinner() {
      this.callResult.drawLoading = true;
      this.lottery.contract.methods
        .pickWinner()
        .send({
          from: this.account,
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch(() => {})
        .finally(() => {
          this.callResult.drawLoading = false;
        });
    },
  },
};
</script>
<style>
.timer {
  align-items: center;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  top: 0;
}

.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
