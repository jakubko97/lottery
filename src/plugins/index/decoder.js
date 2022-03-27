import Vue from 'vue'
import lotteryJson from "../../../build/contracts/Lottery.json";

const abiDecoder = require('abi-decoder');

const abi = lotteryJson.abi;
abiDecoder.addABI(abi)

export default abiDecoder

Vue.prototype.$abiDecoder = abiDecoder