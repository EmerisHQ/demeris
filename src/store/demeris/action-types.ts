import * as API from '@/types/api';
export enum DemerisActionTypes {
  // Cross-chain endpoint actions
  GET_BALANCES = 'GET_BALANCES',
  GET_STAKING_BALANCES = 'GET_STAKING_BALANCES',
  GET_VERIFIED_DENOMS = 'GET_VERIFIED_DENOMS',
  GET_PRICES = 'GET_PRICES',
  GET_CHAINS = 'GET_CHAINS',
  // Chain-specific endpoint actions
  GET_VERIFIED_TRACE = 'GET_VERIFIED_TRACE',
  GET_FEE_ADDRESS = 'GET_FEE_ADDRESS',
  GET_FEE_ADDRESSES = 'GET_FEE_ADDRESSES',
  GET_BECH32_CONFIG = 'GET_BECH32_CONFIG',
  GET_FEE = 'GET_FEE',
  GET_FEE_TOKEN = 'GET_FEE_TOKEN',
  GET_CHAIN = 'GET_CHAIN',
  GET_PRIMARY_CHANNEL = 'GET_PRIMARY_CHANNEL',
  GET_CHAIN_STATUS = 'GET_CHAIN_STATUS',
  // Internal module actions
  INIT = 'INIT',
  RESET_STATE = 'RESET_STATE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
  STORE_UPDATE = 'STORE_UPDATE',
}
export type DemerisActionParams = {
  subscribe: boolean;
  params?: API.APIRequests
}
export type DemerisSubscriptions = {
  action: Exclude<DemerisActionTypes, typeof DemerisActionTypes.INIT | typeof DemerisActionTypes.RESET_STATE | typeof DemerisActionTypes.UNSUBSCRIBE | typeof DemerisActionTypes.STORE_UPDATE>
  payload: Omit<DemerisActionParams, "subscribe">
}
