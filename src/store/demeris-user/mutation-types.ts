import { GasPriceLevel, Pool } from '@/types/actions'
import * as API from '@/types/api'

import { DemerisConfig } from './actions'

export enum DemerisMutationTypes {
  ADD_KEPLR_KEYHASH = 'ADD_KEPLR_KEYHASH',
  SET_KEPLR = 'SET_KEPLR',
  SET_SESSION_DATA = 'SET_SESSION_DATA',
  SET_GAS_LIMIT = 'SET_GAS_LIMIT',
  SET_BALANCES_FIRST_LOAD = 'SET_BALANCES_FIRST_LOAD',
  SET_STAKING_BALANCES_FIRST_LOAD = 'SET_STAKING_BALANCES_FIRST_LOAD',
  SET_PRICES_FIRST_LOAD = 'SET_PRICES_FIRST_LOAD',
  SET_CORRELATION_ID = 'SET_CORRELATION_ID',
  SIGN_OUT = 'SIGN_OUT',
  RESET_STATE = 'RESET_STATE',
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}
export type APIPromise = {
  hash: string
  promise: Promise<void>
}
export type UserData = {
  customSlippage?: boolean
  viewLPAssetPools?: boolean
  viewUnverified?: boolean
  gasPriceLevel?: GasPriceLevel
  hasSeenRedeem?: boolean
  slippagePerc?: number
  isDemoAccount?: boolean
  theme?: string
  updateDT?: number
}
export type UserSession = {
  walletName: string
  walletData: UserData
}
export type DemerisMutationArgs =
  | API.Balances
  | boolean
  | number
  | API.Prices
  | API.FeeAddress
  | API.FeeAddresses
  | API.Bech32Config
  | API.PrimaryChannels
  | API.PrimaryChannel
  | API.StakingBalances
  | API.Numbers
  | API.SeqNumber
  | API.VerifyTrace
  | API.Chains
  | API.Chain
  | API.Ticket
  | API.RelayerBalances
  | API.VerifiedDenoms
  | DemerisConfig
  | KeplrKeyData
  | string
  | Pool[]

export type DemerisMutations = {
  params?: API.APIRequests
  value: DemerisMutationArgs
}
export type KeplrKeyData = {
  name: string
  algo: string
  pubKey: Uint8Array
  address: Uint8Array
  bech32Address: string
  uid?: string
  keyHashes?: string[]
}
