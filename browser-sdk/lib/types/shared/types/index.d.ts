export interface FetchItemsRequest<T> {
    page?: number;
    pageSize?: number;
    sortBy?: keyof T;
    sortOrder?: 'asc' | 'desc';
}
export interface FetchItemsResponse<T> {
    items: T[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
}
export declare enum TokenType {
    NATIVE = 0,
    ERC20 = 1,
    ERC721 = 2,
    ERC1155 = 3
}
export declare enum TransactionStatus {
    ReadyToClaim = 0,
    Processing = 1,
    Completed = 2,
    Rejected = 3,
    NeedToClaim = 4
}
export declare enum WithdrawalsStatus {
    Requested = "requested",
    Relayed = "relayed",
    Success = "success",
    NeedClaim = "needClaim",
    Failed = "failed"
}
export interface ContractWithdrawal {
    recipient: `0x${string}`;
    tokenIndex: number;
    amount: string | bigint;
    nullifier: `0x${string}`;
}
export declare enum TransactionType {
    Mining = "Mining",
    Deposit = "Deposit",
    Withdraw = "Withdraw",
    Send = "Send",
    Receive = "Receive"
}
export interface Token {
    contractAddress: string;
    decimals?: number;
    image?: string;
    price: number;
    symbol?: string;
    tokenIndex: number;
    tokenType: TokenType;
}
export interface TokenBalancesResponse {
    balances: TokenBalance[];
}
export interface TokenBalance {
    token: Token;
    amount: bigint;
}
export type SignMessageResponse = [string, string, string, string];
export interface Transaction {
    uuid: string;
    amount: string;
    from: string;
    to: string;
    status: TransactionStatus;
    timestamp: number;
    transfers: Transfer[];
    tokenType?: TokenType;
    tokenIndex: number;
    txType: TransactionType;
    tokenAddress?: string;
}
export type FetchTransactionsRequest = FetchItemsRequest<Transaction>;
export type FetchTransactionsResponse = FetchItemsResponse<Transaction>;
export interface BroadcastTransactionRequest {
    address: string;
    amount: number;
    token: Token;
}
export interface BroadcastTransactionResponse extends TransactionResult {
}
export interface TransactionResult {
    txTreeRoot: string;
    transferData: TransferData[];
    withdrawalData: TransferData[];
    transferUUIDs: string[];
    withdrawalUUIDs: string[];
}
export interface TransferData {
    sender: string;
    transfer: Transfer;
}
export interface Transfer {
    recipient: string;
    tokenIndex: number;
    amount: string;
    salt: string;
    to?: string;
    isWithdrawal?: boolean;
    nullifier?: string;
}
export interface WaitForTransactionConfirmationRequest {
    txTreeRoot: string;
    pollingInterval?: number;
    retryCount?: number;
    retryDelay?: number;
    timeout?: number;
}
export interface WaitForTransactionConfirmationResponse {
    status: 'not_found' | 'success' | 'confirmed';
    blockNumber: number | null;
}
export interface PrepareDepositTransactionRequest {
    token: Token;
    amount: number;
    address: string;
}
export interface PrepareEstimateDepositTransactionRequest extends PrepareDepositTransactionRequest {
    isGasEstimation: boolean;
}
export interface PrepareDepositTransactionResponse {
    txHash: `0x${string}`;
    status: TransactionStatus;
}
export type FetchWithdrawalsResponse = Record<WithdrawalsStatus, ContractWithdrawal[]>;
export type FetchWithdrawalsRequest = {
    pubkey: string;
    signature: [string, string, string, string];
};
export interface ClaimWithdrawalTransactionResponse {
    txHash: `0x${string}`;
    status: TransactionStatus;
}
export interface WithdrawalResponse extends TransactionResult {
}
export interface WithdrawRequest {
    address: `0x${string}`;
    token: Token;
    amount: number;
}
export interface LoginResponse {
    address: string;
    isLoggedIn: boolean;
}
export type IntMaxEnvironment = 'testnet' | 'mainnet' | 'devnet';
export interface ConstructorParams {
    environment: IntMaxEnvironment;
    async_params?: ArrayBuffer;
}
export interface ConstructorNodeParams extends ConstructorParams {
    eth_private_key: `0x${string}`;
    l1_rpc_url?: string;
}
export interface INTMAXClient {
    tokenBalances: TokenBalance[] | undefined;
    address: string;
    isLoggedIn: boolean;
    fetchTokenBalances: () => Promise<TokenBalancesResponse>;
    getPrivateKey: () => Promise<string | undefined>;
    signMessage: (data: string) => Promise<SignMessageResponse>;
    fetchTransactions: (params: FetchTransactionsRequest) => Promise<Transaction[]>;
    broadcastTransaction: (rawTransfers: BroadcastTransactionRequest[], isWithdrawal: boolean) => Promise<BroadcastTransactionResponse>;
    waitForTransactionConfirmation: (params: WaitForTransactionConfirmationRequest) => Promise<WaitForTransactionConfirmationResponse>;
    deposit: (params: PrepareDepositTransactionRequest) => Promise<PrepareDepositTransactionResponse>;
    fetchDeposits: (params: FetchTransactionsRequest) => Promise<(Transaction | null)[]>;
    fetchPendingWithdrawals: (params: FetchWithdrawalsRequest) => Promise<FetchWithdrawalsResponse>;
    withdraw: (params: WithdrawRequest) => Promise<WithdrawalResponse>;
    claimWithdrawal: (params: ContractWithdrawal[]) => Promise<ClaimWithdrawalTransactionResponse>;
    login: () => Promise<LoginResponse>;
    logout: () => Promise<void>;
    getTokensList: () => Promise<Token[]>;
}
export interface PaginatedResponse<T> {
    items: T[];
    nextCursor: null | string;
    total: number;
}
export interface SDKUrls {
    balance_prover_url: string;
    block_builder_url: string;
    block_validity_prover_url: string;
    store_vault_server_url: string;
    withdrawal_aggregator_url: string;
    key_vault_url: string;
    rpc_url_l1: string;
    chain_id_l1: number;
    liquidity_contract: string;
    rpc_url_l2: string;
    chain_id_l2: number;
    rollup_contract: string;
    rollup_contract_deployed_block_number: number;
    tokens_url: string;
}
export interface MetadataItem {
    uuid: string;
    timestamp: string;
    blockNumber: string;
}
export type EncryptedDataItem = [MetadataItem, Uint8Array];
export interface RawTransaction {
    uuid: string;
    txType: TransactionType;
    timestamp: number;
    data: Uint8Array;
}
export interface WithdrawalRequestItem {
    status: WithdrawalsStatus;
    contractWithdrawal: ContractWithdrawal;
}
export interface WithdrawalsInfoResponse {
    withdrawalInfo: WithdrawalRequestItem[];
}
export interface IntMaxTxBroadcast {
    pubkey: string;
    amountInDecimals: bigint | number;
    tokenIndex: number;
    token_type?: TokenType;
    token_address?: `0x${string}`;
}
