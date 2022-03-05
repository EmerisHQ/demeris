import { CommitOptions, DispatchOptions, Module, Store as VuexStore } from 'vuex';

import { RootState } from '@/store';

import { Actions, actions, GlobalActions } from './actions';
import { Getters, getters, GlobalGetters } from './getters';
import { Mutations, mutations } from './mutations';
import type { State } from './state';
import { getDefaultState } from './state';

export { State };

export type DemerisStore<S = State> = Omit<VuexStore<S>, 'getters' | 'commit' | 'dispatch'> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
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
export type NamespacedDemerisStore<S = State> = Omit<DemerisStore<S>, 'getters' | 'dispatch'> & {
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

export const namespace = 'demerisTX';

export const module: Module<State, RootState> = {
  state: getDefaultState(),
  mutations,
  getters,
  actions,
  namespaced: true,
};

import { GlobalDemerisActionTypes } from './action-types';
import { GlobalGetterTypes } from './getter-types';

export { GlobalDemerisActionTypes, GlobalGetterTypes };
