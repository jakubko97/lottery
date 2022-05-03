/* eslint-disable no-undef */
const LotteryBuilder = artifacts.require("LotteryBuilder");

module.exports = function(deployer, network, accounts) {
  const userAddress = accounts[3];
  deployer.deploy(LotteryBuilder);
};
