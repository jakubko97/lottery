/* eslint-disable no-undef */
const LotteryBuilder = artifacts.require("LotteryBuilder");

contract('LotteryBuilder', (accounts) => {

  let lottery

  beforeEach(async () => {
    // Setup lottery
   
  });

//   it('should build lotteries', async () => {

//     // Make transaction from first account to second.
//     const accountTwo = accounts[1];

//     const ticketPrice = (await lottery.getTicketPrice.call()).valueOf();
//     const getLotteryBalanceBefore = (await lottery.getBalance.call()).toNumber();
//     const entrantCountBefore = (await lottery.getEntrantCount.call()).toNumber();

//     const tickets = 3
//     const amount = ticketPrice * tickets
//     await lottery.buyTicket(BigInt(amount), tickets, { from: accountTwo});

//     const getLotteryBalanceAfter = (await lottery.getBalance.call()).valueOf();
//     const entrantCount = (await lottery.getEntrantCount.call()).toNumber();

//     assert.equal(entrantCount, entrantCountBefore + 1, "Entrant count not correct");
//     assert.equal(getLotteryBalanceAfter, getLotteryBalanceBefore + amount, "Lottery balance is not correct");
//   });
})