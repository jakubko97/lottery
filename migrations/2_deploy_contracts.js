/* eslint-disable no-undef */
const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");
const lotteryCreator = artifacts.require("lotteryCreator");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.deploy(lotteryCreator);
  deployer.link(ConvertLib, MetaCoin);
};
