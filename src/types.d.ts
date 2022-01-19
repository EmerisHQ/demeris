import { Keplr, Window as KeplrWindow } from '@keplr-wallet/types';
import { Store } from 'vuex';

import { RootState } from './store/index';

declare global {
  interface KeplrIntereactionOptions {
    readonly sign?: KeplrSignOptions;
  }

  export interface KeplrSignOptions {
    readonly preferNoSetFee?: boolean;
    readonly preferNoSetMemo?: boolean;
  }
  interface CustomKeplr extends Keplr {
    enable(chainId: string | string[]): Promise<void>;

    defaultOptions: KeplrIntereactionOptions;
  }
  interface Window extends KeplrWindow {
    Vue: any;
    keplr: CustomKeplr;
  }
}
declare module '@vue/runtime-core' {
  // Declare your own store states.

  interface ComponentCustomProperties {
    $store: Store<RootState>;
    _depsLoaded: boolean;
  }
}