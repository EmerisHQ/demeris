import { createStore } from 'vuex';

import { DemerisStore, State as DemerisState, store as demeris } from '@/store/demeris';

import init from './config';
import { GlobalDemerisActionTypes } from './demeris/action-types';

export type RootState = {
  demeris: DemerisState;
  [key: string]: unknown;
};
export type Store = DemerisStore<Pick<RootState, 'demeris'>>;
const initstore = createStore({
  modules: {
    demeris,
  },
});
init(initstore as Store);
initstore.subscribe((mutation) => {
  if (mutation.type == 'tendermint.liquidity.v1beta1/QUERY' && mutation.payload.query == 'LiquidityPools') {
    store.dispatch(GlobalDemerisActionTypes.VALIDATE_POOLS, mutation.payload.value.pools);
  }
  if (mutation.type == 'demeris/SET_SWAP_FEES') {
    store.dispatch(GlobalDemerisActionTypes.SET_APY, {
      pool_id: mutation.payload.params.pool_id,
      swapFees: mutation.payload.value,
    });
  }
});
export const store = initstore;

export function useStore(): Store {
  return store as Store;
}
export function useAllStores() {
  return store;
}
