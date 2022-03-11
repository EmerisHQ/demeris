import { EmerisAirdrops, EmerisAPI } from '@emeris/types';

import { Pool } from '@/types/actions';
import * as API from '@/types/api';
import { ChartPrices, LoadingState } from '@/types/util';

export type ChainMeta = {
  primaryChannels?: Record<string, API.PrimaryChannel>;
  relayerBalance?: API.RelayerBalance;
  status?: boolean;
};
export type ChainData = API.Chain & ChainMeta;
export type TransactionItem = {
  date: number;
  status: EmerisAPI.TicketResponse;
  resolve: (value?: unknown | PromiseLike<unknown>) => void;
  reject: (reason?: Error) => void;
  promise: Promise<EmerisAPI.TicketResponse>;
};
export type APIState = {
  endpoint: string;
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
  tokenId: string;
  tokenIdLoadingStatus: LoadingState;
  validPools: Pool[];
  airdrops: EmerisAirdrops.Airdrop[];
  selectedAirdrop: EmerisAirdrops.Airdrop;
  _Subscriptions: Set<string>;
  _InProgess: Map<string, Promise<void>>;
};
export function getDefaultState(): APIState {
  return {
    endpoint: '',
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
    tokenPricesLoadingStatus: API.LoadingState.INIT,
    tokenId: '',
    tokenIdLoadingStatus: API.LoadingState.INIT,
    relayer: false,
    chains: {},
    airdrops: [],
    selectedAirdrop: null,
    traces: {},
    transactions: new Map(),
    _Subscriptions: new Set(),
    _InProgess: new Map(),
  };
}
