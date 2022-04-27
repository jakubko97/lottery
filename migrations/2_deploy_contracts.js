/* eslint-disable no-undef */
const LotteryBuilder = artifacts.require("LotteryBuilder");
const MetaCoin = artifacts.require("MetaCoin");
const ConvertLib = artifacts.require("ConvertLib");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(LotteryBuilder);
  deployer.deploy(MetaCoin);

};
