import { Pool } from '@/types/actions';
import * as API from '@/types/api';

export type ChainMeta = {
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
  wsEndpoint: string;
  hub_chain: string;
  balances: Record<string, API.Balances>;
  stakingBalances: Record<string, API.StakingBalances>;
  unstakingParams: Record<string, API.UnstakingParam>;
  unbondingDelegations: Record<string, API.UnbondingDelegations>;
  numbers: Record<string, API.Numbers>;
  chainnumbers: Record<string, Record<string, API.SeqNumber>>;
  verifiedDenoms: API.VerifiedDenoms;
  prices: API.Prices;
  relayer: boolean;
  chains: Record<string, ChainData>;
  traces: Record<string, Record<string, API.VerifyTrace>>;
  transactions: Map<string, TransactionItem>;
  tokenPrices: API.TokenPrices[];
  tokenPricesLoadingStatus: API.LoadingState;
  tokenId: string;
  tokenIdLoadingStatus: API.LoadingState;
  validPools: Pool[];
  airdrops: API.Airdrop[];
  selectedAirdrop: API.Airdrop;
  _Subscriptions: Set<string>;
  _InProgess: Map<string, Promise<void>>;
};
export function getDefaultState(): State {
  return {
    endpoint: '',
    wsEndpoint: '',
    hub_chain: 'cosmoshub-4',
    balances: {},
    stakingBalances: {},
    unstakingParams: {},
    unbondingDelegations: {},
    numbers: {},
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
