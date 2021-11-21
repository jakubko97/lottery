/* eslint-disable */
import web3 from '../src/plugins/web3'
import createLotteryJson from "../build/contracts/lotteryCreator.json";

const address = createLotteryJson.networks[5777].address;
const abi =  createLotteryJson.abi;

const instance = new web3.eth.Contract(abi, address)

export default instance