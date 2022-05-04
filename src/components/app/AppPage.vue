<template>
  <v-main id="greyee">
    <!-- <v-parallax
      src="https://smartcontract.imgix.net/newsletter_bg.svg?auto=compress%2Cformat)"
      height="820"
      jumbotron
    > -->
      <v-container fluid>
        <transition name="fade" mode="out-in">
          <router-view :key="$route.fullPath" />
        </transition>
      </v-container>
    <!-- </v-parallax> -->
  </v-main>
</template>

<script>
export default {
  name: "AppPage",
  metaInfo() {
    return {
      title: this.$route.name,
    };
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
#greyee {
background: url('https://smartcontract.imgix.net/newsletter_bg.svg?auto=compress%2Cformat')
}
</style>
