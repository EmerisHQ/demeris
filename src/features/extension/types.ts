export enum SupportedWallets {
  KEPLR = 'KEPLR',
  EMERIS = 'EMERIS',
}

// TODO : maps wallet functionality which will be used in the future.
//  Not for current implementation where only Keplr + Keplr compatible wallets are targeted
export interface WalletFeatureMap {
  sign: string;
  send: string;
  someFeature: string;
}

export interface WalletData {
  isKeplrCompatible: boolean;
  featureMap?: WalletFeatureMap;
}
