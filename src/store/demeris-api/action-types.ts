import * as API from '@/types/api';
export enum DemerisActionTypes {
  // Cross-chain endpoint actions
  GET_BALANCES = 'GET_BALANCES',
  GET_POOL_BALANCES = 'GET_POOL_BALANCES',
  GET_STAKING_BALANCES = 'GET_STAKING_BALANCES',
  GET_UNBONDING_DELEGATIONS = 'GET_UNBONDING_DELEGATIONS',
  GET_ALL_BALANCES = 'GET_ALL_BALANCES',
  GET_ALL_STAKING_BALANCES = 'GET_ALL_STAKING_BALANCES',
  GET_ALL_UNBONDING_DELEGATIONS = 'GET_ALL_UNBONDING_DELEGATIONS',
  GET_NUMBERS = 'GET_NUMBERS',
  GET_NUMBERS_CHAIN = 'GET_NUMBERS_CHAIN',
  GET_ALL_NUMBERS = 'GET_ALL_NUMBERS',
  GET_FEE_ADDRESSES = 'GET_FEE_ADDRESSES',
  GET_VERIFIED_DENOMS = 'GET_VERIFIED_DENOMS',
  GET_CHAINS = 'GET_CHAINS',
  GET_PRICES = 'GET_PRICES',
  GET_TX_STATUS = 'GET_TX_STATUS',
  GET_TX_DEST_HASH = 'GET_TX_DEST_HASH',
  GET_END_BLOCK_EVENTS = 'GET_END_BLOCK_EVENTS',
  VALIDATE_POOLS = 'VALIDATE_POOLS',
  // Chain-specific endpoint actions
  GET_VERIFY_TRACE = 'GET_VERIFY_TRACE',
  GET_FEE_ADDRESS = 'GET_FEE_ADDRESS',
  GET_BECH32_CONFIG = 'GET_BECH32_CONFIG',
  GET_CHAIN = 'GET_CHAIN',
  GET_PRIMARY_CHANNEL = 'GET_PRIMARY_CHANNEL',
  GET_PRIMARY_CHANNELS = 'GET_PRIMARY_CHANNELS',
  GET_TOKEN_PRICES = 'GET_TOKEN_PRICES',
  RESET_TOKEN_PRICES = 'RESET_TOKEN_PRICES',
  GET_TOKEN_ID = 'GET_TOKEN_ID',
  GET_CHAIN_STATUS = 'GET_CHAIN_STATUS',
  GET_RELAYER_STATUS = 'GET_RELAYER_STATUS',
  GET_RELAYER_BALANCES = 'GET_RELAYER_BALANCES',
  GET_TXS = 'GET_TXS',
  GET_VALIDATORS = 'GET_VALIDATORS',
  GET_INFLATION = 'GET_INFLATION',
  GET_STAKING_REWARDS = 'GET_STAKING_REWARDS',
  // Internal module actions
  INIT = 'INIT',
  RESET_STATE = 'RESET_STATE',
  SIGN_OUT = 'SIGN_OUT',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
  STORE_UPDATE = 'STORE_UPDATE',
  TRACE_TX_RESPONSE = 'TRACE_TX_RESPONSE',
}
export enum GlobalDemerisActionTypes {
  // Cross-chain endpoint actions
  GET_BALANCES = 'demerisAPI/GET_BALANCES',
  GET_POOL_BALANCES = 'demerisAPI/GET_POOL_BALANCES',
  GET_STAKING_BALANCES = 'demerisAPI/GET_STAKING_BALANCES',
  GET_UNBONDING_DELEGATIONS = 'demerisAPI/GET_UNBONDING_DELEGATIONS',
  GET_ALL_BALANCES = 'demerisAPI/GET_ALL_BALANCES',
  GET_ALL_STAKING_BALANCES = 'demerisAPI/GET_ALL_STAKING_BALANCES',
  GET_ALL_UNBONDING_DELEGATIONS = 'demerisAPI/GET_ALL_UNBONDING_DELEGATIONS',
  GET_NUMBERS = 'demerisAPI/GET_NUMBERS',
  GET_NUMBERS_CHAIN = 'demerisAPI/GET_NUMBERS_CHAIN',
  GET_ALL_NUMBERS = 'demerisAPI/GET_ALL_NUMBERS',
  GET_FEE_ADDRESSES = 'demerisAPI/GET_FEE_ADDRESSES',
  GET_VERIFIED_DENOMS = 'demerisAPI/GET_VERIFIED_DENOMS',
  GET_CHAINS = 'demerisAPI/GET_CHAINS',
  GET_PRICES = 'demerisAPI/GET_PRICES',
  GET_TX_STATUS = 'demerisAPI/GET_TX_STATUS',
  GET_TX_DEST_HASH = 'demerisAPI/GET_TX_DEST_HASH',
  GET_END_BLOCK_EVENTS = 'demerisAPI/GET_END_BLOCK_EVENTS',
  VALIDATE_POOLS = 'demerisAPI/VALIDATE_POOLS',
  GET_VERIFY_TRACE = 'demerisAPI/GET_VERIFY_TRACE',
  GET_FEE_ADDRESS = 'demerisAPI/GET_FEE_ADDRESS',
  GET_BECH32_CONFIG = 'demerisAPI/GET_BECH32_CONFIG',
  GET_CHAIN = 'demerisAPI/GET_CHAIN',
  GET_PRIMARY_CHANNEL = 'demerisAPI/GET_PRIMARY_CHANNEL',
  GET_PRIMARY_CHANNELS = 'demerisAPI/GET_PRIMARY_CHANNELS',
  GET_TOKEN_PRICES = 'demerisAPI/GET_TOKEN_PRICES',
  RESET_TOKEN_PRICES = 'demerisAPI/RESET_TOKEN_PRICES',
  GET_TOKEN_ID = 'demerisAPI/GET_TOKEN_ID',
  GET_CHAIN_STATUS = 'demerisAPI/GET_CHAIN_STATUS',
  GET_RELAYER_STATUS = 'demerisAPI/GET_RELAYER_STATUS',
  GET_RELAYER_BALANCES = 'demerisAPI/GET_RELAYER_BALANCES',
  GET_TXS = 'demerisAPI/GET_TXS',
  GET_VALIDATORS = 'demerisAPI/GET_VALIDATORS',
  GET_INFLATION = 'demerisAPI/GET_INFLATION',
  GET_STAKING_REWARDS = 'demerisAPI/GET_STAKING_REWARDS',
  // Internal module actions
  INIT = 'demerisAPI/INIT',
  RESET_STATE = 'demerisAPI/RESET_STATE',
  SIGN_OUT = 'demerisAPI/SIGN_OUT',
  UNSUBSCRIBE = 'demerisAPI/UNSUBSCRIBE',
  STORE_UPDATE = 'demerisAPI/STORE_UPDATE',
  TRACE_TX_RESPONSE = 'demerisAPI/TRACE_TX_RESPONSE',
}
export type DemerisActionParams = {
  subscribe: boolean;
  params?: API.APIRequests;
};
export type DemerisActionsByAddressParams = {
  subscribe: boolean;
  params?: API.AddrReq;
};
export type DemerisActionByTokenPriceParams = {
  subscribe: boolean;
  params?: API.TokenPriceReq;
};
export type DemerisActionByTokenIdParams = {
  subscribe: boolean;
  params?: API.TokenIdReq;
};
export type DemerisActionsByChainAddressParams = {
  subscribe: boolean;
  params?: API.ChainAddrReq;
};
export type DemerisActionsByChainParams = {
  subscribe: boolean;
  params?: API.ChainReq;
};
export type DemerisActionsByTicketParams = {
  subscribe: boolean;
  params?: API.TicketReq;
};
export type DemerisActionsGetTxsParams = {
  txhash: string;
  chain_name: string;
};
export type DemerisActionsTraceParams = {
  subscribe: boolean;
  cache?: boolean;
  params?: API.VerifyTraceReq;
};
export type DemerisSubscriptions = {
  action: Exclude<
    DemerisActionTypes,
    | typeof DemerisActionTypes.INIT
    | typeof DemerisActionTypes.RESET_STATE
    | typeof DemerisActionTypes.UNSUBSCRIBE
    | typeof DemerisActionTypes.STORE_UPDATE
  >;
  payload: Omit<DemerisActionParams, 'subscribe'>;
};
