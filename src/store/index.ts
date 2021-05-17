import { createStore } from 'vuex';
import init from './config'
import { store as demeris, DemerisStore, State as DemerisState } from '@/store/demeris';

export type RootState ={
  demeris: DemerisState;
  [key: string]: unknown;
}
export type Store = DemerisStore<Pick<RootState, 'demeris'>>
const initstore = createStore({  
  modules: {
    demeris
  },
});
init(initstore as Store)
export const store = initstore

export function useStore(): Store {
  return store as Store;
}
