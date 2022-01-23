<template>
  <v-container class="text-center" style="justify-content: center; display: grid">
    <v-card v-if="projectData.length == 0" elevation="0" class="rounded-lg" style="width: 450px" height="100">
      <v-card-text class="headline"> NO {{ closedOpenLabel() }} LOTTERIES </v-card-text>
    </v-card>
    <v-row>
    <v-col
      dense
      v-for="lottery in projectData"
      :key="lottery.projectTitle"
    >
        <LotteryCard
          :ethereumData="ethereumData"
          :archive="archive"
          :lottery="lottery"
        />
    </v-col>
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
  },
  methods: {
    closedOpenLabel(){
      return this.archive ? 'CLOSED' : 'OPEN'
    }
  }
};
</script>
