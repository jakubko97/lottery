<template>
  <v-footer color="primary" padless>
    <v-card class="primary flex" flat tile>
      <v-card-text class="py-2 white--text text-center">
        {{ new Date().getFullYear() }} © <strong>Jakub Jančík</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>
<script>
export default {
  data() {
    return {
      icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
    };
  },
};
</script>