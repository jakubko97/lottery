<template>
  <v-app-bar elevate-on-scroll color="blue lighten-1" app>
    <!-- <v-app-bar-nav-icon @click.stop="switchDrawer" /> -->

    <v-toolbar-title> Lottery </v-toolbar-title>

    <v-spacer />
  </v-app-bar>
</template>

<script>
export default {
  name: "AppBar",
  data() {
    return {
      drawer: true,
    };
  },
  methods: {
    switchDrawer() {
      this.drawer = !this.drawer;
      this.$emit("switch-drawer", this.drawer);
    },
  },
};
</script>
