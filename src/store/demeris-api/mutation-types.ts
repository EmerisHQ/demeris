import { GasPriceLevel, Pool } from '@/types/actions';
import * as API from '@/types/api';

import { DemerisConfig } from './actions';

export enum DemerisMutationTypes {
  SET_BALANCES = 'SET_BALANCES',
  SET_POOL_BALANCES = 'SET_POOL_BALANCES',
  SET_VERIFY_TRACE = 'SET_VERIFY_TRACE',
  SET_FEE_ADDRESS = 'SET_FEE_ADDRESS',
  SET_BECH32_CONFIG = 'SET_BECH32_CONFIG',
  SET_FEE_ADDRESSES = 'SET_FEE_ADDRESSES',
  SET_STAKING_BALANCES = 'SET_STAKING_BALANCES',
  SET_UNBONDING_DELEGATIONS = 'SET_UNBONDING_DELEGATIONS',
  SET_VALID_POOLS = 'SET_VALID_POOLS',
  SET_NUMBERS = 'SET_NUMBERS',
  SET_NUMBERS_CHAIN = 'SET_NUMBERS_CHAIN',
  SET_PRICES = 'SET_PRICES',
  SET_TX_STATUS = 'SET_TX_STATUS',
  SET_CHAINS = 'SET_CHAINS',
  SET_CHAIN = 'SET_CHAIN',
  SET_VERIFIED_DENOMS = 'SET_VERIFIED_DENOMS',
  SET_PRIMARY_CHANNEL = 'SET_PRIMARY_CHANNEL',
  SET_PRIMARY_CHANNELS = 'SET_PRIMARY_CHANNELS',
  SET_TOKEN_PRICES = 'SET_TOKEN_PRICES',
  SET_TOKEN_PRICES_STATUS = 'SET_TOKEN_PRICES_STATUS',
  SET_TOKEN_ID_STATUS = 'SET_TOKEN_ID_STATUS',
  SET_TOKEN_ID = 'SET_TOKEN_ID',
  SET_CHAIN_STATUS = 'SET_CHAIN_STATUS',
  SET_RELAYER_STATUS = 'SET_RELAYER_STATUS',
  SET_RELAYER_BALANCES = 'SET_RELAYER_BALANCES',
  INIT = 'INIT',
  SET_IN_PROGRESS = 'SET_IN_PROGRESS',
  DELETE_IN_PROGRESS = 'DELETE_IN_PROGRESS',
  RESET_STATE = 'RESET_STATE',
  SIGN_OUT = 'SIGN_OUT',
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}
export type APIPromise = {
  hash: string;
  promise: Promise<void>;
};
export type UserData = {
  customSlippage?: boolean;
  viewLPAssetPools?: boolean;
  viewUnverified?: boolean;
  gasPriceLevel?: GasPriceLevel;
  hasSeenRedeem?: boolean;
  slippagePerc?: number;
  isDemoAccount?: boolean;
  theme?: string;
  updateDT?: number;
};
export type UserSession = {
  walletName: string;
  walletData: UserData;
};
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
  | API.TokenPrices
  | API.LoadingState
  | API.TokenId
  | API.StakingBalances
  | API.UnbondingDelegations
  | API.Numbers
  | API.SeqNumber
  | API.VerifyTrace
  | API.Chains
  | API.Chain
  | API.Ticket
  | API.RelayerBalances
  | API.VerifiedDenoms
  | DemerisConfig
  | string
  | Pool[];

export type DemerisMutations = {
  params?: API.APIRequests;
  value: DemerisMutationArgs;
};
