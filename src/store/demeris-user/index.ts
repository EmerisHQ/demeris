import { CommitOptions, DispatchOptions, Module, Store as VuexStore } from 'vuex';

import { RootState } from '@/store';

import { Actions, actions, GlobalActions } from './actions';
import { Getters, getters, GlobalGetters } from './getters';
import { Mutations, mutations } from './mutations';
import type { USERState } from './state';
import { getDefaultState } from './state';

export { USERState };

export type USERStore<S = USERState> = Omit<VuexStore<S>, 'getters' | 'commit' | 'dispatch'> & {
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
export type NamespacedUSERStore<S = USERState> = Omit<USERStore<S>, 'getters' | 'dispatch'> & {
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

export const namespace = 'demerisUSER';

export const module: Module<USERState, RootState> = {
  state: getDefaultState(),
  mutations,
  getters,
  actions,
  namespaced: true,
};

import { GlobalActionTypes } from './action-types';
import { GlobalGetterTypes } from './getter-types';
export { GlobalActionTypes, GlobalGetterTypes };
