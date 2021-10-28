import * as API from '@/types/api';
export enum DemerisActionTypes {
  // Cross-chain endpoint actions
  GET_BALANCES = 'GET_BALANCES',
  GET_POOL_BALANCES = 'GET_POOL_BALANCES',
  REDEEM_GET_HAS_SEEN = 'REDEEM_GET_HAS_SEEN',
  REDEEM_SET_HAS_SEEN = 'REDEEM_SET_HAS_SEEN',
  GET_STAKING_BALANCES = 'GET_STAKING_BALANCES',
  GET_ALL_BALANCES = 'GET_ALL_BALANCES',
  GET_ALL_STAKING_BALANCES = 'GET_ALL_STAKING_BALANCES',
  GET_NUMBERS = 'GET_NUMBERS',
  GET_NUMBERS_CHAIN = 'GET_NUMBERS_CHAIN',
  GET_ALL_NUMBERS = 'GET_ALL_NUMBERS',
  GET_FEE_ADDRESSES = 'GET_FEE_ADDRESSES',
  GET_VERIFIED_DENOMS = 'GET_VERIFIED_DENOMS',
  GET_CHAINS = 'GET_CHAINS',
  GET_PRICES = 'GET_PRICES',
  GET_TX_STATUS = 'GET_TX_STATUS',
  SET_SESSION_DATA = 'SET_SESSION_DATA',
  LOAD_SESSION_DATA = 'LOAD_SESSION_DATA',
  GET_END_BLOCK_EVENTS = 'GET_END_BLOCK_EVENTS',
  VALIDATE_POOLS = 'VALIDATE_POOLS',
  // Chain-specific endpoint actions
  GET_VERIFY_TRACE = 'GET_VERIFY_TRACE',
  GET_FEE_ADDRESS = 'GET_FEE_ADDRESS',
  GET_BECH32_CONFIG = 'GET_BECH32_CONFIG',
  GET_CHAIN = 'GET_CHAIN',
  GET_PRIMARY_CHANNEL = 'GET_PRIMARY_CHANNEL',
  GET_PRIMARY_CHANNELS = 'GET_PRIMARY_CHANNELS',
  GET_CHAIN_STATUS = 'GET_CHAIN_STATUS',
  GET_RELAYER_STATUS = 'GET_RELAYER_STATUS',
  GET_RELAYER_BALANCES = 'GET_RELAYER_BALANCES',
  GET_TXS = 'GET_TXS',
  BROADCAST_TX = 'BROADCAST_TX',
  SIGN_WITH_KEPLR = 'SIGN_WITH_KEPLR',
  SIGN_IN = 'SIGN_IN',
  SIGN_IN_WITH_WATCHER = 'SIGN_IN_WITH_WATCHER',
  SET_GAS_LIMIT = 'SET_GAS_LIMIT',
  GET_VALIDATORS = 'GET_VALIDATORS',
  // Internal module actions
  INIT = 'INIT',
  SIGN_OUT = 'SIGN_OUT',
  RESET_STATE = 'RESET_STATE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
  STORE_UPDATE = 'STORE_UPDATE',
}
export enum GlobalDemerisActionTypes {
  // Cross-chain endpoint actions
  GET_BALANCES = 'demeris/GET_BALANCES',
  GET_POOL_BALANCES = 'demeris/GET_POOL_BALANCES',
  REDEEM_GET_HAS_SEEN = 'demeris/REDEEM_GET_HAS_SEEN',
  REDEEM_SET_HAS_SEEN = 'demeris/REDEEM_SET_HAS_SEEN',
  GET_STAKING_BALANCES = 'demeris/GET_STAKING_BALANCES',
  GET_ALL_BALANCES = 'demeris/GET_ALL_BALANCES',
  GET_ALL_STAKING_BALANCES = 'demeris/GET_ALL_STAKING_BALANCES',
  GET_NUMBERS = 'demeris/GET_NUMBERS',
  GET_NUMBERS_CHAIN = 'demeris/GET_NUMBERS_CHAIN',
  GET_ALL_NUMBERS = 'demeris/GET_ALL_NUMBERS',
  GET_FEE_ADDRESSES = 'demeris/GET_FEE_ADDRESSES',
  GET_VERIFIED_DENOMS = 'demeris/GET_VERIFIED_DENOMS',
  GET_CHAINS = 'demeris/GET_CHAINS',
  GET_PRICES = 'demeris/GET_PRICES',
  GET_TX_STATUS = 'demeris/GET_TX_STATUS',
  GET_END_BLOCK_EVENTS = 'demeris/GET_END_BLOCK_EVENTS',
  VALIDATE_POOLS = 'demeris/VALIDATE_POOLS',
  SET_SESSION_DATA = 'demeris/SET_SESSION_DATA',
  LOAD_SESSION_DATA = 'demeris/LOAD_SESSION_DATA',
  // Chain-specific endpoint actions
  GET_VERIFY_TRACE = 'demeris/GET_VERIFY_TRACE',
  GET_FEE_ADDRESS = 'demeris/GET_FEE_ADDRESS',
  GET_BECH32_CONFIG = 'demeris/GET_BECH32_CONFIG',
  GET_CHAIN = 'demeris/GET_CHAIN',
  GET_PRIMARY_CHANNEL = 'demeris/GET_PRIMARY_CHANNEL',
  GET_PRIMARY_CHANNELS = 'demeris/GET_PRIMARY_CHANNELS',
  GET_CHAIN_STATUS = 'demeris/GET_CHAIN_STATUS',
  GET_RELAYER_STATUS = 'demeris/GET_RELAYER_STATUS',
  GET_RELAYER_BALANCES = 'demeris/GET_RELAYER_BALANCES',
  BROADCAST_TX = 'demeris/BROADCAST_TX',
  GET_TXS = 'demeris/GET_TXS',
  SIGN_WITH_KEPLR = 'demeris/SIGN_WITH_KEPLR',
  SIGN_IN = 'demeris/SIGN_IN',
  SIGN_IN_WITH_WATCHER = 'demeris/SIGN_IN_WITH_WATCHER',
  SET_GAS_LIMIT = 'demeris/SET_GAS_LIMIT',
  GET_VALIDATORS = 'demeris/GET_VALIDATORS',
  // Internal module actions
  INIT = 'demeris/INIT',
  SIGN_OUT = 'demeris/SIGN_OUT',
  RESET_STATE = 'demeris/RESET_STATE',
  UNSUBSCRIBE = 'demeris/UNSUBSCRIBE',
  STORE_UPDATE = 'demeris/STORE_UPDATE',
}
export type DemerisActionParams = {
  subscribe: boolean;
  params?: API.APIRequests;
};
export type DemerisActionsByAddressParams = {
  subscribe: boolean;
  params?: API.AddrReq;
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
    | typeof DemerisActionTypes.SIGN_OUT
    | typeof DemerisActionTypes.RESET_STATE
    | typeof DemerisActionTypes.UNSUBSCRIBE
    | typeof DemerisActionTypes.STORE_UPDATE
  >;
  payload: Omit<DemerisActionParams, 'subscribe'>;
};
