import { CommitOptions, DispatchOptions, Module, Store as VuexStore } from 'vuex';

import { RootState } from '@/store';

import { actions } from './actions';
import { Getters, getters, GlobalGetters } from './getters';
import { mutations } from './mutations';
import type { APIState } from './state';
import { getDefaultState } from './state';

export { APIState };

export type APIStore<S = APIState> = Omit<VuexStore<S>, 'getters' | 'commit' | 'dispatch'> & {
  commit<K, P>(key: K, payload?: P, options?: CommitOptions);
} & {
  dispatch(key: any, payload?: any, options?: DispatchOptions): any;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
};
export type NamespacedAPIStore<S = APIState> = Omit<APIStore<S>, 'getters' | 'dispatch'> & {
  dispatch(key: string, payload?: any, options?: DispatchOptions);
} & {
  getters: {
    [K in keyof GlobalGetters]: ReturnType<GlobalGetters[K]>;
  };
};
export const namespace = 'demerisAPI';

export const module: Module<APIState, RootState> = {
  state: getDefaultState(),
  mutations,
  getters,
  actions,
  namespaced: true,
};

import { GlobalActionTypes } from './action-types';
import { GlobalGetterTypes } from './getter-types';

export { GlobalActionTypes, GlobalGetterTypes };
