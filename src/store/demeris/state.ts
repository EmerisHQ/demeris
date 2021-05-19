import * as API from '@/types/api';

import { DemerisSubscriptions } from './action-types';
export type ChainMeta = {
  verifiedTraces?: Record<string, API.VerifyTrace>;
  primaryChannels?: Record<string, API.PrimaryChannel>;
  status?: boolean; // TODO: chain status
};
export type ChainData = API.Chain & ChainMeta;

export type State = {
  endpoint: string;
  balances: Record<string, API.Balances>;
  stakingBalances: Record<string, API.StakingBalances>;
  numbers: Record<string, API.Numbers>;
  verifiedDenoms: API.VerifiedDenoms;
  prices: Array<any>; //TODO: prices
  chains: Record<string, ChainData>;
  _Subscriptions: Set<DemerisSubscriptions>;
};
export function getDefaultState(): State {
  return {
    endpoint: '',
    balances: {},
    stakingBalances: {},
    numbers: {},
    verifiedDenoms: [],
    prices: [],
    chains: {},
    _Subscriptions: new Set(),
  };
}
