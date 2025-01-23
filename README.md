# INTMAX-CLIENT-SDK

This SDK is a client library for the INTMAX API. It is designed to help you integrate INTMAX services into your applications.

## Installation for browser

```bash 
  npm install intmax-client-sdk
```
or
```bash 
  pnpm install intmax-client-sdk
```
or
```bash 
  yarn add intmax-client-sdk
```

## Installation for Node.js

```bash 
  npm install intmax-node-sdk
```
or
```bash 
  pnpm install intmax-node-sdk
```
or
```bash 
  yarn add intmax-node-sdk
```


## Usage for browser

### Initialization
```javascript
import { IntmaxClient } from 'intmax-client-sdk';

const intmaxClient = IntmaxClient.init({
    environment: 'testnet', //  'mainnet' | 'devnet' | 'testnet' 
}) 
```

### Login to get wallet
Here you should sign two message, they will be appeared in the popup window automatically.:

1. Sign the message confirm your ETH wallet address.
2. Sign the message with challenge string.


```javascript
    await intmaxClient.login();
    const address = this.intmaxClient.address; // Public key of the wallet
    const privateKey = this.intmaxClient.getPrivateKey(); // Private key of the wallet. Here you should sign message.
```

### Get tokens list
```javascript
    const tokens =  await intmaxClient.getTokensList();
    // tokens: {
    //    contractAddress: string;
    //    decimals?: number;
    //    image?: string;
    //    price: number;
    //    symbol?: string;
    //    tokenIndex: number;
    //    tokenType: TokenType;
    // }[]
```

### Get token balances
```javascript
    const { balances } = await intmaxClient.fetchTokenBalances();
    // balances: {
    //    token: Token; // Check get tokens list response
    //    amount: bigint;
    // }
```

### Deposit Native Token (ETH)
```javascript
    const amount = 0.1; // Amount of the token
    const tokens =  await intmaxClient.getTokensList(); // Get list of the tokens
    let token = tokens.find(token => token.tokenIndex ===0); // Find token by symbol

    if (token) {
      token = {
        ...token,
        tokenType:TokenType.NATIVE
      }
    }

    // Estimate gas
    const gas = await intmaxClient.estimateDepositGas({
        amount,
        token,
        address, // Your public key of the IntMax wallet or any other IntMax wallet public key
        isGasEstimation: true,
    });

    // Deposit
    const deposit = await intmaxClient.deposit({
      amount,
      token,
      address,
    });
    // Deposit response
    // {
    //  txHash: `0x${string}`;
    //  status: TransactionStatus;
    // }

```

### Deposit ERC20
```javascript
    const amount = 0.1; // Amount of the token
    const tokens =  await intmaxClient.getTokensList(); // Get list of the tokens
    let token = tokens.find(token => token.tokenIndex ===0); // Find token by symbol

    if (!token) {
       token = {
         decimals: 18,             // Decimals of the token
         tokenType: TokenType.ERC20,
         contractAddress: '0x....' // Your Token address if not exist on token list
       } 
    }else {
      token = {
        ...token,
        tokenType:TokenType.ERC20
      }
    }

    // Estimate gas if need to show for user
    const gas = await intmaxClient.estimateDepositGas({
        amount,
        token,
        address, // Your public key of the IntMax wallet or any other IntMax wallet public key
        isGasEstimation: true,
    });

    // Deposit
    const deposit = await intmaxClient.deposit({
      amount,
      token,
      address,
    });
    // Deposit response
    // {
    //  txHash: `0x${string}`;
    //  status: TransactionStatus;
    // }
```

### Deposit ERC721 / ERC1155
```javascript
    const amount = 1; // Amount of the token for erc721 should be 1, for erc1155 can be more than 1
    const token = {
      tokenIndex: 1, // Nft id in contract 
      tokenType: TokenType.ERC721, // or TokenType.ERC1155 
      contractAddress: '0x....' // Your Token address if not exist on token list
    } 
    

    // Estimate gas if need to show for user
    const gas = await intmaxClient.estimateDepositGas({
      amount,
      token,
      address, // Your public key of the IntMax wallet or any other IntMax wallet public key
      isGasEstimation: true,
    });

    // Deposit
    const deposit = await intmaxClient.deposit({
      amount,
      token,
      address,
    });
    // Deposit response
    // {
    //  txHash: `0x${string}`;
    //  status: TransactionStatus;
    // }
```

### Withdraw
```javascript
    const amount = 0.1; // Amount of the token, for erc721 should be 1, for erc1155 can be more than 1
    const { balances } = await client.fetchTokenBalances(); // fetch token balances
    
    // You can change filtration by tokenIndex or tokenAddress
    const token = balances.find((b) => b.token.tokenIndex === 0).token;

    // Withdraw
    const withdraw = await client.withdraw({
      amount,
      token,
      address, // Your public key of ETH wallet
    });
    // Withdraw response
    // {
    //   txTreeRoot: string;
    //   transferData: TransferData[];
    //   withdrawalData: TransferData[];
    //   transferUUIDs: string[];
    //   withdrawalUUIDs: string[];
    // }
```
