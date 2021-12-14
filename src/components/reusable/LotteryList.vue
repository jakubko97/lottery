<template>
  <v-container>
    <v-list-item
      dense
      v-for="lottery in projectData"
      :key="lottery.projectTitle"
      style="justify-content: center; text-align: left; display: grid"
    >
      <v-list-item-content>
        <LotteryCard :archive="archive" :lottery="lottery" />
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
