/* eslint-disable */
import web3 from '../src/plugins/web3'
import lotteryJson from "../build/contracts/Lottery.json";

const abi =  lotteryJson.abi;

export default (address) => {
  const instance = new web3.eth.Contract(abi, address);
  return instance;
};