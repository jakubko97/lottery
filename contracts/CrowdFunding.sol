// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../console.sol";

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
        uint256 ticketPrice
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
        uint256 ticketPrice
    ) external {
        uint256 raiseUntil = deadlineDate;
        Lottery newProject = new Lottery(
            owner,
            title,
            description,
            raiseUntil,
            ticketPrice
        );
        lotteries.push(newProject);
        emit ProjectStarted(
            address(newProject),
            owner,
            title,
            description,
            raiseUntil,
            ticketPrice
        );
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
    address public winner;

    enum State {
        Open,
        Closed,
        Suspended
    }

    // Modifier to check if the function caller is the project creator
    modifier isCreator() {
        require(msg.sender == creator);
        _;
    }

    event Transfer(address indexed _from, uint256 _value);

    constructor(
        address payable projectStarter,
        string memory projectTitle,
        string memory projectDesc,
        uint256 deadlineTime,
        uint256 projectTicketPrice
    ) public {
        creator = projectStarter;
        title = projectTitle;
        description = projectDesc;
        priceTicket = projectTicketPrice;
        deadline = deadlineTime;
        currentBalance = 0;
        created = block.timestamp;
    }

    function buyTicket(uint256 overralPrice) public payable {
        require(block.timestamp < deadline); // in the fundraising period
        require(overralPrice > 0);

        contributors[msg.sender] = contributors[msg.sender].add(overralPrice);
        currentBalance = currentBalance.add(overralPrice);

        players.push(msg.sender);
        emit Transfer(msg.sender, overralPrice);
        isLotteryOpen();
    }

    /** @dev Function to change the project state depending on conditions.
     */
    function isLotteryOpen() public {
        if (block.timestamp > deadline) {
            state = State.Closed;
        } else {
            state = State.Open;
        }
    }

    function getOwner() public view returns (address) {
        return creator;
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            );
    }

    function pickWinner() public payable restricted {
        require(block.timestamp > deadline);

        uint256 index = random() % players.length;
        winner = players[index];
        payable(winner).transfer(address(this).balance);
        players = new address[](0);
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

    function getCurrentState() public view returns (State) {
        if (block.timestamp > deadline) {
            return State.Closed;
        } else {
            return State.Open;
        }
    }

    /** @dev Function to get specific information about the project.
     * @return projectStarter Returns all the project's details
     */
    function getDetails()
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
            address lotteryWinner,
            uint256 lotteryPlayersLength,
            uint256 lotteryDateCreated
        )
    {
        projectStarter = creator;
        projectTitle = title;
        projectDesc = description;
        deadlineTime = deadline;
        currentState = state;
        currentAmount = currentBalance;
        ticketPrice = priceTicket;
        lotteryWinner = winner;
        lotteryPlayersLength = playersLength;
        lotteryDateCreated = created;
    }
}
