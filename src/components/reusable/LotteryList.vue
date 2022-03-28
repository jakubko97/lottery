<template>
  <v-container
    class="text-center"
    style="justify-content: center; display: grid"
  >
    <v-row>
      <v-fade-transition>
        <v-col dense v-for="lottery in projectData" :key="lottery.projectTitle">
          <LotteryCard
            :ethereumData="ethereumData"
            :archive="archive"
            :lottery="lottery"
          />
        </v-col>
        <div v-if="callResult.finished && projectData.length == 0">
          NO {{ closedOpenLabel() }} LOTTERIES
        </div>
      </v-fade-transition>
      <v-sheet
        v-if="!callResult.finished"
        :color="`grey lighten-2`"
        class="pa-3"
      >
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-sheet>
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
