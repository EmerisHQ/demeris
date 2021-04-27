import { createStore } from 'vuex';
import init from './config'
import { store as demeris, DemerisStore, State as DemerisState } from '@/store/modules/demeris';
export interface RootState {
  demeris: DemerisState
  [key: string]:unknown
}
const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
});
init(store)
export default store
