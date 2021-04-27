import * as API from '@/types/api';
export enum DemerisActionTypes {
  GET_BALANCES = 'GET_BALANCES',
  GET_VERIFIED_PATH = 'GET_VERIFIED_PATH',
  GET_FEE_ADDRESS = 'GET_FEE_ADDRESS',
  GET_FEE = 'GET_FEE',
  GET_FEE_TOKEN = 'GET_FEE_TOKEN',
  GET_STAKING_BALANCES = 'GET_STAKING_BALANCES',
  GET_PRICES = 'GET_PRICES',
  GET_CHAINS = 'GET_CHAINS',
  GET_VERIFIED_DENOMS = 'GET_VERIFIED_DENOMS',
  GET_PRIMARY_CHANNEL = 'GET_PRIMARY_CHANNEL',
  GET_CHAIN_STATUS = 'GET_CHAIN_STATUS',
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
