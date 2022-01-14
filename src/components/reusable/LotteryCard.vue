<template>
  <v-card
    class="rounded-lg"
    style="width: 450px"
    color="blue lighten-1"
    elevation="0"
    height="260"
  >
    <v-card-title class="white--text subtitle-2">{{
      lottery.projectTitle
    }}</v-card-title>
    <v-card-text>
      <v-row class="text-center">
        <v-col>
          <span class="title white--text">Jackpot <br /></span
          ><span class="headline white--text">
            {{ calculateEthAmount() }} {{  this.ethereumData != null ? this.ethereumData.symbol : ''}}</span
          ><br>
          <span class="subtitle-1 white--text">
            {{  calculateEthPrice()  }}
            </span>
          </v-col>
      </v-row>

      <v-row class="text-center">
        <v-col class="white--text">
          <div>
            {{ days | two_digits }} days {{ hours | two_digits }}:{{
              minutes | two_digits
            }}:{{ seconds | two_digits }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-chip
        @click="lotteryDetail(lottery)"
        color="accent"
        text-color="white"
        
        >{{ getBtnLabel() }}</v-chip
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "LotteryCard",
  data() {
    return {
      now: Math.trunc(new Date().getTime() / 1000),
    };
  },
  props: {
    ethereumData: {
      type: Object,
      default: null,
    },
    lottery: {
      type: Object,
      required: true,
    },
    archive: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    dateInMilliseconds() {
      return Math.trunc(
        Date.parse(this.formatDateToTimer(this.lottery.deadlineTime)) / 1000
      );
    },
    seconds() {
      return (this.dateInMilliseconds - this.now) % 60;
    },
    minutes() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60) % 60;
    },
    hours() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60) % 24;
    },
    days() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60 / 24);
    },
  },
  mounted() {
    window.setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000);
    }, 1000);
  },
  methods: {
    calculateEthAmount() {
      return parseFloat(this.$web3.utils.fromWei(this.lottery.currentAmount, "ether")).toFixed(3)
    },
    calculateEthPrice(){
      const ethPrice = this.ethereumData != null ? (parseFloat(this.ethereumData.current_price) * this.$web3.utils.fromWei(this.lottery.currentAmount, "ether")) : 0
      return ethPrice.toFixed(2) + '€'
    },
    formatDateToTimer(uintDate) {
      return this.$utils.formatDateToTimer(new Date(+uintDate));
    },
    getLotteryStatus() {
      return this.lottery.deadlineTime < new Date().getTime()
        ? "closed"
        : "open";
    },
    getBtnLabel() {
      return this.archive
        ? "See Details"
        : "Get tickets from " + this.lottery.ticketPrice + " ETH";
    },
    lotteryDetail(lottery) {
      this.$router.push({
        name: "LotteryDetail",
        params: {
          obj: { ...lottery },
        },
      });
    },
  },
};
</script>

<style scoped></style>
