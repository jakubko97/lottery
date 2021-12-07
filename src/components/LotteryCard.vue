<template>
  <v-card
    style="width: 450px"
    color="blue lighten-1"
    elevation="0"
    height="225"
  >
    <v-card-title class="justify-center"
      >{{ lottery.projectTitle }}
    </v-card-title>
    <v-card-text>
      <v-row class="text-center">
        <v-col
          ><v-chip>{{ lottery.currentAmount }} ETH </v-chip>
        </v-col>
      </v-row>

      <v-row class="text-center">
        <v-col>{{ getDateFormat(lottery.deadlineTime) }} </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-chip
        @click="lotteryDetail(lottery)"
        color="blue darken-3"
        text-color="white"
        >Get Tickets
      </v-chip>
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
  },
  methods: {
    getDateFormat(uintDate) {
      return this.$utils.formatDate(new Date(+uintDate));
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
