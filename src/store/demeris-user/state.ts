import * as API from '@/types/api';

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
  gas_limit: number;
  keplr: KeplrKeyData;
  _Subscriptions: Set<string>;
  _Session: UserData | Record<string, never>;
};
export function getDefaultState(): State {
  return {
    gas_limit: 500000,
    keplr: null,
    _Subscriptions: new Set(),
    _Session: {},
  };
}
