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
  npm install intmax-server-sdk
```
or
```bash 
  pnpm install intmax-server-sdk
```
or
```bash 
  yarn add intmax-server-sdk
```


## Interface

```ts
export interface INTMAXClient {
  // properties
  tokenBalances: TokenBalance[] | undefined;
  address: string; // IntMax public_key
  isLoggedIn: boolean;

  // account
  fetchTokenBalances: () => Promise<TokenBalancesResponse>;
  getPrivateKey: () => Promise<string | undefined>;
  signMessage: (data: string) => Promise<SignMessageResponse>;

  // transaction
  fetchTransactions: (params: FetchTransactionsRequest) => Promise<Transaction[]>;
  broadcastTransaction: (
    rawTransfers: BroadcastTransactionRequest[],
    isWithdrawal: boolean,
  ) => Promise<BroadcastTransactionResponse>;
  waitForTransactionConfirmation: (
    params: WaitForTransactionConfirmationRequest,
  ) => Promise<WaitForTransactionConfirmationResponse>;

  // deposit
  deposit: (params: PrepareDepositTransactionRequest) => Promise<PrepareDepositTransactionResponse>;
  fetchDeposits: (params: FetchTransactionsRequest) => Promise<(Transaction | null)[]>;

  // withdrawal
  fetchPendingWithdrawals: (params: FetchWithdrawalsRequest) => Promise<FetchWithdrawalsResponse>;
  withdraw: (params: WithdrawRequest) => Promise<WithdrawalResponse>;
  claimWithdrawal: (params: ContractWithdrawal[]) => Promise<ClaimWithdrawalTransactionResponse>;

  // additional services
  login: () => Promise<LoginResponse>;
  logout: () => Promise<void>;
  getTokensList: () => Promise<Token[]>;
}

```


## Usage for browser

### Initialization
```javascript
import { IntmaxClient } from 'intmax-client-sdk';

const intmaxClient = IntmaxClient.init({
    environment: 'testnet', //  'mainnet' | 'devnet' | 'testnet' 
}) 
```

## Usage for Node.js

### Initialization
```javascript
const { IntmaxNodeClient } = require('intmax-server-sdk');


const intMaxClient = new IntMaxNodeClient({
  environment: 'devnet',  //  'mainnet' | 'devnet' | 'testnet'
  eth_private_key: process.env.ETH_PRIVATE_KEY,
  l1_rpc_url: process.env.L1_RPC_URL, // better to paste your own rpc url, by default it will be use public RPC.
});
````


## Usage for both

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
    const { balances } = await intmaxClient.fetchTokenBalances(); // fetch token balances
    
    // You can change filtration by tokenIndex or tokenAddress
    const token = balances.find((b) => b.token.tokenIndex === 0).token;

    // Withdraw
    const withdraw = await intmaxClient.withdraw({
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

### Fetch withdrawals (needToClaim, etc.)

```javascript
    const withdrawals = await intmaxClient.fetchPendingWithdrawals(); // Record<WithdrawalsStatus, ContractWithdrawal[]>
```

### Claim withdrawals
```javascript
    const withdrawals = await intmaxClient.fetchPendingWithdrawals(); // Record<WithdrawalsStatus, ContractWithdrawal[]>
    const claim = await intmaxClient.claimWithdrawal(withdrawals.needClaim); // Claim response (should be add additional check for receiver address you can claim withdrawals only for your address)
    // {
    //   txHash: `0x${string}`;
    //   status: TransactionStatus;
    // }
```

### Logout
```javascript
    await intmaxClient.logout();
```



