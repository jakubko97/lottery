/* eslint-disable no-undef */
const lotteryCreator = artifacts.require("lotteryCreator");

module.exports = function(deployer) {
  deployer.deploy(lotteryCreator);
};
