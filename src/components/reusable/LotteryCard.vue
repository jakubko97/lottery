<template>
  <v-card style="width: 450px" color="blue lighten-1" elevation="0" height="225">
    <v-card-title class="justify-center white--text">{{ lottery.projectTitle }}</v-card-title>
    <v-card-text>
      <v-row class="text-center">
        <v-col>{{ $web3.utils.fromWei(lottery.currentAmount, "ether"), }} ETH</v-col>
      </v-row>

      <v-row class="text-center">
        <v-col class="white--text">
          <v-icon>mdi-clock-outline</v-icon>
          <div>{{ getLotteryStatus() }}</div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-chip
        @click="lotteryDetail(lottery)"
        color="blue darken-3"
        text-color="white"
      >{{ getBtnLabel() }}</v-chip>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "LotteryCard",
  props: {
    lottery: {
      type: Object,
      required: true,
    },
    archive: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getLotteryStatus() {
      return this.lottery.deadlineTime < new Date().getTime() ? 'closed' : 'open'
    },
    getBtnLabel() {
      return this.archive ? "See Details" : "Get Tickets";
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

<style scoped>
</style>
