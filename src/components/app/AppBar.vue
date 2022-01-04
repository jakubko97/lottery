<template>
  <v-app-bar elevate-on-scroll color="blue lighten-1" app>
    <!-- <v-app-bar-nav-icon @click.stop="switchDrawer" /> -->

    <v-toolbar-title> Lottery </v-toolbar-title>
    <template v-slot:extension>
      <v-tabs v-model="tab" centered dark icons-and-text>
        <v-tabs-slider></v-tabs-slider>

        <v-tab href="#tab-1">
          Recents
          <v-icon>mdi-phone</v-icon>
        </v-tab>

        <v-tab href="#tab-2">
          Favorites
          <v-icon>mdi-heart</v-icon>
        </v-tab>

        <v-tab href="#tab-3">
          Nearby
          <v-icon>mdi-account-box</v-icon>
        </v-tab>
      </v-tabs>

      <v-btn
        fab
        color="accent"
        small
        bottom
        right
        absolute
        @click="createProject()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

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
    createProject() {
      this.$router.push("/CreateProject");
    },
    switchDrawer() {
      this.drawer = !this.drawer;
      this.$emit("switch-drawer", this.drawer);
    },
  },
};
</script>
