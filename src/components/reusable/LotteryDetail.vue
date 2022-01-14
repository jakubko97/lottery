<template>
  <div>
    <v-card style="max-width: 600px; margin: 0 auto">
      <CountDownTimer
        v-if="lottery.deadlineTime > new Date().getTime()"
        class="timer"
        :date="formatDateToTimer(lottery.deadlineTime)"
      />
      <v-card-title>{{ lottery.projectTitle }}</v-card-title>
      <v-card-text>
        <div v-if="lottery.projectStarter == account">ADMIN</div>
        <div>
          <v-icon class="mr-2" color="primary">mdi-cash</v-icon>
          Price {{ lottery.ticketPrice }} ETH
        </div>
        <div>
          <v-icon class="mr-2" color="primary">mdi-account-multiple</v-icon>
          {{ numberOfPlayers }} Players 
        </div>
        <div>
          <v-icon class="mr-2" color="primary">mdi-bank</v-icon>
          Bank {{ $web3.utils.fromWei(lottery.currentAmount, "ether") }} ETH
        </div>
        <div>
          <v-icon class="mr-2" color="primary">mdi-timer-sand</v-icon>
          {{ getDateFormat(lottery.deadlineTime) }}
        </div>
        <div class="subtitle">Description: {{ lottery.projectDesc }}</div>

        <v-divider class="ma-2 pa-2"></v-divider>

        <v-row>
          <v-col></v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="15"
              :value="winProbability"
              color="primary"
              >{{ winProbability }} %</v-progress-circular
            >
            <p>Entered {{ lottery.purchased }} ETH</p>
            <p>Tickets bought {{ ticketsBought }}</p>
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
                {{ $web3.utils.fromWei(wnr.reward, "ether"), }}
                eth
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
            <span>
              Discount<br />
              2 tickets 5%<br />
              3 tickets 7.5%<br />
              4 tickets 10%<br />
              5 tickets 12.5%<br />
              6 tickets 15%<br />
              7 tickets 17.5%<br />
              8 tickets 20%<br />
              9 tickets 22.5%<br />
              10 tickets 25%<br />
            </span>
          </v-tooltip>
        </p>

        <p class="title" v-if="winners.length == 0 && lottery.deadlineTime < new Date().getTime()">
          Lottery has ended. Waiting for winners.
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
              color="primary"
              :loading="lottery.isLoading"
              @click.prevent="buyTicket()"
              >{{ showPayAmount() }} Pay</v-btn
            >
          </v-col>
        </v-row>
        <v-row v-if="winners.length == 0 &&  lottery.deadlineTime < new Date().getTime() &&
                lottery.projectStarter == account">
          <v-col>
            <v-btn
              depressed
              color="primary"
              :loading="lottery.isLoading"
              @click.prevent="pickWinner()"
              >Pick Winner</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import CountDownTimer from "./CountDownTimer.vue";
export default {
  name: "LotteryDetail",
  components: {
    CountDownTimer,
  },
  data() {
    return {
      dialog: false,
      lottery: { playersLength: 0, ticketsLength: 0 },
      account: null,
      winProbability: 0,
      ticketsBought: 0,
      winners: [],
      winner: {},
      rules: {
        amount: [(val) => val > 10 || `Max is 10 tickets per account!`]
      },
    };
  },
  mounted() {
    // window.ethereum.on("accountsChanged", function (accounts) {
    //   // Time to reload your interface with accounts[0]!
    //   [this.account] = accounts;
    // });
    // this code snippet takes the account (wallet) that is currently active
  },
  created() {
    this.$web3.eth.getAccounts().then((accounts) => {
      [this.account] = accounts;
      this.lottery.contract.methods.getWinProbabiltyByAccount(this.account).call().then((result) => {
        this.winProbability = result / 100
      }).catch(() => {});

       this.lottery.contract.methods.getEnteredTicketsByAccount(this.account).call().then((result) => {
        this.ticketsBought = result
      }).catch(() => {});
    });
    this.lottery = this.$route.params.obj;
    this.lottery.purchased = this.$web3.utils.fromWei(this.lottery.purchased, "ether").toString()
    this.lottery.contract.methods
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
    showPayAmount(){
      return this.lottery.amount != null && this.lottery.amount > 0 ? this.$web3.utils.fromWei(this.calculateDiscountForTickets(), "ether") + 'eth' : ''
    },
    ticketAmountChange() {
      return this.lottery.amount
    },
    formatDateToTimer(uintDate) {
      return this.$utils.formatDateToTimer(new Date(+uintDate));
    },
    getDateFormat(uintDate) {
      return this.$utils.formatDate(new Date(+uintDate));
    },

    openDialog(item) {
      this.dialog = true;
      this.lottery = item;
    },
    close() {
      this.dialog = false;
    },
    calculateDiscountForTickets() {
      const ticketAmount = this.lottery.amount
       let overralPrice =
          ticketAmount * this.lottery.ticketPrice;
      let ticketPrice = this.$web3.utils.toWei(overralPrice.toString(), "ether");
      if (ticketAmount >= 2) {
        ticketPrice -= ticketPrice * (ticketAmount / 40);
      }
      return ticketPrice.toString();
    },
    buyTicket() {
      if (this.lottery.amount != null) {
        this.lottery.isLoading = true;
        const overralPrice = this.calculateDiscountForTickets()
        this.lottery.contract.methods
          .buyTicket(overralPrice, this.lottery.amount)
          .send({
            from: this.account,
            to: this.lottery.contract.options.address,
            value: overralPrice,
          })
          .then((res) => {
            this.lottery.isLoading = false;
          })
          .catch(() => {
            this.lottery.isLoading = false;
          });
      }
    },

    pickWinner() {
      this.lottery.contract.methods
        .pickWinner()
        .send({
          from: this.account,
        })
        .then((res) => {
          this.lottery.isLoading = false;
        })
        .catch(() => {
          this.lottery.isLoading = false;
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