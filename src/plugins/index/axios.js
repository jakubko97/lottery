import Vue from 'vue'
import axios from 'axios'

const xapi = axios.create({
  headers: {
    Accept: 'application/json, text/plain, */*'
  }
})

export default xapi

Vue.prototype.$xapi = xapi
