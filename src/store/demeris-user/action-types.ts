import * as API from '@/types/api';
export enum DemerisActionTypes {
  // Cross-chain endpoint actions
  REDEEM_GET_HAS_SEEN = 'REDEEM_GET_HAS_SEEN',
  REDEEM_SET_HAS_SEEN = 'REDEEM_SET_HAS_SEEN',
  SET_SESSION_DATA = 'SET_SESSION_DATA',
  LOAD_SESSION_DATA = 'LOAD_SESSION_DATA',
  SIGN_IN = 'SIGN_IN',
  SIGN_IN_WITH_WATCHER = 'SIGN_IN_WITH_WATCHER',
  SET_GAS_LIMIT = 'SET_GAS_LIMIT',
  SIGN_OUT = 'SIGN_OUT',
  // Internal module actions
  INIT = 'INIT',
  RESET_STATE = 'RESET_STATE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
  STORE_UPDATE = 'STORE_UPDATE',
}
export enum GlobalDemerisActionTypes {
  /**
   * Namespace is defined in the module and should be re-used here. Not possible due to TypeScript limitation,
   * re-evaluate once this is released:
   *     https://github.com/microsoft/TypeScript/issues/40793
   */
  REDEEM_GET_HAS_SEEN = 'demerisUSER/REDEEM_GET_HAS_SEEN',
  REDEEM_SET_HAS_SEEN = 'demerisUSER/REDEEM_SET_HAS_SEEN',
  SET_SESSION_DATA = 'demerisUSER/SET_SESSION_DATA',
  LOAD_SESSION_DATA = 'demerisUSER/LOAD_SESSION_DATA',
  SIGN_IN = 'demerisUSER/SIGN_IN',
  SIGN_IN_WITH_WATCHER = 'demerisUSER/SIGN_IN_WITH_WATCHER',
  SET_GAS_LIMIT = 'demerisUSER/SET_GAS_LIMIT',
  SIGN_OUT = 'demerisUSER/SIGN_OUT',
  // Internal module actions
  RESET_STATE = 'demerisUSER/RESET_STATE',
  UNSUBSCRIBE = 'demerisUSER/UNSUBSCRIBE',
  STORE_UPDATE = 'demerisUSER/STORE_UPDATE',
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
