import { MutationTree } from 'vuex';

import { walletActionHandler } from '@/features/extension/WalletActionHandler';
import { KeplrKeyData, UserData } from '@/types/user';
import { featureRunning } from '@/utils/FeatureManager';

import { ActionTypes } from './action-types';
import { Subscriptions } from './actions';
import { MutationTypes } from './mutation-types';
import { getDefaultState, USERState } from './state';

export type Mutations<S = USERState> = {
  [MutationTypes.ADD_KEPLR_KEYHASH](state: S, payload: string): void;
  [MutationTypes.SET_SESSION_DATA](state: S, payload: UserData): void;
  [MutationTypes.SET_KEPLR](state: S, payload: KeplrKeyData): void;
  [MutationTypes.SET_GAS_LIMIT](state: S, payload: { value: number }): void;
  [MutationTypes.SET_CORRELATION_ID](state: S, payload: string): void;
  [MutationTypes.SET_BALANCES_FIRST_LOAD](state: S, payload: boolean): void;
  [MutationTypes.SET_STAKING_BALANCES_FIRST_LOAD](state: S, payload: boolean): void;
  [MutationTypes.SET_PRICES_FIRST_LOAD](state: S, payload: boolean): void;
  [MutationTypes.SIGN_OUT](state: S): void;
  [MutationTypes.RESET_STATE](state: S): void;
  [MutationTypes.SUBSCRIBE](state: S, subscription: Subscriptions): void;
  [MutationTypes.UNSUBSCRIBE](state: S, subsctiption: Subscriptions): void;
};

export const mutations: MutationTree<USERState> & Mutations = {
  [MutationTypes.ADD_KEPLR_KEYHASH](state: USERState, payload: string) {
    if (state.keplr) state.keplr.keyHashes.push(payload);
  },
  [MutationTypes.SET_SESSION_DATA](state: USERState, payload: UserData) {
    state._Session = { ...state._Session, ...(payload as UserData) };
    if (!state._Session.isDemoAccount) {
      if (featureRunning('USE_EMERIS_EXTENSION'))
        walletActionHandler.setLastSession({
          timestamp: payload.updateDT,
          wallet: walletActionHandler.session.wallet,
        });
      else window.localStorage.setItem('lastEmerisSession', '' + payload.updateDT);
    }
  },
  [MutationTypes.SET_KEPLR](state: USERState, payload: KeplrKeyData) {
    state.keplr = payload;
    state.keplr.keyHashes = [];
  },
  [MutationTypes.SET_BALANCES_FIRST_LOAD](state: USERState, payload: boolean) {
    state.balancesFirstLoad = payload;
  },
  [MutationTypes.SET_PRICES_FIRST_LOAD](state: USERState, payload: boolean) {
    state.pricesFirstLoad = payload;
  },
  [MutationTypes.SET_CORRELATION_ID](state: USERState, payload: string) {
    state.correlationId = payload;
  },
  [MutationTypes.SET_STAKING_BALANCES_FIRST_LOAD](state: USERState, payload: boolean) {
    state.stakingBalancesFirstLoad = payload;
  },
  [MutationTypes.SET_GAS_LIMIT](state: USERState, payload) {
    window.localStorage.setItem('gasLimit', (payload.value as number).toString());
    state.gas_limit = payload.value as number;
  },
  [MutationTypes.SIGN_OUT](state: USERState) {
    for (const sub of state._Subscriptions.values()) {
      const subObj = JSON.parse(sub);
      if (subObj.action == ActionTypes.SET_SESSION_DATA) {
        state._Subscriptions.delete(sub);
      }
    }
    state.keplr = null;
    state._Session = {};
    if (featureRunning('USE_EMERIS_EXTENSION')) {
      walletActionHandler.clearLastSession();
    } else {
      window.localStorage.setItem('lastEmerisSession', '');
    }
  },
  [MutationTypes.RESET_STATE](state: USERState) {
    Object.assign(state, getDefaultState());
  },
  [MutationTypes.SUBSCRIBE](state: USERState, subscription) {
    state._Subscriptions.add(JSON.stringify(subscription));
  },
  [MutationTypes.UNSUBSCRIBE](state: USERState, subscription) {
    state._Subscriptions.delete(JSON.stringify(subscription));
  },
};
