import { InjectionKey } from 'vue';
import { createStore, Store as VuexStore, useStore as baseUseStore } from 'vuex';

import {
  GlobalActionTypes as GlobalActionTypesAPI,
  module as moduleAPI,
  namespace as namespaceAPI,
} from '@/store/demeris-api';
import { module as moduleTX, namespace as namespaceTX } from '@/store/demeris-tx';
import { module as moduleUSER, namespace as namespaceUSER } from '@/store/demeris-user';

import init from './config';
import { RootState, RootStoreTyped, RootStoreUntyped } from './index';

export const key: InjectionKey<RootStoreUntyped> = Symbol();
// add all modules to vuex
const initstore = createStore<RootState>({
  modules: {
    // the name in this dictionary reflects the namespace of the store
    [namespaceAPI]: moduleAPI,
    [namespaceTX]: moduleTX,
    [namespaceUSER]: moduleUSER,
  },
});

// add library modules
init(initstore as RootStoreTyped);

initstore.subscribe((mutation) => {
  if (mutation.type == 'tendermint.liquidity.v1beta1/QUERY' && mutation.payload.query == 'LiquidityPools') {
    initstore.dispatch(GlobalActionTypesAPI.VALIDATE_POOLS, mutation.payload.value.pools);
  }
});

//Module typed exports
export const store = initstore as VuexStore<any>;
export const typedstore: RootStoreTyped = initstore as RootStoreTyped;

//Composition API exports
export function useStore(): RootStoreUntyped {
  return baseUseStore(key);
}
export function useTypedStore(): RootStoreTyped {
  return baseUseStore(key);
}
