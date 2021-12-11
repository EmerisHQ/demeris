import { createStore, Store as VuexStore } from 'vuex';

import { DemerisStore, State as DemerisState, State, store as demeris } from '@/store/demeris';
import { GlobalDemerisActionTypes as GlobalDemerisActionTypes2 } from '@/store/demeris/action-types';
import {
  DemerisStore as DemerisStoreTX,
  GlobalDemerisActionTypes as GlobalDemerisActionTypesTX,
  module as moduleTX,
  namespace as namespaceTX,
  State as StateTX,
} from '@/store/demeris-tx';

import init from './config';

export type RootState = {
  demeris: DemerisState;
  [namespaceTX]: StateTX;
  [key: string]: unknown;
};

export type RootStore<S = State> = DemerisStore<S> & DemerisStoreTX<S>;

export type RootStoreType = RootStore<Pick<RootState, 'demeris' | typeof namespaceTX>>;

// add all modules to vuex
const initstore = createStore<RootState>({
  modules: {
    // the name in this dictionary reflects the namespace of the store
    demeris,
    [namespaceTX]: moduleTX,
  },
});

// add library modules
init(initstore as RootStoreType);
export const store = initstore as RootStoreType;

store.subscribe((mutation) => {
  if (mutation.type == 'tendermint.liquidity.v1beta1/QUERY' && mutation.payload.query == 'LiquidityPools') {
    store.dispatch(GlobalDemerisActionTypes2.VALIDATE_POOLS, mutation.payload.value.pools);
  }
});

export function useStore(): RootStoreType {
  return store as RootStoreType;
}
export function useAllStores(): VuexStore<any> {
  return store as VuexStore<any>;
}

export const GlobalDemerisActionTypes = {
  TX: GlobalDemerisActionTypesTX,
};
