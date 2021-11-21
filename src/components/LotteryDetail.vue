<template>
  <basic-dialog
    v-model="dialog"
    scrollable
    :fullscreen="$vuetify.breakpoint.xs"
    persistent
    :title="lottery && lottery.projectTitle"
    @close-dialog="close()"
  >
    <v-card>
      <v-card-text>
        <div class="subtitle">Description: {{ lottery.projectDesc }}</div>
        <div class="text--primary">Ticket Price: {{ lottery.ticketPrice }}</div>
        <div class="text--primary">
          Players: {{ lottery.lotteryPlayersLength }}
        </div>

        <!-- <p class="text-h6 text--primary">Admin: {{ lottery.projectStarter }}</p> -->
        <v-row>
          <v-col md="4" cols="12">
            <div class="text--primary">
              Current Amount: {{ lottery.currentAmount }}
            </div>
          </v-col>
          <v-col md="8" cols="12">
            <div class="mr-2">11% šanca vyhrať 1.cenu</div>
            <div class="mr-2">18% šanca vyhrať 1. alebo 2.cenu</div>
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
              @click="buyTicket()"
            >
              Buy
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="6" cols="12">
            <span class="subtitle-1">
              Created: {{ getDateFormat(lottery.lotteryDateCreated) }}</span
            >
          </v-col>
          <v-col md="6" cols="12">
            <span class="subtitle-1">
              Deadline: {{ getDateFormat(lottery.deadlineTime) }}</span
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </basic-dialog>
</template>

<script>
export default {
  name: "LotteryDetailDialog",
  data() {
    return {
      dialog: false,
      lottery: {},
      account: null,
    };
  },
  mounted() {
    // this code snippet takes the account (wallet) that is currently active
    this.$web3.eth.getAccounts().then((accounts) => {
      [this.account] = accounts;
    });
  },

  methods: {
    getDateFormat(uintDate) {
      return this.$utils.formatDate(new Date(+uintDate));
    },

    openDialog(item) {
      this.dialog = true;
      this.lottery = item;
    },
    close() {
      this.dialog = false;
      this.rating = {};
    },
    buyTicket() {
      if (this.lottery.amount != null) {
        this.lottery.isLoading = true;
        const overralPrice = (
          this.lottery.amount * parseInt(this.lottery.ticketPrice)
        ).toString();
        this.lottery.contract.methods
          .buyTicket(overralPrice)
          .send({
            from: this.account,
            to: this.lottery.contract.options.address,
            value: this.$web3.utils.toWei(overralPrice, "ether"),
          })
          .then((res) => {
            console.log(res);
            this.lottery.isLoading = false;
          })
          .catch(() => {
            this.lottery.isLoading = false;
          });
      }
    },
  },
};
</script>
<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
