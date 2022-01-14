<template>
  <v-app-bar elevate-on-scroll color="blue darken-1" app>
    <!-- <v-app-bar-nav-icon @click.stop="switchDrawer" /> -->
    <div class="headline">Blockchain Lottery</div>
    <template v-slot:extension>
      <v-tabs v-model="tab" centered dark>
        
        <v-tabs-slider></v-tabs-slider>

        <v-tab :to="'/'">
          Home
        </v-tab>

        <v-tab :to="'/Archive'">
          Archive
        </v-tab>

        <v-tab :to="'/AccountProfile'">
          Profile
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
      tab: null
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
