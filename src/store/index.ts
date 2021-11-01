import { CommitOptions, createStore, DispatchOptions, Store as VuexStore } from 'vuex';

import { DemerisStore, State as DemerisState, State, store as demeris } from '@/store/demeris';
import { GlobalActions } from '@/store/demeris/actions';
import { Getters } from '@/store/demeris/getters';
import { Mutations } from '@/store/demeris/mutations';
import {
  DemerisTXStore,
  module as demerisTX,
  namespace as demerisTXNamespace,
  State as DemerisTXState,
} from '@/store/demeris-tx';
import { GlobalActions as GlobalActionsTX } from '@/store/demeris-tx/actions';
import { Getters as GettersTX } from '@/store/demeris-tx/getters';
import { Mutations as MutationsTX } from '@/store/demeris-tx/mutations';

import init from './config';
import { GlobalDemerisActionTypes } from './demeris/action-types';
import { GlobalDemerisActionTypes as GlobalDemerisActionTypesTX } from './demeris-tx/action-types';

export type RootState = {
  demeris: DemerisState;
  [demerisTXNamespace]: DemerisTXState;
  [key: string]: unknown;
};

export type RootStore<S = State> = DemerisStore<S> & DemerisTXStore<S>;

export type RootStoreType = RootStore<Pick<RootState, 'demeris' | 'demerisTX'>>;

// add all modules to vuex
const initstore = createStore({
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
export function useAllStores() {
  return store;
}
