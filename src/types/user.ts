import { EmerisFees } from '@emeris/types';

export type UserData = {
  customSlippage?: boolean;
  viewLPAssetPools?: boolean;
  viewUnverified?: boolean;
  gasPriceLevel?: EmerisFees.GasPriceLevel;
  hasSeenRedeem?: boolean;
  slippagePerc?: number;
  isDemoAccount?: boolean;
  theme?: string;
  updateDT?: number;
};
export type SessionParams = {
  data: UserData;
};
export type UserSession = {
  walletName: string;
  walletData: UserData;
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
