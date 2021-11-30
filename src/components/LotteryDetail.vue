<template>
  <div>
    <v-card>
      <v-card-title>
        <CountDownTimer
          class="timer"
          :date="formatDateToTimer(lottery.deadlineTime)"
        />
      </v-card-title>
      <v-card-text>
        <div v-if="lottery.projectStarter == account">ADMIN</div>
        <div class="subtitle">Description: {{ lottery.projectDesc }}</div>
        <div class="text--primary">Ticket Price: {{ lottery.ticketPrice }}</div>
        <div class="text--primary">Players: {{ numberOfPlayers }}</div>
        <div class="text--primary">Tickets: {{ numberOfTickets }}</div>
        <div class="text--primary">Balance: {{ lottery.currentAmount }}</div>
        <div class="text--primary">Purchased: {{ lottery.purchased }}</div>

        <v-timeline align-top dense>
          <v-timeline-item color="teal lighten-3" small>
            <v-row class="pt-1">
              <v-col cols="3">
                <strong>{{ getDateFormat(lottery.lotteryDateCreated) }}</strong>
              </v-col>
              <v-col>
                <strong>Created</strong>
                <div class="text-caption">Lottery</div>
              </v-col>
            </v-row>
          </v-timeline-item>
          <!-- 
          <v-timeline-item color="pink" small>
            <v-row class="pt-1">
              <v-col cols="3">
                <strong>12pm</strong>
              </v-col>
              <v-col>
                <strong>Lunch break</strong>
              </v-col>
            </v-row>
          </v-timeline-item> -->
          <v-timeline-item
            v-if="lottery.deadlineTime > new Date().getTime()"
            color="pink"
            small
          >
            <v-row class="pt-1">
              <v-col cols="3">
                <strong>{{ getDateFormat(new Date().getTime()) }}</strong>
              </v-col>
              <v-col>
                <strong>Now</strong>
              </v-col>
            </v-row>
          </v-timeline-item>

          <v-timeline-item color="teal lighten-3" small>
            <v-row class="pt-1">
              <v-col cols="3">
                <strong>{{ getDateFormat(lottery.deadlineTime) }}</strong>
              </v-col>
              <v-col>
                <strong>Deadline</strong>
              </v-col>
            </v-row>
          </v-timeline-item>
          <v-timeline-item
            v-if="lottery.lotteryWinner != ''"
            color="pink"
            small
          >
            <v-row class="pt-1">
              <v-col cols="3">
                <strong>{{ lottery.lotteryWinner }}</strong>
              </v-col>
              <v-col>
                <strong>Winner Picked</strong>
              </v-col>
            </v-row>
          </v-timeline-item>
        </v-timeline>

        <!-- <p class="text-h6 text--primary">Admin: {{ lottery.projectStarter }}</p> -->
        <v-row v-if="lottery.lotteryWinner == ''">
          <v-col md="4" cols="12"> </v-col>
          <v-col md="8" cols="12">
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="15"
              :value="winProbability"
              color="primary"
            >
              {{ winProbability }} %
            </v-progress-circular>
            <v-text-field
              v-model="lottery.amount"
              v-if="lottery.deadlineTime > new Date().getTime()"
              label="Tickets"
              type="number"
              height="30"
            >
            </v-text-field>

            <v-btn
              :disabled="lottery.deadlineTime < new Date().getTime()"
              depressed
              color="primary"
              :loading="lottery.isLoading"
              @click.prevent="buyTicket()"
            >
              Buy
            </v-btn>
            <v-btn
              v-if="
                lottery.deadlineTime < new Date().getTime() &&
                lottery.projectStarter == account
              "
              depressed
              color="primary"
              :loading="lottery.isLoading"
              @click.prevent="pickWinner()"
            >
              Pick Winner
            </v-btn>
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
    };
  },
  mounted() {
    // window.ethereum.on("accountsChanged", function (accounts) {
    //   // Time to reload your interface with accounts[0]!
    //   [this.account] = accounts;
    // });
    // this code snippet takes the account (wallet) that is currently active
    this.$web3.eth.getAccounts().then((accounts) => {
      [this.account] = accounts;
    });
    this.lottery = this.$route.params.obj;
  },
  created() {
    if (this.account != null) {
      this.lottery.contract.methods
        .purchasedByAddress(this.account)
        .call()
        .then((data) => {
          this.lottery.purchased = data;
        })
        .catch((e) => {
          this.callResult.finished = true;
        });
    }
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
      console.log(this.account);
      console.log(this.lottery.deadlineTime);

      this.lottery.contract.methods
        .pickWinner()
        .send({
          from: this.account,
        })
        .then((res) => {
          console.log(res);
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
  background-color: #34495e;
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
