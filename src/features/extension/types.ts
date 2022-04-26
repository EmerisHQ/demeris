export enum SupportedWallets {
  KEPLR = 'keplr',
  EMERIS = 'emeris',
}

// TODO : maps wallet functionality which will be used in the future.
//  Not for current implementation where only Keplr + Keplr compatible wallets are targeted
export interface WalletFeatureMap {
  sign: string;
  send: string;
}

interface WalletData {
  isKeplrCompatible: boolean;
  featureMap?: WalletFeatureMap;
}

export const supportedWalletsData: Record<SupportedWallets, WalletData> = {
  [SupportedWallets.KEPLR]: {
    isKeplrCompatible: true,
  },
  [SupportedWallets.EMERIS]: {
    isKeplrCompatible: true,
  },
};
