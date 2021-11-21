<template>
  <v-main class="greyee">
    <v-container fluid>
      <transition name="fade" mode="out-in">
        <router-view :key="$route.fullPath" />
      </transition>
    </v-container>
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
</style>
