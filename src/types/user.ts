import { EmerisFees } from '@emeris/types';

export type UserData = {
  allowCustomSlippage?: boolean;
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

export type AccountData = {
  name: string;
  uid?: string;
};

export type ChainKeyData = {
  keyHash: string;
  pubKey: Uint8Array;
  algo: string;
  chainName: string;
};
