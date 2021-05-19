import * as API from '@/types/api';
export enum DemerisActionTypes {
  // Cross-chain endpoint actions
  GET_BALANCES = 'GET_BALANCES',
  GET_STAKING_BALANCES = 'GET_STAKING_BALANCES',
  GET_NUMBERS = 'GET_NUMBERS',
  GET_FEE_ADDRESSES = 'GET_FEE_ADDRESSES',
  GET_VERIFIED_DENOMS = 'GET_VERIFIED_DENOMS',
  GET_CHAINS = 'GET_CHAINS',
  GET_PRICES = 'GET_PRICES', //TODO prices
  // Chain-specific endpoint actions
  GET_VERIFY_TRACE = 'GET_VERIFY_TRACE',
  GET_FEE_ADDRESS = 'GET_FEE_ADDRESS',
  GET_BECH32_CONFIG = 'GET_BECH32_CONFIG',
  GET_FEE = 'GET_FEE',
  GET_FEE_TOKENS = 'GET_FEE_TOKENS',
  GET_CHAIN = 'GET_CHAIN',
  GET_PRIMARY_CHANNEL = 'GET_PRIMARY_CHANNEL',
  GET_PRIMARY_CHANNELS = 'GET_PRIMARY_CHANNELS',
  GET_CHAIN_STATUS = 'GET_CHAIN_STATUS', //TODO chain status
  BROADCAST_TX = 'BROADCAST_TX',
  SIGN_WITH_KEPLR = 'SIGN_WITH_KEPLR',
  SIGN_IN = 'SIGN_IN',
  // Internal module actions
  INIT = 'INIT',
  RESET_STATE = 'RESET_STATE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
  STORE_UPDATE = 'STORE_UPDATE',
}
export enum GlobalDemerisActionTypes {
  // Cross-chain endpoint actions
  GET_BALANCES = 'demeris/GET_BALANCES',
  GET_STAKING_BALANCES = 'demeris/GET_STAKING_BALANCES',
  GET_NUMBERS = 'demeris/GET_NUMBERS',
  GET_FEE_ADDRESSES = 'demeris/GET_FEE_ADDRESSES',
  GET_VERIFIED_DENOMS = 'demeris/GET_VERIFIED_DENOMS',
  GET_CHAINS = 'demeris/GET_CHAINS',
  GET_PRICES = 'demeris/GET_PRICES', //TODO prices
  // Chain-specific endpoint actions
  GET_VERIFY_TRACE = 'demeris/GET_VERIFY_TRACE',
  GET_FEE_ADDRESS = 'demeris/GET_FEE_ADDRESS',
  GET_BECH32_CONFIG = 'demeris/GET_BECH32_CONFIG',
  GET_FEE = 'demeris/GET_FEE',
  GET_FEE_TOKENS = 'demeris/GET_FEE_TOKENS',
  GET_CHAIN = 'demeris/GET_CHAIN',
  GET_PRIMARY_CHANNEL = 'demeris/GET_PRIMARY_CHANNEL',
  GET_PRIMARY_CHANNELS = 'demeris/GET_PRIMARY_CHANNELS',
  GET_CHAIN_STATUS = 'demeris/GET_CHAIN_STATUS', //TODO chain status
  BROADCAST_TX = 'demeris/BROADCAST_TX',
  SIGN_WITH_KEPLR = 'demeris/SIGN_WITH_KEPLR',
  SIGN_IN = 'demeris/SIGN_IN',
  // Internal module actions
  INIT = 'demeris/INIT',
  RESET_STATE = 'demeris/RESET_STATE',
  UNSUBSCRIBE = 'demeris/UNSUBSCRIBE',
  STORE_UPDATE = 'demeris/STORE_UPDATE',
}
export type DemerisActionParams = {
  subscribe: boolean;
  params?: API.APIRequests;
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
