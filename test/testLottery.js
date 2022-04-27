/* eslint-disable no-undef */
const Lottery = artifacts.require("Lottery");
const LotteryBuilder = artifacts.require("LotteryBuilder");

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));

contract('Lottery', (accounts) => {
  // it('should put 10000 MetaCoin in the first account', async () => {
  //   const lotter = await Lottery.deployed();
  //   const balance = await lotter.getBalance.call(accounts[0]);

  //   assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
  // });
  // it('should call a function that depends on a linked library', async () => {
  //   const lotter = await Lottery.deployed();
  //   const lotteryBalance = (await lotter.getBalance.call(accounts[0])).toNumber();
  //   const lotteryEthBalance = (await lotter.getBalanceInEth.call(accounts[0])).toNumber();

  //   assert.equal(lotteryEthBalance, 2 * lotteryBalance, 'Library function returned unexpected function, linkage may be broken');
  // });

  let lottery

  let randomNumber = 6

  const accountOne = accounts[0];

  // helpers
  async function assertContractBalance(expectedBalance) {
    const actualBalance = (await lottery.getBalance.call()).toNumber();
    assert.equal(actualBalance, expectedBalance, "Expected balance is not correct");
  }

  async function assertTicketCount(expectedTicketCount) {
    const actualTicketCount = (await lottery.getTicketsCount.call()).toNumber();
    assert.equal(actualTicketCount, expectedTicketCount, "Expected tickets count is not correct");
  }


  async function assertEntrantCount(expectedEntrantCount) {
    const actualEntrantCount = (await lottery.getEntrantCount.call()).toNumber();
    assert.equal(actualEntrantCount, expectedEntrantCount, "Expected entrant count is not correct");
  }

  async function enterIntoLotteryAndVerifyContractState(entrant = accounts[0], expectedEntrantCount = 1) {
    const ticketPrice = (await lottery.getTicketPrice.call()).valueOf();

    let tickets = Math.floor(Math.random() * randomNumber) + 1; // Returns a random integer from 1 to 5:
    expectedTicketsCount = expectedTicketsCount + tickets
    let amount = ticketPrice * tickets
    await lottery.buyTicket(BigInt(amount), tickets, { from: entrant, value: amount})

    await assertEntrantCount(expectedEntrantCount);
    await assertContractBalance(validEntryValue * expectedEntrantCount);
  }

  beforeEach(async () => {
    // Setup lottery

    const title = 'title'
    const description = 'description'
    const deadline = 1658775099
    const prizes = [40,20,20,10,10]
    const numberOfWinners = prizes.length
    const ticketPrice = web3.utils.toWei('0.10', "ether")
    const ticketLimit = 100
    lottery = await Lottery.new(accountOne,
      title,
      description,
      deadline,
      ticketPrice,
      numberOfWinners,
      prizes,
      ticketLimit);  

    const numberOfWinnersExcepted = await lottery.getNumberOfWinners();
    const lotteryOwner = await lottery.getOwner();
    const lotteryTitle = await lottery.getTitle();
    const lotteryDescription = await lottery.getDescription();
    const loteryTicketPrice = await lottery.getTicketPrice();
    const lotteryTicketLimit = await lottery.getLimitTicket();

    assert.equal(numberOfWinnersExcepted, numberOfWinners, "Number of winners did not match.");
    assert.equal(title, lotteryTitle, "Title did not match.");
    assert.equal(description, lotteryDescription, "Description did not match.");
    assert.equal(ticketPrice, loteryTicketPrice, "Ticket price did not match.");
    //assert.equal(prizes, lotteryPrizes, "Prizes did not match.");
    assert.equal(accountOne, lotteryOwner, "Creator did not match.");
    assert.equal(ticketLimit, lotteryTicketLimit, "Ticket limit did not match.");

    await assertContractBalance(0);
    await assertEntrantCount(0);
  });

  it('should buy ticket correctly', async () => {

    // Make transaction from first account to second.
    const accountTwo = accounts[1];

    const ticketPrice = (await lottery.getTicketPrice.call()).valueOf();
    const getLotteryBalanceBefore = (await lottery.getBalance.call()).toNumber();
    const entrantCountBefore = (await lottery.getEntrantCount.call()).toNumber();

    const tickets = 3
    const amount = ticketPrice * tickets
    await lottery.buyTicket(BigInt(amount), tickets, { from: accountTwo});

    const getLotteryBalanceAfter = (await lottery.getBalance.call()).valueOf();
    const entrantCount = (await lottery.getEntrantCount.call()).toNumber();

    assert.equal(entrantCount, entrantCountBefore + 1, "Entrant count not correct");
    assert.equal(getLotteryBalanceAfter, getLotteryBalanceBefore + amount, "Lottery balance is not correct");
  });
  it('pick winner', async () => {

    enterIntoLotteryAndVerifyContractState(accounts[1], 1)
    enterIntoLotteryAndVerifyContractState(accounts[2], 2)
    enterIntoLotteryAndVerifyContractState(accounts[3], 3)
    enterIntoLotteryAndVerifyContractState(accounts[4], 4)
    enterIntoLotteryAndVerifyContractState(accounts[5], 5)
    enterIntoLotteryAndVerifyContractState(accounts[6], 6)
    
    await lottery.pickWinner({from: accountOne})
    // console.log(await lottery.getTickets())

    const winnerObject = await lottery.revealWinners()
    const prizes = winnerObject[0]
    const winners = winnerObject[1]
    Array.from(prizes, prize => {
      prize = prize.toString()
    })
    console.log(prizes)
    console.log(winners)
    // await assertTicketCount(expectedTicketsCount);
    await assertEntrantCount(6);
  });
  
});
