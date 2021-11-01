import { GasPriceLevel, Pool } from '@/types/actions';
import * as API from '@/types/api';

import { DemerisConfig } from './actions';

export enum DemerisMutationTypes {
  RESET_STATE = 'RESET_STATE',
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}
export type APIPromise = {
  hash: string;
  promise: Promise<void>;
};

export type DemerisMutationArgs =
  | API.Balances
  | boolean
  | number
  | API.Prices
  | API.FeeAddress
  | API.FeeAddresses
  | API.Bech32Config
  | API.PrimaryChannels
  | API.PrimaryChannel
  | API.StakingBalances
  | API.Numbers
  | API.SeqNumber
  | API.VerifyTrace
  | API.Chains
  | API.Chain
  | API.Ticket
  | API.RelayerBalances
  | API.VerifiedDenoms
  | DemerisConfig
  | KeplrKeyData
  | string
  | Pool[];

export type DemerisMutations = {
  params?: API.APIRequests;
  value: DemerisMutationArgs;
};
export type KeplrKeyData = {
  name: string;
  algo: string;
  pubKey: Uint8Array;
  address: Uint8Array;
  bech32Address: string;
  uid?: string;
  keyHashes?: string[];
};
