import * as API from '@/types/api';
import { DemerisSubscriptions } from './action-types';
export type ChainMeta = {
  verifiedTraces?: Record<string, API.VerifyTrace>;
  primaryChannels?: Record<string, API.PrimaryChannel>;
  status?: boolean; // TODO: chain status
};
export type ChainData = API.Chain & ChainMeta;

export type State = {
  balances: Record<string, API.Balances>;
  stakingBalances: Record<string, API.StakingBalances>;
  verifiedDenoms: API.VerifiedDenoms;
  prices: Array<any>; //TODO
  chains: Record<string, ChainData>;
  _Subscriptions: Set<DemerisSubscriptions>;
};
export function getDefaultState(): State {
  return {
    balances: {},
    stakingBalances: {},
    verifiedDenoms: [],
    prices: [],
    chains: {},
    _Subscriptions: new Set(),
  };
}
