import { EmerisAirdrops, EmerisAPI } from '@emeris/types';

import { Pool } from '@/types/actions';
import { ChartPrices, LoadingState } from '@/types/util';

export type TransactionItem = {
  date: number;
  status: EmerisAPI.TicketResponse;
  resolve: (value?: unknown | PromiseLike<unknown>) => void;
  reject: (reason?: Error) => void;
  promise: Promise<EmerisAPI.TicketResponse>;
};
export type APIState = {
  endpoint: string;
  gitEndpoint: string;
  rawGitEndpoint: string;
  wsEndpoint: string;
  hub_chain: string;
  balances: Record<string, EmerisAPI.Balances>;
  stakingBalances: Record<string, EmerisAPI.StakingBalances>;
  unstakingParams: Record<string, EmerisAPI.StakingParams>;
  unbondingDelegations: Record<string, EmerisAPI.UnbondingDelegations>;
  chainnumbers: Record<string, Record<string, EmerisAPI.SeqNumber>>;
  verifiedDenoms: EmerisAPI.VerifiedDenoms;
  prices: EmerisAPI.Prices;
  relayer: boolean;
  chains: Record<string, EmerisAPI.Chain>;
  traces: Record<string, Record<string, EmerisAPI.VerifyTrace>>;
  transactions: Map<string, TransactionItem>;
  tokenPrices: ChartPrices;
  tokenPricesLoadingStatus: LoadingState;
  validPools: Pool[];
  airdrops: EmerisAirdrops.Airdrop[];
  selectedAirdrop: EmerisAirdrops.Airdrop;
  airdropsStatus: LoadingState;
  _Subscriptions: Set<string>;
  _InProgess: Map<string, Promise<void>>;

  //coingecko
  coinGeckoId: string;
  coinGeckoIdLoadingStatus: LoadingState;
};
export function getDefaultState(): APIState {
  return {
    endpoint: '',
    gitEndpoint: '',
    rawGitEndpoint: '',
    wsEndpoint: '',
    hub_chain: 'cosmoshub-4',
    balances: {},
    stakingBalances: {},
    unstakingParams: {},
    unbondingDelegations: {},
    chainnumbers: {},
    verifiedDenoms: [],
    validPools: null,
    prices: {
      Fiats: [],
      Tokens: [],
    },
    tokenPrices: [],
    tokenPricesLoadingStatus: LoadingState.INIT,
    relayer: false,
    chains: {},
    airdrops: [],
    airdropsStatus: LoadingState.INIT,
    selectedAirdrop: null,
    traces: {},
    transactions: new Map(),
    _Subscriptions: new Set(),
    _InProgess: new Map(),

    //coingecko default state
    coinGeckoId: '',
    coinGeckoIdLoadingStatus: LoadingState.INIT,
  };
}
