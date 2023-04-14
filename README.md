# dAPI Payments Guide

> A simple dApp to accept ERC20 token payments and mint an NFT receipt with the USD value to the user.

## Installation

```bash
$ git clone https://github.com/vanshwassan/dAPI-payments.git
```

- To install all the packages:

```bash
$ yarn
```

- Make `credentials.json` and add your mnemonic for the network/s you will work with. This wallet needs to be funded to cover the gas costs to deploy the contracts.

```bash
$ cp credentials.example.json credentials.json
```

## Deploying the Contracts

To compile and deploy the contracts:

```bash
$ yarn compile
```

```bash
$ yarn deploy
```

This will deploy the Mock WETH and Mock WMATIC Contracts alongside the Payments Contract. It will also set the dAPI proxy contract addresses mapped to their respective ERC20 tokens. Make sure to update them in the `deploy/3_deploy_Payments.js`.

Import the mock token contract addresses in your Metamask account.

## Using the Contract

- To send a payment (2.5 Mock WETH and 2.5 Mock WMATIC). To edit these values, check `scripts/sendPayment.js`.

    This also mints an NFT as a receipt for the payment(PRT Token). 


```bash
$ yarn sendPayment
```

- To check the receipt for the payment, use the NFT's tokenId. This returns the USD Evalue of how much the user paid:

```bash
$ yarn checkReceipt
```

- To check the USD value of all the funds that the contract holds:

```bash
$ yarn checkContractBalance
```

To withdraw all the Contract funds (`onlyOwner`):

```bash
$ yarn withdraw
```

**You can also use the frontend to access the same functionality.**

```bash
cd frontend
```

```
yarn start
```