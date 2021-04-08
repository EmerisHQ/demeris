import { createStore } from 'vuex';
import init from './config'

export interface NavigatorState {
  [key: string]: unknown
}
const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
});
init(store)
export default store