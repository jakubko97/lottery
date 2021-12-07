// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

enum State {
    Open,
    Closed,
    Suspended
}

contract lotteryCreator {
    using SafeMath for uint256;

    // List of existing projects
    Lottery[] private lotteries;
    address payable superadmin;

    // Event that will be emitted whenever a new project is started
    event ProjectStarted(
        address contractAddress,
        address projectStarter,
        string projectTitle,
        string projectDesc,
        uint256 deadline,
        uint256 ticketPrice,
        uint256 numberWinners,
        uint256[] rewards
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
        uint256[] calldata rewards
    ) external {
        uint256 raiseUntil = deadlineDate;
        Lottery newProject = new Lottery(
            owner,
            title,
            description,
            raiseUntil,
            ticketPrice,
            numberWinners,
            rewards
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
            rewards
        );
    }

    function participatedByAddress(address _address)
        external
        view
        returns (uint256)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < lotteries.length; i++) {
            Lottery ltr = lotteries[i];
            address[] memory players = ltr.getPlayers();
            for (uint256 j = 0; j < players.length; j++) {
                if (players[j] == _address) {
                    count++;
                }
            }
        }
        return count;
    }

    function getTotalSpent(address _address) external view returns (uint256) {
        uint256 totalSpent = this.getRewardsWonByAddress(_address) +
            this.getSpentState(_address);
        return totalSpent;
    }

    function getSpentState(address _address) external view returns (uint256) {
        uint256 spent = 0;

        for (uint256 i = 0; i < lotteries.length; i++) {
            Lottery ltr = lotteries[i];
            spent = spent + ltr.getContributed(_address);
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
            rewardsWon = rewardsWon + ltr.getRewardsByAccount(_address);
        }
        return rewardsWon;
    }

    function returnClosedProjects() external view returns (Lottery[] memory) {
        Lottery[] memory ltrs;
        uint256 count = 0;
        for (uint256 i = 0; i < lotteries.length; i++) {
            Lottery ltr = lotteries[i];
            if (ltr.getState() == State.Closed) {
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
    address[] public tickets;
    uint256 playersLength;
    uint256 public numberOfWinners;
    uint256[] public rewards;

    struct winner {
        uint256 amount;
        address account;
    }
    mapping(uint256 => winner) winners;
    uint256[] public winnerIds;

    // Modifier to check if the function caller is the project creator
    modifier isCreator() {
        require(msg.sender == creator);
        _;
    }

    event LotteryStateChanged(State newState);
    event Transfer(address indexed _from, uint256 _value);

    constructor(
        address payable projectStarter,
        string memory projectTitle,
        string memory projectDesc,
        uint256 deadlineTime,
        uint256 projectTicketPrice,
        uint256 numberWinners,
        uint256[] memory lotteryRewards
    ) public {
        creator = projectStarter;
        title = projectTitle;
        description = projectDesc;
        priceTicket = projectTicketPrice;
        deadline = deadlineTime;
        currentBalance = 0;
        created = block.timestamp;
        numberOfWinners = numberWinners;
        rewards = lotteryRewards;
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
                rewardsWon = rewardsWon + ltWinner.amount;
            }
        }
        return rewardsWon;
    }

    function getContributed(address _address) public view returns (uint256) {
        return contributors[_address];
    }

    function getState() public view returns (State) {
        return state;
    }

    function buyTicket(uint256 overralPrice, uint256 ticketAmount)
        public
        payable
    {
        require(block.timestamp < deadline); // in the fundraising period
        require(overralPrice > 0);

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

    function getOwner() public view returns (address) {
        return creator;
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, tickets)
                )
            );
    }

    function pickWinner() public payable restricted {
        require(block.timestamp > deadline);

        uint256 reward;
        currentBalance = address(this).balance;

        for (uint256 i = 0; i < numberOfWinners; i++) {
            reward = (uint256(rewards[i]) * currentBalance) / uint256(100);
            uint256 index = random() % tickets.length;
            winner storage ltWinner = winners[i];
            ltWinner.account = tickets[index];
            ltWinner.amount = reward;
            winnerIds.push(i);
            for (uint256 j = 0; j < tickets.length; j++) {
                if (tickets[j] == ltWinner.account) {
                    delete tickets[j];
                }
            }
            payable(ltWinner.account).transfer(reward);
        }
        tickets = new address[](0);
        _changeState(State.Closed);
    }

    modifier restricted() {
        require(msg.sender == creator);
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
        deletePlayer(sender); //remove from lottery
    }

    function deletePlayer(address player) public returns (bool) {
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == player) {
                delete players[i];
                return true;
            }
        }
        return false;
    }

    function revealWinners()
        public
        view
        returns (uint256[] memory, address[] memory)
    {
        require(block.timestamp > deadline);

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