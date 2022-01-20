<template id="countdown-template">
  <v-card color="blue lighten-1" elevation="0" class="countdown">
    <div class="block">
      <p class="digit">{{ days | two_digits }}</p>
      <p class="text">Days</p>
    </div>
    <div class="block">
      <p class="digit">{{ hours | two_digits }}</p>
      <p class="text">Hours</p>
    </div>
    <div class="block">
      <p class="digit">{{ minutes | two_digits }}</p>
      <p class="text">Minutes</p>
    </div>
    <div class="block">
      <p class="digit">{{ seconds | two_digits }}</p>
      <p class="text">Seconds</p>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "CountDownTimer",

  mounted() {
    window.setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000);
    }, 1000);
  },
  props: {
    date: {
      type: String,
    },
  },
  data() {
    return {
      now: Math.trunc(new Date().getTime() / 1000),
    };
  },
  computed: {
    dateInMilliseconds() {
      return Math.trunc(Date.parse(this.date) / 1000);
    },
    seconds() {
      return (this.dateInMilliseconds - this.now) % 60;
    },
    minutes() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60) % 60;
    },
    hours() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60) % 24;
    },
    days() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60 / 24);
    },
  },
};
</script>

<style>
.countdown {
  display: flex;
}

.block {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;
}

.text {
  font-size: 18px;
  font-family: "Roboto Condensed", serif;
  font-weight: 20;
  margin-top: 6px;
  margin-bottom: 2px;
  text-align: center;
}

.digit {
  color: #ecf0f1;
  font-size: 50px;
  font-weight: 45;
  font-family: "Roboto", serif;
  margin: 10px;
  text-align: center;
}
</style>
