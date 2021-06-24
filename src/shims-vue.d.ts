/* eslint-disable */
import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';
import { RootState } from './store/index';
import { Window as KeplrWindow, Keplr } from '@keplr-wallet/types';

declare module '*.vue' {
  import { defineComponent } from 'vue';
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

declare global {
  import { OfflineDirectSigner } from '@cosmjs/proto-signing';

  interface Window extends KeplrWindow {
    Vue: any;
  }
}
declare module '@vue/runtime-core' {
  // Declare your own store states.

  interface ComponentCustomProperties {
    $store: Store<RootState>;
    _depsLoaded: boolean;
  }
}

declare module '*.svg?inline' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
}
