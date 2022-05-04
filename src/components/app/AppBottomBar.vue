<template>
  <v-bottom-navigation
    :value="value"
    app
    color="primary"
  >
    <v-btn :to="'/'">
      <span>Home</span>

      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn :to="'/Archive'">
      <span>Archive</span>

      <v-icon>mdi-archive</v-icon>
    </v-btn>

    <v-btn :to="'/AccountProfile'">
      <span>Profile</span>

      <v-icon>mdi-account-box</v-icon>
    </v-btn>
      <v-btn :to="'/CreateProject'">
      <span>Create</span>

      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: "AppBottomBar",
  data() {
    return {
     value: 1
    };
  },
  created() {
  },
  methods: {
  },
};
</script>

<style>

</style>
