// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/access/Ownable.sol";

enum State {
    Open,
    Closed,
    Suspended
}

contract LotteryBuilder {
    using SafeMath for uint256;

    // List of existing projects
    Lottery[] private lotteries;
    address payable creator;

    constructor(address payable deployer) {
        creator = deployer;
    }

    // Event that will be emitted whenever a new project is started
    event ProjectStarted(
        address contractAddress,
        address projectStarter,
        string projectTitle,
        string projectDesc,
        uint256 deadline,
        uint256 ticketPrice,
        uint256 numberWinners,
        uint256[] rewards,
        uint256 limitTickets
    );

    /** @dev Function to start a new project.
     * @param title Title of the project to be created
     * @param description Brief description about the project
     * @param deadlineDate Project deadline in days
     * @param ticketPrice Project goal in wei
     */
    function startProject(
        address payable owner,
        string calldata title,
        string calldata description,
        uint256 deadlineDate,
        uint256 ticketPrice,
        uint256 numberWinners,
        uint256[] calldata rewards,
        uint256 limitTickets
    ) external {
        uint256 raiseUntil = deadlineDate;
        Lottery newProject = new Lottery(
            owner,
            title,
            description,
            raiseUntil,
            ticketPrice,
            numberWinners,
            rewards,
            limitTickets
        );
        lotteries.push(newProject);
        emit ProjectStarted(
            address(newProject),
            owner,
            title,
            description,
            raiseUntil,
            ticketPrice,
            numberWinners,
            rewards,
            limitTickets
        );
    }

    struct Winners {
        uint256[] values;
        address[] accounts;
    }
    mapping(uint256 => Winners) allWinners;

    struct participated {
        address lotteryAddress;
        uint256 value;
        uint256 ticketsAmount;
        State state;
        bool won;
        uint256 amountWon;
    }
    mapping(uint256 => participated) participatedList;

    function participatedByAddress(address _address)
        public
        returns (
            address[] memory,
            uint256[] memory,
            uint256[] memory,
            State[] memory,
            bool[] memory,
            uint256[] memory
        )
    {
        uint256 participatedIndex = 0;
        for (uint256 i = 0; i < lotteries.length; i++) {
            Lottery ltr = lotteries[i];
            address[] memory players = ltr.getPlayers();
            for (uint256 j = 0; j < players.length; j++) {
                if (players[j] == _address) {
                    participated storage par = participatedList[
                        participatedIndex
                    ];
                    par.lotteryAddress = ltr.getContractAddress();
                    par.value = ltr.getContributed(_address);
                    par.ticketsAmount = ltr.getEnteredTicketsByAccount(
                        _address
                    );
                    par.state = ltr.getState();
                    par.won = false;
                    par.amountWon = 0;

                    for (uint256 k = 0; k < ltr.getNumberOfWinners(); k++) {
                        if (_address == ltr.getWinner(k)) {
                            par.won = true;
                            par.amountWon = ltr.getWinnerAmount(k);
                        }
                    }
                    participatedIndex++;
                }
            }
        }

        address[] memory addrs = new address[](participatedIndex);
        uint256[] memory funds = new uint256[](participatedIndex);
        uint256[] memory tickets = new uint256[](participatedIndex);
        State[] memory states = new State[](participatedIndex);
        bool[] memory won = new bool[](participatedIndex);
        uint256[] memory amountWon = new uint256[](participatedIndex);

        for (uint256 i = 0; i < participatedIndex; i++) {
            participated storage pa = participatedList[i];
            addrs[i] = pa.lotteryAddress;
            funds[i] = pa.value;
            tickets[i] = pa.ticketsAmount;
            states[i] = pa.state;
            won[i] = pa.won;
            amountWon[i] = pa.amountWon;
        }

        return (addrs, funds, tickets, states, won, amountWon);
    }

    // function getTotalSpent(address _address) external view returns (uint256) {
    //     uint256 totalSpent = 0;
    //     totalSpent = this.getRewardsWonByAddress(_address) - this.getSpentState(_address);
    //     return totalSpent;
    // }

    function getCreator() public view returns (address) {
        return creator;
    }

    function getSpentState(address _address) external view returns (uint256) {
        uint256 spent = 0;

        for (uint256 i = 0; i < lotteries.length; i++) {
            Lottery ltr = lotteries[i];
            spent = spent + uint256(ltr.getContributed(_address));
        }

        return spent;
    }

    function getRewardsWonByAddress(address _address)
        external
        view
        returns (uint256)
    {
        uint256 rewardsWon = 0;

        for (uint256 i = 0; i < lotteries.length; i++) {
            Lottery ltr = lotteries[i];
            rewardsWon =
                uint256(rewardsWon) +
                uint256(ltr.getRewardsByAccount(_address));
        }
        return rewardsWon;
    }

    event RevealLatestWinners(Winners[] _a);

    function getLatestWinners() external view returns (Winners[] memory) {
        Lottery[] memory closedLotteries = this.returnClosedProjects();

        Winners[] memory winners = new Winners[](closedLotteries.length);
        if (closedLotteries.length != 0) {
            for (uint256 i = 0; i < closedLotteries.length; i++) {
                Lottery ltr = closedLotteries[i];
                (uint256[] memory values, address[] memory accounts) = ltr
                    .revealWinners();
                winners[i].values = values;
                winners[i].accounts = accounts;
            }
        }
        return winners;
    }

    function returnClosedProjects() external view returns (Lottery[] memory) {
        return this.getProjectsByState(State.Closed);
    }

    function returnOpenProjects() external view returns (Lottery[] memory) {
        return this.getProjectsByState(State.Open);
    }

    function getProjectsByState(State state)
        external
        view
        returns (Lottery[] memory)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < lotteries.length; i++) {
            Lottery ltr = lotteries[i];
            if (ltr.getState() == state) {
                count++;
            }
        }
        Lottery[] memory ltrs = new Lottery[](count);
        count = 0;
        for (uint256 i = 0; i < lotteries.length; i++) {
            Lottery ltr = lotteries[i];
            if (ltr.getState() == state) {
                ltrs[count] = ltr;
                count++;
            }
        }
        return ltrs;
    }

    /** @dev Function to get all projects' contract addresses.
     * @return A list of all projects' contract addreses
     */
    function returnAllLotteries() external view returns (Lottery[] memory) {
        return lotteries;
    }
}

contract Lottery {
    using SafeMath for uint256;
    // State variables
    address payable public creator;
    uint256 public priceTicket; // required to reach at least this much, else everyone gets refund
    uint256 public created;
    uint256 public currentBalance;
    uint256 public deadline;
    string public title;
    string public description;
    State public state = State.Open; // initialize on create
    mapping(address => uint256) public contributors;
    address[] public players;
    uint256 playersLength;
    uint256 public numberOfWinners;
    uint256[] public rewards;
    uint256 limitTickets;
    address[] public tickets;

    LotteryBuilder lotteryBuilder;

    function getDeployerAddress() public view returns (address) {
        return lotteryBuilder.getCreator();
    }

    struct winner {
        uint256 id;
        uint256 amount;
        address account;
    }
    mapping(uint256 => winner) winners;
    uint256[] public winnerIds;

    // function createTickets(address data) public {
    //     delete tickets; // This should reset the length to zero
    //     tickets.push(data);
    // }

    // function pushTicket(address data) public {
    //     tickets.push(data);
    // }

    // function getTickets() public view returns(address[] memory) {
    //     return tickets;
    // }
    event LotteryStateChanged(State newState);
    event Transfer(address indexed _from, uint256 _value);

    constructor(
        address payable projectStarter,
        string memory projectTitle,
        string memory projectDesc,
        uint256 deadlineTime,
        uint256 projectTicketPrice,
        uint256 numberWinners,
        uint256[] memory lotteryRewards,
        uint256 lotteryLimitTickets
    ) {
        creator = projectStarter;
        title = projectTitle;
        description = projectDesc;
        priceTicket = projectTicketPrice;
        deadline = deadlineTime;
        currentBalance = 0;
        created = block.timestamp;
        numberOfWinners = numberWinners;
        rewards = lotteryRewards;
        limitTickets = lotteryLimitTickets;
    }

    function getRewardsByAccount(address _address)
        public
        view
        returns (uint256)
    {
        uint256 rewardsWon = 0;
        for (uint256 i = 0; i < numberOfWinners; i++) {
            winner storage ltWinner = winners[i];
            if (ltWinner.account == _address) {
                rewardsWon = uint256(rewardsWon) + uint256(ltWinner.amount);
            }
        }
        return rewardsWon;
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }

    function getContributed(address _address) public view returns (uint256) {
        return contributors[_address];
    }

    function getState() public view returns (State) {
        return state;
    }

    function getWinner(uint256 id) public view returns (address) {
        return winners[id].account;
    }

    function getWinnerAmount(uint256 id) public view returns (uint256) {
        return winners[id].amount;
    }

    function buyTicket(uint256 overralPrice, uint256 ticketAmount)
        public
        payable
    {
        require(block.timestamp < deadline, "The lottery has ended.");
        require(overralPrice > 0, "Price must be over 0.");

        uint256 ticketsByAcc = this.getEnteredTicketsByAccount(msg.sender) +
            ticketAmount;
        require(
            limitTickets >= ticketsByAcc,
            "You are getting over the limit ticket."
        );

        contributors[msg.sender] = contributors[msg.sender].add(overralPrice);
        currentBalance = currentBalance.add(overralPrice);

        for (uint256 i = 0; i < ticketAmount; i++) {
            tickets.push(msg.sender);
        }

        bool doesPlayerEntered = false;
        for (uint256 i = 0; i < players.length; i++) {
            if (msg.sender == players[i]) {
                doesPlayerEntered = true;
            }
        }

        if (!doesPlayerEntered) {
            players.push(msg.sender);
        }

        emit Transfer(msg.sender, overralPrice);
    }

    function getNumberOfWinners() public view returns (uint256) {
        return numberOfWinners;
    }

    function getOwner() public view returns (address) {
        return creator;
    }

    function getEnteredTicketsByAccount(address _address)
        public
        view
        returns (uint256)
    {
        uint256 ticketsByAccount = 0;
        for (uint256 i = 0; i < tickets.length; i++) {
            if (_address == tickets[i]) {
                ticketsByAccount++;
            }
        }
        return ticketsByAccount;
    }

    function getWinProbabiltyByAccount(address _address)
        public
        view
        returns (uint256)
    {
        // vraciam percenta + navyse 2 desatinimi cislami,
        // kvoli tomu ze v Solidity sa neda pracovat s float
        // na frontende ak vstup predelim 100, dostanem percenta
        // napr 21,58
        return
            (this.getEnteredTicketsByAccount(_address) * 10000) /
            tickets.length;
    }

    function shuffle(address[] memory roundTickets) private view {
        for (uint256 i = 0; i < roundTickets.length; i++) {
            uint256 n = i +
                (uint256(keccak256(abi.encodePacked(block.timestamp))) %
                    (roundTickets.length - i));
            address temp = roundTickets[n];
            roundTickets[n] = roundTickets[i];
            roundTickets[i] = temp;
        }
    }

    function random(address[] memory roundTickets)
        private
        view
        returns (uint256)
    {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        roundTickets
                    )
                )
            );
    }

    function pickWinner() public payable isCreator {
        require(block.timestamp > deadline, "Lottery is still open");

        uint256 reward;
        currentBalance = address(this).balance;
        uint256 winnersReward = 95;
        uint256 creatorsReward = 5;
        for (uint256 i = 0; i < numberOfWinners; i++) {
            // calculate the REWARD based on draw ROUND
            reward =
                ((uint256(rewards[i]) * currentBalance) / uint256(10000)) *
                uint256(winnersReward);

            // shuffle tickets in round i
            shuffle(tickets);

            // get random address from tickets
            uint256 index = random(tickets) % tickets.length;

            // set the winner properties
            winner storage ltWinner = winners[i];
            ltWinner.account = tickets[index];
            ltWinner.amount = reward;
            winnerIds.push(i);

            // move out winner tickets
            for (uint256 j = 0; j < tickets.length; j++) {
                if (tickets[j] == ltWinner.account) {
                    deleteUser(j);
                }
            }

            // send reward to the winner
            payable(ltWinner.account).transfer(reward);
        }

        // reward for creator 3%
        // currentBalance = address(this).balance;
        // reward = ((100 * 3) / creatorsReward) * (currentBalance / 100);
        // payable(creator).transfer(reward);

        // reward for deployer 2%
        //reward = (100*3 / 5) * address(this).balance / 100;
        payable(getDeployerAddress()).transfer(address(this).balance);
        _changeState(State.Closed);
    }

    // Modifier to check if the function caller is the project creator
    modifier isCreator() {
        require(
            msg.sender == creator,
            "Only the contract creator can execute this action."
        );
        _;
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function storno(address sender) public {
        require(block.timestamp < deadline); //is open period

        uint256 amount = contributors[msg.sender];
        require(amount != 0);

        payable(sender).transfer(amount); //payment return
    }

    event LogDeleteUser(address indexed userAddress, uint256 index);

    function deleteUser(uint256 userIndex) public returns (address index) {
        address rowToDelete = tickets[userIndex];
        address rowToMove = tickets[tickets.length - 1];
        while (rowToMove == rowToDelete) {
            tickets.pop();
            rowToMove = tickets[tickets.length - 1];
        }
        tickets[userIndex] = tickets[tickets.length - 1];
        tickets[tickets.length - 1] = rowToDelete;
        tickets.pop();

        return rowToDelete;
    }

    function revealWinners()
        public
        view
        returns (uint256[] memory, address[] memory)
    {
        require(
            block.timestamp > deadline,
            "The winners have not been announced yet."
        );

        address[] memory addrs = new address[](winnerIds.length);
        uint256[] memory amounts = new uint256[](winnerIds.length);

        for (uint256 i = 0; i < winnerIds.length; i++) {
            winner storage ltWinner = winners[i];
            addrs[i] = ltWinner.account;
            amounts[i] = ltWinner.amount;
        }
        return (amounts, addrs);
    }

    /** @dev Function to get specific information about the project.
     * @return projectStarter Returns all the project's details
     */
    function getDetails(address account)
        public
        view
        returns (
            address payable projectStarter,
            string memory projectTitle,
            string memory projectDesc,
            uint256 deadlineTime,
            State currentState,
            uint256 currentAmount,
            uint256 ticketPrice,
            uint256 lotteryPlayersLength,
            uint256 lotteryDateCreated,
            uint256[] memory lotteryRewards,
            uint256 purchased
        )
    {
        projectStarter = creator;
        projectTitle = title;
        projectDesc = description;
        deadlineTime = deadline;
        currentState = state;
        currentAmount = currentBalance;
        ticketPrice = priceTicket;
        lotteryPlayersLength = playersLength;
        lotteryDateCreated = created;
        lotteryRewards = rewards;
        purchased = contributors[account];
    }

    // function purchasedByAddress(address _key) public view returns (uint256) {
    //     return contributors[_key];
    // }
    function _changeState(State _newState) private {
        state = _newState;
        emit LotteryStateChanged(state);
    }

    function getPlayersDetails()
        public
        view
        returns (
            address[] memory lotteryPlayers,
            address[] memory lotteryTickets
        )
    {
        lotteryPlayers = players;
        lotteryTickets = tickets;
    }
}
