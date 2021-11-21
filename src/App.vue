<template>
  <v-app id="fei_dp_lottery">
    <app-app-bar @switch-drawer="switchDrawer"></app-app-bar>
    <app-app-page></app-app-page>
    <app-app-drawer v-model="drawer"></app-app-drawer>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data() {
    return { drawer: true };
  },
  created() {
    //this.$root.$i18n.locale = locale.split("-")[0];
  },

  methods: {
    switchDrawer(val) {
      this.drawer = val;
    },
    metaInfo() {
      return {
        htmlAttrs: { lang: this.$i18n.locale },
        meta: [
          { name: "viewport", content: "width=device-width, initial-scale=1" },
          { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
        ],
        title: "DSBlockchain",
        titleTemplate: (titleChunk) => {
          return titleChunk ? `DP | ${titleChunk}` : "DPSmartContracts";
        },
      };
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .v-expansion-panel-content__wrap {
    padding: 0px 12px 12px 12px !important;
  }
}
</style>
