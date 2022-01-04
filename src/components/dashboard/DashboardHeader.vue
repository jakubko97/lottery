<template>
  <v-row>
    <v-col class="text-center" cols="12" md="10">
      <!-- <div class="headline">Lotteries</div> -->
    </v-col>
    <v-col cols="12" md="2">
      <v-fab-transition>
        <v-btn
          color="pink"
          fab
          dark
          small
          absolute
          @click="createProject()"
          right
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "HelloWorld",
  methods: {
    createProject() {
      this.$router.push("/CreateProject");
    },
  },
};
</script>
