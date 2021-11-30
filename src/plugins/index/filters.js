
import Vue from 'vue'

Vue.filter("two_digits", (value) => {
  if (value < 0) {
    return "00";
  }
  if (value.toString().length <= 1) {
    return `0${value}`;
  }
  return value;
});