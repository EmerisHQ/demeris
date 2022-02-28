import { GetterTree } from 'vuex';

import { RootState } from '@/store';
import { GasPriceLevel } from '@/types/actions';
import { keyHashfromAddress } from '@/utils/basic';

import { GetterTypes } from './getter-types';

type Namespaced<T, N extends string> = {
  [P in keyof T & string as `${N}/${P}`]: T[P];
};
import { KeplrKeyData } from './mutation-types';
import { State } from './state';

export type Getters = {
  [GetterTypes.getKeplr](state: State): KeplrKeyData;
  [GetterTypes.getGasLimit](state: State): number;
  [GetterTypes.isSignedIn](state: State): boolean;
  [GetterTypes.getKeyhashes](state: State): string[];
  [GetterTypes.getKeplrAccountName](state: State): string | null;
  [GetterTypes.isDemoAccount](state: State): boolean;
  [GetterTypes.hasSeenReedem](state: State): boolean;
  [GetterTypes.viewUnverified](state: State): boolean;
  [GetterTypes.viewLPAssetPools](state: State): boolean;
  [GetterTypes.allowCustomSlippage](state: State): boolean;
  [GetterTypes.getSlippagePerc](state: State): number;
  [GetterTypes.getKeplrAddress](state): string;
  [GetterTypes.theme](state: State): string;
  [GetterTypes.getPreferredGasPriceLevel](state: State): GasPriceLevel;
};

export type GlobalGetters = Namespaced<Getters, 'demerisUSER'>;

export const getters: GetterTree<State, RootState> & Getters = {
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
};
