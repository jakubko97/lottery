/* eslint-disable no-undef */
const Lottery = artifacts.require("Lottery");
const LotteryBuilder = artifacts.require("LotteryBuilder");

const { waitForEvent } = require('./utils');

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

contract('Lottery', (accounts) => {
  let lottery

  let randomNumber = 6
  let ticketPrice
  const accountOne = accounts[0];

  // helpers
  async function assertContractBalance(expectedBalance) {
    const actualBalance = (await lottery.getBalance.call());
    assert.equal(actualBalance.valueOf(), expectedBalance, "Expected balance is not correct");
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
    //expectedTicketsCount = expectedTicketsCount + tickets
    let amount = ticketPrice * tickets
    await lottery.buyTicket(BigInt(amount), tickets, { from: entrant, value: amount })

    await assertEntrantCount(expectedEntrantCount);

    return tickets
  }

  beforeEach(async () => {
    // Setup lottery

    const title = 'title'
    const description = 'description'
    const deadline = 1658775099
    const prizes = [100]
    const numberOfWinners = prizes.length
    ticketPrice = web3.utils.toWei('0.10', "ether")
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
    await lottery.buyTicket(BigInt(amount), tickets, { from: accountTwo });

    const getLotteryBalanceAfter = (await lottery.getBalance.call()).valueOf();
    const entrantCount = (await lottery.getEntrantCount.call()).toNumber();

    assert.equal(entrantCount, entrantCountBefore + 1, "Entrant count not correct");
    assert.equal(getLotteryBalanceAfter, getLotteryBalanceBefore + amount, "Lottery balance is not correct");
  });
  it('pick winner with multiple entrants', async () => {

    await enterIntoLotteryAndVerifyContractState(accounts[1], 1)
    await enterIntoLotteryAndVerifyContractState(accounts[2], 2)
    await enterIntoLotteryAndVerifyContractState(accounts[3], 3)
    await enterIntoLotteryAndVerifyContractState(accounts[4], 4)
    await enterIntoLotteryAndVerifyContractState(accounts[5], 5)
    await enterIntoLotteryAndVerifyContractState(accounts[6], 6)

    const instance = await lottery.pickWinner({ from: accountOne })
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
  });
  it('distribute the funds', async () => {

    const tickets = await enterIntoLotteryAndVerifyContractState(accounts[1]);
    const winnerBalanceBefore = await web3.eth.getBalance(accounts[1]); // after entering but before winning
    // await assertTicketCount(expectedTicketsCount);
    await lottery.pickWinner({ from: accountOne })

    const winnerBalanceAfter = await web3.eth.getBalance(accounts[1]); // TODO break into helper function?
    // balance after winning should equal balance before winning + entry fee for 1 user
    assert.equal(parseInt(winnerBalanceAfter, 10), parseInt(winnerBalanceBefore, 10) + parseInt(ticketPrice * tickets, 10),
      'Winner account balance incorrect after lottery completion.');

  });
  it('allows winner selection with multiple entrants', async () => {
    await enterIntoLotteryAndVerifyContractState(accounts[1], 1);
    await enterIntoLotteryAndVerifyContractState(accounts[2], 2);

    await lottery.pickWinner({ from: accountOne })

    await assertContractBalance(0);
    const winnerObject = await lottery.revealWinners()
    const winners = winnerObject[1]
    assert.isTrue(winners.includes(accounts[1]) || winners.includes(accounts[2]), 'expecting either account 1 or account 2 to win');
  });

});
