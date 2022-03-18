import { CommitOptions, DispatchOptions, Module, Store as VuexStore } from 'vuex';

import { RootState } from '@/store';

import { Actions, actions, GlobalActions } from './actions';
import { Getters, getters, GlobalGetters } from './getters';
import { Mutations, mutations } from './mutations';
import type { APIState } from './state';
import { getDefaultState } from './state';

export { APIState };

export type APIStore<S = APIState> = Omit<VuexStore<S>, 'getters' | 'commit' | 'dispatch'> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload?: P,
    options?: CommitOptions,
  ): ReturnType<Mutations[K]>;
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions,
  ): ReturnType<Actions[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
};
export type NamespacedAPIStore<S = APIState> = Omit<APIStore<S>, 'getters' | 'dispatch'> & {
  dispatch<K extends keyof GlobalActions>(
    key: K,
    payload?: Parameters<GlobalActions[K]>[1],
    options?: DispatchOptions,
  ): ReturnType<GlobalActions[K]>;
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
