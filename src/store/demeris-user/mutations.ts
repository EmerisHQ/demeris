import isEqual from 'lodash.isequal';
import { MutationTree } from 'vuex';

import { DemerisActionTypes, DemerisSubscriptions } from './action-types';
import { DemerisMutations, DemerisMutationTypes as MutationTypes, KeplrKeyData, UserData } from './mutation-types';
import { getDefaultState, State } from './state';

export type Mutations<S = State> = {
  [MutationTypes.ADD_KEPLR_KEYHASH](state: S, payload: string): void;
  [MutationTypes.SET_SESSION_DATA](state: S, payload: UserData): void;
  [MutationTypes.SET_KEPLR](state: S, payload: KeplrKeyData): void;
  [MutationTypes.SIGN_OUT](state: S): void;
  [MutationTypes.RESET_STATE](state: S): void;
  [MutationTypes.SUBSCRIBE](state: S, subscription: DemerisSubscriptions): void;
  [MutationTypes.UNSUBSCRIBE](state: S, subsctiption: DemerisSubscriptions): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.ADD_KEPLR_KEYHASH](state: State, payload: string) {
    if (state.keplr) state.keplr.keyHashes.push(payload);
  },
  [MutationTypes.SET_SESSION_DATA](state: State, payload: UserData) {
    if (!isEqual(state._Session, { ...state._Session, ...(payload as UserData) })) {
      state._Session = { ...state._Session, ...(payload as UserData) };
    }
    if (!state._Session.isDemoAccount) {
      window.localStorage.setItem('lastEmerisSession', '' + payload.updateDT);
    }
  },
  [MutationTypes.SET_KEPLR](state: State, payload: KeplrKeyData) {
    state.keplr = payload;
    state.keplr.keyHashes = [];
  },
  [MutationTypes.SET_GAS_LIMIT](state: State, payload: DemerisMutations) {
    window.localStorage.setItem('gasLimit', (payload.value as number).toString());
    if (!isEqual(state.gas_limit, payload.value as number)) {
      state.gas_limit = payload.value as number;
    }
  },
  [MutationTypes.SIGN_OUT](state: State) {
    for (const sub of state._Subscriptions.values()) {
      const subObj = JSON.parse(sub);
      if (subObj.action == DemerisActionTypes.SET_SESSION_DATA) {
        state._Subscriptions.delete(sub);
      }
    }
    state.keplr = null;
    state._Session = {};
    window.localStorage.setItem('lastEmerisSession', '');
  },
  [MutationTypes.RESET_STATE](state: State) {
    Object.assign(state, getDefaultState());
  },
  [MutationTypes.SUBSCRIBE](state: State, subscription) {
    state._Subscriptions.add(JSON.stringify(subscription));
  },
  [MutationTypes.UNSUBSCRIBE](state: State, subscription) {
    state._Subscriptions.delete(JSON.stringify(subscription));
  },
};
