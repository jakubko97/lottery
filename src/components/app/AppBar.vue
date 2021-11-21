<template>
  <v-app-bar elevate-on-scroll color="blue lighten-1" app>
    <v-app-bar-nav-icon @click.stop="switchDrawer" />

    <v-toolbar-title> DP Lottery </v-toolbar-title>

    <v-spacer />

    <v-text-field
      flat
      solo-inverted
      hide-details
      prepend-inner-icon="mdi-magnify"
      append-icon="mdi-delete"
      :label="$i18n.t('search')"
      class="pa-2"
      style="max-width: 600px"
    />
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
