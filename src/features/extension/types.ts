export enum SupportedWallet {
  KEPLR = 'KEPLR',
  EMERIS = 'EMERIS',
}

export type UnsubscribeableListener = (callback?: (...params: any[]) => void) => () => void;
export type NestedMap = Record<string, string | Record<string, unknown>>;

//  map of wallet features that must be supplied to the app to work
export type WalletFeatureMap = {
  enable: string;
  getAccount: string;
  getOfflineSigner: string;
  subscribe: {
    accountChange: UnsubscribeableListener;
  };
};

export interface WalletSession {
  timestamp: number;
  wallet: SupportedWallet;
}

export enum WalletMethods {
  enable = 'enable',
  getAccount = 'getAccount',
  getOfflineSigner = 'getOfflineSigner',
  subscribeAccountChange = 'subscribe.accountChange',
}

export interface WalletData {
  featureMap?: WalletFeatureMap;
}

export default class WalletError extends Error {
  constructor(wallet: string, description: string) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = wallet;
  }
}
