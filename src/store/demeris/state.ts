import * as API from '@/types/api';

import { KeplrKeyData } from './mutation-types';
export type ChainMeta = {
  verifiedTraces?: Record<string, API.VerifyTrace>;
  primaryChannels?: Record<string, API.PrimaryChannel>;
  status?: boolean;
};
export type ChainData = API.Chain & ChainMeta;
export type TransactionItem = {
  date: number;
  resolve: (value?: unknown | PromiseLike<unknown>) => void;
  reject: (reason?: Error) => void;
  promise: Promise<void>;
};
export type State = {
  endpoint: string;
  hub_chain: string;
  balances: Record<string, API.Balances>;
  stakingBalances: Record<string, API.StakingBalances>;
  numbers: Record<string, API.Numbers>;
  verifiedDenoms: API.VerifiedDenoms;
  keplr: KeplrKeyData;
  prices: API.Prices;
  chains: Record<string, ChainData>;
  transactions: Map<string, TransactionItem>;
  _Subscriptions: Set<string>;
};
export function getDefaultState(): State {
  return {
    endpoint: '',
    hub_chain: 'cosmoshub-4',
    balances: {},
    stakingBalances: {},
    numbers: {},
    verifiedDenoms: [],
    keplr: null,
    prices: [],
    chains: {},
    transactions: new Map(),
    _Subscriptions: new Set(),
  };
}
