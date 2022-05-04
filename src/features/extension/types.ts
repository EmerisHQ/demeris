export enum SupportedWallet {
  KEPLR = 'KEPLR',
  EMERIS = 'EMERIS',
}

type UnsubscribeableListener = (callback: (...params: any[]) => void) => () => void;
export type NestedMap = Record<string, string | Record<string, unknown>>;

//  map of wallet features that must be supplied to the app to work
export type WalletFeatureMap = {
  connect: string;
  getAccount: string;
  getOfflineSigner: string;
  subscribe: {
    accountChange: UnsubscribeableListener;
  };
};

export interface WalletData {
  featureMap?: WalletFeatureMap;
}
