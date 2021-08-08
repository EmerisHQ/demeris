import * as API from '@/types/api';

import { KeplrKeyData, UserData } from './mutation-types';
export type ChainMeta = {
  verifiedTraces?: Record<string, API.VerifyTrace>;
  primaryChannels?: Record<string, API.PrimaryChannel>;
  status?: boolean;
};
export type ChainData = API.Chain & ChainMeta;
export type TransactionItem = {
  date: number;
  status: API.Ticket;
  resolve: (value?: unknown | PromiseLike<unknown>) => void;
  reject: (reason?: Error) => void;
  promise: Promise<string>;
};
export type State = {
  endpoint: string;
  hub_chain: string;
  gas_limit: number;
  balances: Record<string, API.Balances>;
  stakingBalances: Record<string, API.StakingBalances>;
  numbers: Record<string, API.Numbers>;
  chainnumbers: Record<string, Record<string, API.SeqNumber>>;
  verifiedDenoms: API.VerifiedDenoms;
  keplr: KeplrKeyData;
  prices: API.Prices;
  chains: Record<string, ChainData>;
  transactions: Map<string, TransactionItem>;
  _Subscriptions: Set<string>;
  _InProgess: Map<string, Promise<void>>;
  _Session: UserData | Record<string, never>;
};
export function getDefaultState(): State {
  return {
    endpoint: '',
    hub_chain: 'cosmoshub-4',
    gas_limit: 400000,
    balances: {},
    stakingBalances: {},
    numbers: {},
    verifiedDenoms: [],
    keplr: null,
    prices: {
      Fiats: [],
      Tokens: [],
    },
    chains: {},
    transactions: new Map(),
    _Subscriptions: new Set(),
    _InProgess: new Map(),
    _Session: {},
  };
}
