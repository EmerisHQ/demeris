import { EncodeObject, Registry } from '@cosmjs/proto-signing';
import { SpVuexError } from '@starport/vuex';
import { ActionContext, ActionTree } from 'vuex';

import { GlobalDemerisActionTypes, GlobalDemerisGetterTypes, RootState } from '@/store';
import { GasPriceLevel } from '@/types/actions';
import { Amount } from '@/types/base';
import { event } from '@/utils/analytics';
import { keyHashfromAddress } from '@/utils/basic';
import { addChain } from '@/utils/keplr';

import { DemerisActionTypes, DemerisSubscriptions } from './action-types';
import { demoAccount } from './demo-account';
import { DemerisMutationTypes, UserData } from './mutation-types';
import { ChainData, State } from './state';

type Namespaced<T, N extends string> = {
  [P in keyof T & string as `${N}/${P}`]: T[P];
};
export type DemerisConfig = {
  endpoint: string;
  refreshTime?: number;
  hub_chain?: string;
  gas_limit?: number;
};
export type DemerisTxParams = {
  tx: string;
  chain_name: string;
  address: string;
};
export type DemerisTxResultParams = {
  height: number;
  stepType: string;
};
export type GasFee = {
  amount: Array<Amount>;
  gas: string;
};

export type DemerisSignParams = {
  msgs: Array<EncodeObject>;
  chain_name: string;
  fee: GasFee;
  registry: Registry;
  memo?: string;
};
export type DemerisSessionParams = {
  data: UserData;
};
export type TicketResponse = {
  ticket: string;
};
export interface Actions {
  [DemerisActionTypes.REDEEM_GET_HAS_SEEN]({ commit, getters }: ActionContext<State, RootState>): Promise<boolean>;
  [DemerisActionTypes.REDEEM_SET_HAS_SEEN](
    { commit, getters }: ActionContext<State, RootState>,
    seen: boolean,
  ): Promise<void>;
  [DemerisActionTypes.SET_SESSION_DATA](
    { commit, getters, state }: ActionContext<State, RootState>,
    { data: UserData }: DemerisSessionParams,
  ): Promise<void>;
  [DemerisActionTypes.LOAD_SESSION_DATA](
    { commit, getters }: ActionContext<State, RootState>,
    { walletName, isDemoAccount }: { walletName: string; isDemoAccount: boolean },
  ): Promise<void>;
  [DemerisActionTypes.SIGN_IN]({ commit, getters, dispatch }: ActionContext<State, RootState>): Promise<boolean>;
  [DemerisActionTypes.SIGN_IN_WITH_WATCHER]({
    commit,
    getters,
    dispatch,
  }: ActionContext<State, RootState>): Promise<boolean>;
  // Internal module actions
  [DemerisActionTypes.SET_GAS_LIMIT](
    { commit }: ActionContext<State, RootState>,
    { gasLimit }: { gasLimit: number },
  ): Promise<void>;
  [DemerisActionTypes.SIGN_OUT]({ commit }: ActionContext<State, RootState>): void;
  [DemerisActionTypes.RESET_STATE]({ commit }: ActionContext<State, RootState>): void;
  [DemerisActionTypes.UNSUBSCRIBE](
    { commit }: ActionContext<State, RootState>,
    subscription: DemerisSubscriptions,
  ): void;
  [DemerisActionTypes.STORE_UPDATE]({ state, dispatch }: ActionContext<State, RootState>): void;
}

export type GlobalActions = Namespaced<Actions, 'demerisUSER'>;

export const actions: ActionTree<State, RootState> & Actions = {
  async [DemerisActionTypes.REDEEM_GET_HAS_SEEN]() {
    const redeem = window.localStorage.getItem('redeem');
    return redeem === 'true' ? true : false;
  },
  async [DemerisActionTypes.REDEEM_SET_HAS_SEEN]({}, seen) {
    seen ? window.localStorage.setItem('redeem', 'true') : window.localStorage.setItem('redeem', 'false');
  },
  async [DemerisActionTypes.LOAD_SESSION_DATA]({ commit }, { walletName, isDemoAccount = false }) {
    const data = window.localStorage.getItem(walletName);
    if (data) {
      const newData = { ...JSON.parse(data), updateDT: Date.now() };
      window.localStorage.setItem(walletName, JSON.stringify(newData));
      commit('SET_SESSION_DATA', newData);
    } else {
      const newData = {
        customSlippage: false,
        viewUnverified: false,
        viewLPAssetPools: false,
        gasPriceLevel: GasPriceLevel.AVERAGE,
        hasSeenRedeem: false,
        slippagePerc: 0.1,
        updateDT: Date.now(),
        isDemoAccount,
      };
      window.localStorage.setItem(walletName, JSON.stringify(newData));
      commit('SET_SESSION_DATA', newData);
    }
    commit('SUBSCRIBE', { action: DemerisActionTypes.SET_SESSION_DATA, payload: { data: null } });
  },
  async [DemerisActionTypes.SET_SESSION_DATA]({ commit, getters, state }, { data }: DemerisSessionParams) {
    if (data) {
      window.localStorage.setItem(
        getters['getKeplrAccountName'],
        JSON.stringify({ ...state._Session, ...data, updateDT: Date.now() }),
      );
      commit('SET_SESSION_DATA', { ...data, updateDT: Date.now() });
    } else {
      window.localStorage.setItem(
        getters['getKeplrAccountName'],
        JSON.stringify({ ...state._Session, updateDT: Date.now() }),
      );
      commit('SET_SESSION_DATA', { updateDT: Date.now() });
    }
  },
  async [DemerisActionTypes.SIGN_IN]({ commit, dispatch, rootGetters }) {
    try {
      await dispatch(DemerisActionTypes.SIGN_OUT);

      const chains = rootGetters[GlobalDemerisGetterTypes.API.getChains];
      window.keplr.defaultOptions = { sign: { preferNoSetFee: true, preferNoSetMemo: true } };
      for (const chain in chains) {
        await addChain(chain);
      }
      await window.keplr['enable']((Object.values(chains) as Array<ChainData>).map((x) => x.node_info.chain_id));
      const paths = new Set();
      const toQuery = [];
      for (const chain_name in chains) {
        const chain = chains[chain_name];
        if (paths.has(chain.derivation_path)) {
          continue;
        }
        paths.add(chain.derivation_path);
        toQuery.push(chain);
      }
      const dexchain = rootGetters[GlobalDemerisGetterTypes.API.getChain]({
        chain_name: rootGetters[GlobalDemerisGetterTypes.API.getDexChain],
      });
      await window.keplr.enable(dexchain.node_info.chain_id);
      const key = await window.keplr.getKey(dexchain.node_info.chain_id);
      commit(DemerisMutationTypes.SET_KEPLR, key);
      event('sign_in', { event_label: 'Sign in with Keplr', event_category: 'authentication' });
      await dispatch(DemerisActionTypes.LOAD_SESSION_DATA, { walletName: key.name, isDemoAccount: false });
      for (const chain of toQuery) {
        await window.keplr.enable(chain.node_info.chain_id);
        const otherKey = await window.keplr.getKey(chain.node_info.chain_id);
        commit(DemerisMutationTypes.ADD_KEPLR_KEYHASH, keyHashfromAddress(otherKey.bech32Address));
      }
      dispatch('common/wallet/signIn', { keplr: await window.getOfflineSigner('cosmoshub-4') }, { root: true });

      dispatch(GlobalDemerisActionTypes.API.GET_ALL_BALANCES, { subscribe: true }, { root: true });
      dispatch(
        GlobalDemerisActionTypes.API.GET_ALL_STAKING_BALANCES,
        {
          subscribe: true,
        },
        { root: true },
      );
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  async [DemerisActionTypes.SIGN_IN_WITH_WATCHER]({ commit, dispatch }) {
    try {
      await dispatch(DemerisActionTypes.SIGN_OUT);
      const key = demoAccount;
      commit(DemerisMutationTypes.SET_KEPLR, { ...key });
      for (const hash of key.keyHashes) {
        commit(DemerisMutationTypes.ADD_KEPLR_KEYHASH, hash);
      }
      await dispatch(DemerisActionTypes.LOAD_SESSION_DATA, { walletName: key.name, isDemoAccount: true });
      dispatch('common/wallet/signIn', { keplr: null }, { root: true });
      event('sign_in_demo', { event_label: 'Sign in with Demo Account', event_category: 'authentication' });
      dispatch(GlobalDemerisActionTypes.API.GET_ALL_BALANCES, { subscribe: true }, { root: true });
      dispatch(
        GlobalDemerisActionTypes.API.GET_ALL_STAKING_BALANCES,
        {
          subscribe: true,
        },
        { root: true },
      );
      return true;
    } catch (e) {
      return false;
    }
  },
  async [DemerisActionTypes.SET_GAS_LIMIT]({ commit }, { gasLimit }: { gasLimit: number }) {
    try {
      commit('SET_GAS_LIMIT', { value: gasLimit });
    } catch (e) {
      throw new SpVuexError('Demeris:SetGasLimit', 'Could not set Gas Limit');
    }
  },
  [DemerisActionTypes.RESET_STATE]({ commit }) {
    commit(DemerisMutationTypes.RESET_STATE);
  },
  [DemerisActionTypes.SIGN_OUT]({ commit }) {
    event('sign_out', { event_label: 'Signed out', event_category: 'authentication' });
    commit(DemerisMutationTypes.SIGN_OUT);
  },
  [DemerisActionTypes.STORE_UPDATE]({ state, dispatch }) {
    state._Subscriptions.forEach(async (subscription_json) => {
      const subscription = JSON.parse(subscription_json);
      try {
        await dispatch(subscription.action, subscription.payload);
      } catch (e) {
        console.error(e);
      }
    });
  },
  [DemerisActionTypes.UNSUBSCRIBE]({ commit }, subscription) {
    commit('UNSUBSCRIBE', subscription);
  },
};