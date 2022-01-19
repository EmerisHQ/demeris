import { Pool } from '@/types/actions';
import * as API from '@/types/api';

export type ChainMeta = {
  verifiedTraces?: Record<string, API.VerifyTrace>;
  primaryChannels?: Record<string, API.PrimaryChannel>;
  relayerBalance?: API.RelayerBalance;
  status?: boolean;
};
export type ChainData = API.Chain & ChainMeta;
export type TransactionItem = {
  date: number;
  status: API.Ticket;
  resolve: (value?: unknown | PromiseLike<unknown>) => void;
  reject: (reason?: Error) => void;
  promise: Promise<API.Ticket>;
};
export type State = {
  endpoint: string;
  hub_chain: string;
  balances: Record<string, API.Balances>;
  stakingBalances: Record<string, API.StakingBalances>;
  numbers: Record<string, API.Numbers>;
  chainnumbers: Record<string, Record<string, API.SeqNumber>>;
  verifiedDenoms: API.VerifiedDenoms;
  prices: API.Prices;
  relayer: boolean;
  chains: Record<string, ChainData>;
  transactions: Map<string, TransactionItem>;
  tokenPrices: API.TokenPrices[];
  validPools: Pool[];
  _Subscriptions: Set<string>;
  _InProgess: Map<string, Promise<void>>;
};
export function getDefaultState(): State {
  return {
    endpoint: '',
    hub_chain: 'cosmoshub-4',
    balances: {},
    stakingBalances: {},
    numbers: {},
    chainnumbers: {},
    verifiedDenoms: [],
    validPools: [],
    prices: {
      Fiats: [],
      Tokens: [],
    },
    tokenPrices: [],
    relayer: false,
    chains: {},
    transactions: new Map(),
    _Subscriptions: new Set(),
    _InProgess: new Map(),
  };
}
