import * as API from '@/types/api';
export enum DemerisActionTypes {
  RESET_STATE = 'RESET_STATE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
  BROADCAST_TX = 'BROADCAST_TX',
  SIGN_WITH_KEPLR = 'SIGN_WITH_KEPLR',
}
export enum GlobalDemerisActionTypes {
  RESET_STATE = 'demerisTX/RESET_STATE',
  UNSUBSCRIBE = 'demerisTX/UNSUBSCRIBE',
  BROADCAST_TX = 'demerisTX/BROADCAST_TX',
  SIGN_WITH_KEPLR = 'demerisTX/SIGN_WITH_KEPLR',
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
  action: Exclude<DemerisActionTypes, typeof DemerisActionTypes.BROADCAST_TX>;
  payload: Omit<DemerisActionParams, 'subscribe'>;
};
