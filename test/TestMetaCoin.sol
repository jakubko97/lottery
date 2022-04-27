// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Lottery.sol";

contract TestLottery {

  // function testBuyTicket() public {
  //   Lottery lottery = Lottery(DeployedAddresses.Lottery());

  //   uint expected = 10000;
  //   uint ticketPrice = 10000;

  //   Assert.equal(lottery.getBalance(tx.origin), expected, "Owner should have 10000 MetaCoin initially");
  // }

  // function testInitialBalanceWithNewMetaCoin() public {
  //   Lottery lottery = Lottery();

  //   uint expected = 10000;

  //   Assert.equal(lottery.getBalance(tx.origin), expected, "Owner should have 10000 MetaCoin initially");
  // }

}
