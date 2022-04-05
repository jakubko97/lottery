/* eslint-disable no-undef */
const LotteryBuilder = artifacts.require("LotteryBuilder");

module.exports = function(deployer) {
  const creatorAddress = '0x998e00A168718f55Ac73b607c40b579Cc5F4DCEa'
  deployer.deploy(LotteryBuilder, creatorAddress);
};
