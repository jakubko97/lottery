# Smart Contract Lottery

We have designed a smart contract for the lottery portal, where users can create
individual lotteries and others can participate by purchasing "tickets". Upon completion, the
creator has the right to start a draw, where there can be several winners. We used the
Rinkeby Ethereum test network through the Metamask cryptographic wallet. We tested the
individual functions, where we subsequently came to the correct functionality of our
application.

- Developed in Solidity with version ^0.7.0

## Requirements for Development with local testnet
- Install Ganache UI and Metamask extension in browser.
- Import truffle-config.js file to Ganache new workspace.
- Create new RPC network in Metamask with data from Ganache like http link, chain id (5777 if development, 4 if rinkeby testnet)
- Import test accounts with word phase to Metamask RPC test network.
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
truffle compile
```

```
truffle migrate
```

```
npm run serve
```

### Redeployment Local
```
truffle migrate --reset
```

### Redeployment Testnet Rinkeby
```
truffle migrate -f 2 --network rinkeby
```

-f 2 means to migrate migrations/2_deploy_contracts.js

### Testing
```
truffle test
```



