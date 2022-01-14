<template>
  <v-container>
    <v-list-item
      dense
      v-for="lottery in projectData"
      :key="lottery.projectTitle"
      style="justify-content: center; display: grid"
    >
      <v-list-item-content>
        <LotteryCard :ethereumData="ethereumData" :archive="archive" :lottery="lottery" />
      </v-list-item-content>
    </v-list-item>
  </v-container>
</template>

<script>
import LotteryCard from "@/components/reusable/LotteryCard";

export default {
  name: "HelloWorld",
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
};
</script>
