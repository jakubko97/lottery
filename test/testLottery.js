/* eslint-disable no-undef */
const truffleAssert = require('truffle-assertions');
const Lottery = artifacts.require("Lottery");
const assert = require("chai").assert;

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

contract('Lottery', (accounts) => {
  let lottery

  let randomNumber = 6
  let ticketPrice = web3.utils.toWei('0.10', "ether")
  const ticketLimit = 100
  const accountOne = accounts[0];
  let prizes = [70, 30]
  // helpers
  async function assertContractBalance(expectedBalance) {

    let actualBalance
    await lottery.getBalance.call().then(function (balance) { actualBalance = balance });
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
    let amount = ticketPrice * tickets
    await lottery.buyTicket(tickets, { from: entrant, value: amount })

    await assertEntrantCount(expectedEntrantCount);

    return tickets
  }

  async function enterIntoLotteryWithMultipleEntrantsAndVerifyContractState() {
    let expectedTicketCount = 0
    expectedTicketCount += await enterIntoLotteryAndVerifyContractState(accounts[1], 1)
    expectedTicketCount += await enterIntoLotteryAndVerifyContractState(accounts[2], 2)
    expectedTicketCount += await enterIntoLotteryAndVerifyContractState(accounts[3], 3)
    expectedTicketCount += await enterIntoLotteryAndVerifyContractState(accounts[4], 4)

    await assertTicketCount(expectedTicketCount)
  }

  async function createLottery(deadline = 1658775099) { //deadline 25.7.2022
    const id = 1
    const numberOfWinners = prizes.length
    const deployer = accounts[9]
    lottery = await Lottery.new(deployer, accountOne,
      id,
      deadline,
      ticketPrice,
      prizes,
      ticketLimit);

    const numberOfWinnersExcepted = await lottery.getNumberOfWinners();
    const lotteryOwner = await lottery.getOwner();
    const loteryTicketPrice = await lottery.getTicketPrice();
    const lotteryTicketLimit = await lottery.getLimitTicket();

    assert.equal(numberOfWinnersExcepted, numberOfWinners, "Number of winners did not match.");
    assert.equal(ticketPrice, loteryTicketPrice, "Ticket price did not match.");
    assert.equal(accountOne, lotteryOwner, "Creator did not match.");
    assert.equal(ticketLimit, lotteryTicketLimit, "Ticket limit did not match.");

    await assertContractBalance(0);
    await assertEntrantCount(0);
  }
  beforeEach(async () => {
  });

  afterEach(async () => {
    await lottery.kill({ from: accountOne });
  });

  it('allows to buy one ticket correctly', async () => {
    await createLottery()
    const accountTwo = accounts[1];

    const ticketPrice = (await lottery.getTicketPrice.call()).valueOf();
    const getLotteryBalanceBefore = (await lottery.getBalance.call()).toNumber();
    const entrantCountBefore = (await lottery.getEntrantCount.call()).toNumber();

    let tickets = await enterIntoLotteryAndVerifyContractState(accountTwo, 1)
    let amount = ticketPrice * tickets

    await assertEntrantCount(entrantCountBefore + 1)
    await assertContractBalance(getLotteryBalanceBefore + amount)
    await assertTicketCount(tickets)
  });
  it('allows to pick winner with multiple entrants', async () => {
    var time = new Date();
    time.setSeconds(time.getSeconds() + 10);
    await createLottery(parseInt(time.getTime() / 1000))
    await enterIntoLotteryWithMultipleEntrantsAndVerifyContractState()

    await sleep(11000)
    await lottery.pickWinner({ from: accountOne })

    const winnerObject = await lottery.revealWinners()
    const prizes = winnerObject[0]
    const winners = winnerObject[1]
    Array.from(prizes, prize => {
      prize = prize.toString()
    })
    assert.equal(winners.length, prizes.length, "The number of winners is not " + prizes.length);
  });
  it('prevents lottery entry if insufficient entry fee provided', async () => {
    await createLottery()

    await truffleAssert.reverts(lottery.buyTicket(1, { from: accounts[2], value: ticketPrice - 10000 }), 'Invalid entry fee provided');
  });
  it('prevents lottery entry if the address entered tickets are greater than limit', async () => {
    await createLottery()

    let amount = ticketPrice * ticketLimit + 1

    await truffleAssert.reverts(lottery.buyTicket(ticketLimit + 1, { from: accounts[4], value: amount }),
      'Entered tickets should not be over the limit ticket by address')
  });
  it("prevents to not be able to enter lottery with sending zero ether", async () => {
    await createLottery()
    let tickets = 0
    let amount = 0

    await truffleAssert.reverts(lottery.buyTicket(tickets, { from: accounts[4], value: amount }),
      "Invalid entry fee provided"
    );
  });
  it('prevents entry into the lottery if lottery is already closed', async () => {
    var time = new Date();
    time.setSeconds(time.getSeconds() + 10);
    await createLottery(parseInt(time.getTime() / 1000))
    await enterIntoLotteryWithMultipleEntrantsAndVerifyContractState()
    await sleep(11000);
    await lottery.pickWinner({ from: accountOne })

    await truffleAssert.reverts(lottery.buyTicket(1, { from: accounts[2], value: ticketPrice }),
      'The lottery has ended');

  });
  it('allows to pick winner with single entrant and return the funds', async () => {
    var time = new Date();
    time.setSeconds(time.getSeconds() + 10);
    await createLottery(parseInt(time.getTime() / 1000))
    const tickets = await enterIntoLotteryAndVerifyContractState(accounts[1]);
    const winnerBalanceBefore = await web3.eth.getBalance(accounts[1]);
    await sleep(11000);
    await lottery.pickWinner({ from: accountOne })

    const winnerBalanceAfter = await web3.eth.getBalance(accounts[1]);
    assert.equal(parseInt(winnerBalanceAfter, 10), parseInt(winnerBalanceBefore, 10) + parseInt(ticketPrice * tickets, 10),
      'Winner account balance incorrect after lottery completion');
    await assertContractBalance(0);

  });
  it('prevents drawing winner when lottery state is open', async () => {
    await createLottery()
    await enterIntoLotteryWithMultipleEntrantsAndVerifyContractState()

    await truffleAssert.reverts(lottery.pickWinner({ from: accountOne }), "Lottery is open")
  });
});
