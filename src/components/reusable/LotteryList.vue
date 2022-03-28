<template>
  <v-container fill-height fluid>
    <!-- class="text-center"
    style="justify-content: center; display: grid" -->
    <v-sheet v-if="callResult.loading" :color="`grey lighten-2`" class="pa-3">
      <v-skeleton-loader type="card"></v-skeleton-loader>
    </v-sheet>
    <v-row justify="center">
      <v-col v-for="lottery in projectData" :key="lottery.projectTitle">
        <LotteryCard
          :ethereumData="ethereumData"
          :archive="archive"
          :lottery="lottery"
        />
      </v-col>
      <!-- <div v-if="!callResult.loading && projectData.length == 0">
          NO {{ closedOpenLabel() }} LOTTERIES
        </div> -->
    </v-row>
  </v-container>
</template>

<script>
import LotteryCard from "@/components/reusable/LotteryCard";

export default {
  name: "LotteryList",
  components: {
    LotteryCard,
  },
  props: {
    ethereumData: {
      type: Object,
      default: null,
    },
    projectData: {
      type: Array,
      required: true,
    },
    archive: {
      type: Boolean,
      default: false,
    },
    callResult: {
      type: Object,
      required: true,
    },
  },
  methods: {
    closedOpenLabel() {
      return this.archive ? "CLOSED" : "OPEN";
    },
  },
};
</script>
