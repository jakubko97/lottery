import Vue from 'vue'
import axios from 'axios'

const xapi = axios.create({
  baseURL: 'https://api-rinkeby.etherscan.io/api',
  headers: {
    Accept: 'application/json, text/plain, */*'
  },
  params: {
    apiKey: '4TEKD93YHNFB83C453P47YTFAQGTJ6NT4H'
  }
})

export default xapi

Vue.prototype.$xapi = xapi
