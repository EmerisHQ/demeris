import { EmerisFees } from '@emeris/types';
import { GetterTree } from 'vuex';

import { RootState } from '@/store';
import { Namespaced } from '@/types/util';

import { AccountData } from './../../types/user';
import { GetterTypes } from './getter-types';
import { USERState } from './state';

export type Getters = {
  [GetterTypes.getAccount](state: USERState): AccountData;
  [GetterTypes.getGasLimit](state: USERState): number;
  [GetterTypes.isSignedIn](state: USERState): boolean;
  [GetterTypes.getKeyhashes](state: USERState): string[];
  [GetterTypes.getCorrelationId](state: USERState): string;
  [GetterTypes.isDemoAccount](state: USERState): boolean;
  [GetterTypes.hasSeenReedem](state: USERState): boolean;
  [GetterTypes.viewUnverified](state: USERState): boolean;
  [GetterTypes.viewLPAssetPools](state: USERState): boolean;
  [GetterTypes.allowCustomSlippage](state: USERState): boolean;
  [GetterTypes.getSlippagePerc](state: USERState): number;
  [GetterTypes.theme](state: USERState): string;
  [GetterTypes.getPreferredGasPriceLevel](state: USERState): EmerisFees.GasPriceLevel;
  [GetterTypes.isAllBalancesLoaded](state: USERState): boolean;
};

export type GlobalGetters = Namespaced<Getters, 'demerisUSER'>;

export const getters: GetterTree<USERState, RootState> & Getters = {
  [GetterTypes.getAccount]: (state) => {
    return state.account ?? null;
  },
  [GetterTypes.getSlippagePerc]: (state) => {
    return state._Session.slippagePerc;
  },
  [GetterTypes.isDemoAccount]: (state) => {
    return state._Session.isDemoAccount;
  },
  [GetterTypes.hasSeenReedem]: (state) => {
    return state._Session.hasSeenRedeem;
  },
  [GetterTypes.theme]: (state) => {
    return state._Session.theme;
  },
  [GetterTypes.getPreferredGasPriceLevel]: (state) => {
    return state._Session.gasPriceLevel;
  },
  [GetterTypes.getCorrelationId]: (state) => {
    return state.correlationId;
  },
  [GetterTypes.allowCustomSlippage]: (state) => {
    return state._Session.allowCustomSlippage;
  },
  [GetterTypes.viewUnverified]: (state) => {
    return state._Session.viewUnverified;
  },
  [GetterTypes.viewLPAssetPools]: (state) => {
    return state._Session.viewLPAssetPools;
  },
  [GetterTypes.isSignedIn]: (state) => {
    return state.account ? true : false;
  },
  [GetterTypes.getKeyhashes]: (state) => {
    // dedupe
    return [...new Set(state.chainKeyData.map(({ keyHash }) => keyHash))];
  },
  [GetterTypes.getBalancesFirstLoad]: (state) => {
    return state.balancesFirstLoad;
  },
  [GetterTypes.getStakingBalancesFirstLoad]: (state) => {
    return state.stakingBalancesFirstLoad;
  },
  [GetterTypes.getPricesFirstLoad]: (state) => {
    return state.pricesFirstLoad;
  },
  [GetterTypes.getFirstLoad]: (state) => {
    return state.balancesFirstLoad || state.stakingBalancesFirstLoad || state.pricesFirstLoad;
  },
  [GetterTypes.getGasLimit]: (state) => {
    return state.gas_limit;
  },
  [GetterTypes.isAllBalancesLoaded]: (_, getters, rootState) => {
    const keyHashes = getters[GetterTypes.getKeyhashes] || [];
    if (!keyHashes.length) return false;

    const balances = rootState?.demerisAPI?.balances || [];
    const keys = Object.keys(balances);

    return keyHashes.every((keyhash) => keys.includes(keyhash));
  },
};
