<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >

    </v-app-bar>

    <v-main>
      <LotteryWrapper/>
    </v-main>
  </v-app>
</template>

<script>
import LotteryWrapper from './components/LotteryWrapper';

export default {
  name: 'App',

  components: {
    LotteryWrapper,
  },

  data: () => ({
    //
  }),
};
</script>
