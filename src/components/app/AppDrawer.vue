<template>
  <v-navigation-drawer
    v-bind="$attrs"
    width="256"
    mini-variant-width="76"
    color="blue darken-3"
    class="elevation-10"
    permanent
    expand-on-hover
    dark
    app
  >
    <v-list dense nav>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img
            :src="require('../../assets/crowdfunding.png')"
            class="mx-3"
            max-height="40"
            max-width="40"
            contain
          />
        </v-list-item-avatar>
      </v-list-item>

      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> DP Lottery </v-list-item-title>
          <v-list-item-subtitle>smart contracts</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list-item v-for="(link, idx) in links" :key="idx" :to="link.path" link>
        <v-list-item-icon>
          <v-icon>
            {{ link.meta.icon }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $i18n.t(link.meta.label) }}</v-list-item-title>
          <!-- <v-list-item-subtitle v-if="link.meta.label == 'Profile'">
            {{ account }}
          </v-list-item-subtitle> -->
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider />
  </v-navigation-drawer>
</template>

<script>
import router from "@/plugins/router";

export default {
  name: "AppDrawer",
  data() {
    return {
      links: [],
    };
  },
  props: {
    account: {
      type: String,
      required: true,
    },
  },
  created() {
    this.links = router.options.routes.filter(
      (p) => p.meta && p.meta.isMainMenuItem
    );
  },
};
</script>
