<template>
  <div>
    <v-card style="max-width: 600px; margin: 0 auto;">
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
          {{ lottery.ticketPrice }} ETH
        </div>
        <div>
          <v-icon class="mr-2" color="primary">mdi-account-multiple</v-icon>
          {{ numberOfPlayers }}
        </div>
        <div>
          <v-icon class="mr-2" color="primary">mdi-bank</v-icon>
          {{ $web3.utils.fromWei(lottery.currentAmount, "ether") }} ETH
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
            >{{ winProbability.toFixed(2) }} %</v-progress-circular>
            Entered {{ lottery.purchased }} ETH
          </v-col>
        </v-row>

        <v-divider class="ma-2 pa-2"></v-divider>

        <v-list v-if="winners.length != 0" two-line>
          <v-icon class="mr-2" color="orange">mdi-trophy</v-icon>Winners:
          <v-list-item v-for="(wnr,index) in winners" :key="wnr.address">
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
              :disabled="lottery.deadlineTime < new Date().getTime()"
              depressed
              color="primary"
              :loading="lottery.isLoading"
              @click.prevent="buyTicket()"
            >Buy</v-btn>
            <v-btn
              v-if="
                lottery.deadlineTime < new Date().getTime() &&
                lottery.projectStarter == account
              "
              depressed
              color="primary"
              :loading="lottery.isLoading"
              @click.prevent="pickWinner()"
            >Pick Winner</v-btn>
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
      winners: [],
      winner: {},
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
    });
    this.lottery = this.$route.params.obj;

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
      .catch(() => { });
  },
  computed: {
    numberOfPlayers: function () {
      return this.lottery.players != null ? this.lottery.players.length : 0;
    },
    numberOfTickets: function () {
      return this.lottery.tickets != null ? this.lottery.tickets.length : 0;
    },
    winProbability: function () {
      if (this.lottery.purchased ? this.lottery.purchased != 0 : false) {
        return (
          (this.lottery.purchased /
            this.lottery.ticketPrice /
            this.lottery.tickets.length) *
          100
        );
      } else {
        return 0;
      }
    },
  },
  methods: {
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
    buyTicket() {
      if (this.lottery.amount != null) {
        this.lottery.isLoading = true;
        const overralPrice = (
          this.lottery.amount * parseInt(this.lottery.ticketPrice)
        ).toString();
        this.lottery.contract.methods
          .buyTicket(overralPrice, this.lottery.amount)
          .send({
            from: this.account,
            to: this.lottery.contract.options.address,
            value: this.$web3.utils.toWei(overralPrice, "ether"),
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
