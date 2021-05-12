import * as API from '@/types/api';
export enum DemerisActionTypes {
  // Cross-chain endpoint actions
  GET_BALANCES = 'GET_BALANCES',
  GET_STAKING_BALANCES = 'GET_STAKING_BALANCES',
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
  // Internal module actions
  INIT = 'INIT',
  RESET_STATE = 'RESET_STATE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
  STORE_UPDATE = 'STORE_UPDATE',
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
