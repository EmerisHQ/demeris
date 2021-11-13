import { createStore, Store as VuexStore } from 'vuex';

import { DemerisStore, State as DemerisState, State, store as demeris } from '@/store/demeris';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import {
  DemerisTXStore,
  module as demerisTX,
  namespace as demerisTXNamespace,
  State as DemerisTXState,
} from '@/store/demeris-tx';

import init from './config';

export type RootState = {
  demeris: DemerisState;
  [demerisTXNamespace]: DemerisTXState;
  [key: string]: unknown;
};

export type RootStore<S = State> = DemerisStore<S> & DemerisTXStore<S>;

export type RootStoreType = RootStore<Pick<RootState, 'demeris' | 'demerisTX'>>;

// add all modules to vuex
const initstore = createStore<RootState>({
  modules: {
    // the name in this dictionary reflects the namespace of the store
    demeris,
    [demerisTXNamespace]: demerisTX,
  },
});

// add library modules
init(initstore as RootStoreType);
export const store = initstore as RootStoreType;

store.subscribe((mutation) => {
  if (mutation.type == 'tendermint.liquidity.v1beta1/QUERY' && mutation.payload.query == 'LiquidityPools') {
    store.dispatch(GlobalDemerisActionTypes.VALIDATE_POOLS, mutation.payload.value.pools);
  }
});

export function useStore(): RootStoreType {
  return store as RootStoreType;
}
export function useAllStores(): VuexStore<any> {
  return store as VuexStore<any>;
}
