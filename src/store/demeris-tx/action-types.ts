import * as API from '@/types/api'
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
  subscribe: boolean
  params?: API.APIRequests
}
export type DemerisSubscriptions = {
  action: Exclude<DemerisActionTypes, typeof DemerisActionTypes.BROADCAST_TX>
  payload: Omit<DemerisActionParams, 'subscribe'>
}
