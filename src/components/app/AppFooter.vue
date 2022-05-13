<template>
  <v-footer color="primary" padless>
    <v-card class="primary flex" flat tile>
      <v-card-text class="text-center">
        <v-btn
          v-for="icon in icons"
          :key="icon.name"
          class="mx-4 white--text"
          icon
        >
          <v-icon @click="open(icon.link)" size="24px">
            {{ icon.name }}
          </v-icon>
        </v-btn>
      </v-card-text>
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
      icons: [
        {
          name: "mdi-twitter",
          link: "https://twitter.com/j4jakub",
        },
        {
          name: "mdi-linkedin",
          link: "https://www.linkedin.com/in/jakub-jan%C4%8D%C3%ADk-170a58188/",
        },
        {
          name: "mdi-github",
          link: "https://github.com/jakubko97/lottery",
        },
      ],
    };
  },
  methods: {
    open(link) {
      window.open(link, "_blank");
    },
  },
};
</script>