import * as API from '@/types/api';

import { DemerisConfig } from './actions';

export enum DemerisMutationTypes {
  SET_BALANCES = 'SET_BALANCES',
  SET_VERIFY_TRACE = 'SET_VERIFY_TRACE',
  SET_FEE_ADDRESS = 'SET_FEE_ADDRESS',
  SET_BECH32_CONFIG = 'SET_BECH32_CONFIG',
  SET_FEE_ADDRESSES = 'SET_FEE_ADDRESSES',
  SET_FEE = 'SET_FEE',
  SET_FEE_TOKENS = 'SET_FEE_TOKENS',
  SET_STAKING_BALANCES = 'SET_STAKING_BALANCES',
  SET_KEPLR = 'SET_KEPLR',
  SET_NUMBERS = 'SET_NUMBERS',
  SET_PRICES = 'SET_PRICES',
  SET_CHAINS = 'SET_CHAINS',
  SET_CHAIN = 'SET_CHAIN',
  SET_VERIFIED_DENOMS = 'SET_VERIFIED_DENOMS',
  SET_PRIMARY_CHANNEL = 'SET_PRIMARY_CHANNEL',
  SET_PRIMARY_CHANNELS = 'SET_PRIMARY_CHANNELS',
  SET_CHAIN_STATUS = 'SET_CHAIN_STATUS',
  INIT = 'INIT',
  RESET_STATE = 'RESET_STATE',
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}
export type DemerisMutationArgs =
  | API.Balances
  | any // TODO: prices & chain status
  | API.Fee
  | API.FeeAddress
  | API.FeeAddresses
  | API.Bech32Config
  | API.FeeTokens
  | API.PrimaryChannels
  | API.PrimaryChannel
  | API.StakingBalances
  | API.Numbers
  | API.VerifyTrace
  | API.Chains
  | API.Chain
  | API.VerifiedDenoms
  | DemerisConfig
  | KeplrKeyData;

export type DemerisMutations = {
  params?: API.APIRequests;
  value: DemerisMutationArgs;
};
export type KeplrKeyData = {
  name: string;
  algo: string;
  pubKey: Uint8Array;
  address: Uint8Array;
  bech32Address: string;
};
