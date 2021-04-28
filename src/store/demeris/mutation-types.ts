import * as API from '@/types/api';

export enum DemerisMutationTypes {
  SET_BALANCES = 'SET_BALANCES',
  SET_VERIFIED_PATH = 'SET_VERIFIED_PATH',
  SET_FEE_ADDRESS = 'SET_FEE_ADDRESS',
  SET_FEE = 'SET_FEE',
  SET_FEE_TOKEN = 'SET_FEE_TOKEN',
  SET_STAKING_BALANCES = 'SET_STAKING_BALANCES',
  SET_PRICES = 'SET_PRICES',
  SET_CHAINS = 'SET_CHAINS',
  SET_VERIFIED_DENOMS = 'SET_VERIFIED_DENOMS',
  SET_PRIMARY_CHANNEL = 'SET_PRIMARY_CHANNEL',
  SET_CHAIN_STATUS = 'SET_CHAIN_STATUS',
  RESET_STATE = 'RESET_STATE',
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE'
}
export type DemerisMutationArgs = Array<API.Balance> | API.ChainStatus | API.Fee | API.FeeAddress | API.FeeAddress| API.FeeToken | API.PrimaryChannel | Array<API.StakingBalance> | API.VerifiedPath | Array<API.Price> | Array<API.Chain> | Array<API.VerifiedDenom>;
export type DemerisMutations = {
	params?: API.APIRequests;
	value: DemerisMutationArgs 
}