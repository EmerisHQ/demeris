import { EmerisFees } from '@emeris/types';
import { GetterTree } from 'vuex';

import { RootState } from '@/store';
import { KeplrKeyData } from '@/types/user';
import { Namespaced } from '@/types/util';
import { keyHashfromAddress } from '@/utils/basic';

import { GetterTypes } from './getter-types';
import { USERState } from './state';

export type Getters = {
  [GetterTypes.getKeplr](state: USERState): KeplrKeyData;
  [GetterTypes.getGasLimit](state: USERState): number;
  [GetterTypes.isSignedIn](state: USERState): boolean;
  [GetterTypes.getKeyhashes](state: USERState): string[];
  [GetterTypes.getCorrelationId](state: USERState): string;
  [GetterTypes.getKeplrAccountName](state: USERState): string | null;
  [GetterTypes.isDemoAccount](state: USERState): boolean;
  [GetterTypes.hasSeenReedem](state: USERState): boolean;
  [GetterTypes.viewUnverified](state: USERState): boolean;
  [GetterTypes.viewLPAssetPools](state: USERState): boolean;
  [GetterTypes.allowCustomSlippage](state: USERState): boolean;
  [GetterTypes.getSlippagePerc](state: USERState): number;
  [GetterTypes.getKeplrAddress](state): string;
  [GetterTypes.theme](state: USERState): string;
  [GetterTypes.getPreferredGasPriceLevel](state: USERState): EmerisFees.GasPriceLevel;
  [GetterTypes.isAllBalancesLoaded](state: USERState): boolean;
};

export type GlobalGetters = Namespaced<Getters, 'demerisUSER'>;

export const getters: GetterTree<USERState, RootState> & Getters = {
  [GetterTypes.getKeplr]: (state) => {
    return state.keplr ?? null;
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
    return state._Session.customSlippage;
  },
  [GetterTypes.viewUnverified]: (state) => {
    return state._Session.viewUnverified;
  },
  [GetterTypes.viewLPAssetPools]: (state) => {
    return state._Session.viewLPAssetPools;
  },
  [GetterTypes.isSignedIn]: (state) => {
    return state.keplr ? true : false;
  },
  [GetterTypes.getKeplrAccountName]: (state) => {
    return state.keplr?.name ?? null;
  },
  [GetterTypes.getKeplrAddress]: (state) => {
    if (state.keplr) {
      return keyHashfromAddress(state.keplr.bech32Address);
    } else {
      return null;
    }
  },
  [GetterTypes.getKeyhashes]: (state) => {
    if (state.keplr && state.keplr.keyHashes) {
      return state.keplr.keyHashes;
    } else {
      return null;
    }
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
