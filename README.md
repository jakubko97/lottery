# Smart Contract Lottery

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



