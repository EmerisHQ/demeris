import { createStore } from 'vuex';

import { DemerisStore, State as DemerisState,store as demeris } from '@/store/demeris';

import init from './config';

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
export const store = initstore;

export function useStore(): Store {
  return store as Store;
}
