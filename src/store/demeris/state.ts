import { Pool } from '@/types/actions';
import * as API from '@/types/api';
import { WalletType } from '@/wallet-manager';
import { Wallet } from '@/wallet-manager/abstractWallet';
import { ImplementedWallet } from '@/wallet-manager/implementations';

import { KeplrKeyData, UserData } from './mutation-types';
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
  relayer: boolean;
  chains: Record<string, ChainData>;
  transactions: Map<string, TransactionItem>;
  validPools: Pool[];
  _Subscriptions: Set<string>;
  _InProgess: Map<string, Promise<void>>;
  _Session: UserData | Record<string, never>;
  _WalletManagers: Record<WalletType, ImplementedWallet> | Record<string, never>;
};
export function getDefaultState(): State {
  return {
    endpoint: '',
    hub_chain: 'cosmoshub-4',
    gas_limit: 500000,
    balances: {},
    stakingBalances: {},
    numbers: {},
    chainnumbers: {},
    verifiedDenoms: [],
    validPools: [],
    keplr: null,
    prices: {
      Fiats: [],
      Tokens: [],
    },
    relayer: false,
    chains: {},
    transactions: new Map(),
    _Subscriptions: new Set(),
    _InProgess: new Map(),
    _Session: {},
    _WalletManagers: {},
  };
}
