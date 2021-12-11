import BigNumber from 'bignumber.js';
import { GetterTree } from 'vuex';

import { RootState } from '@/store';
import { GasPriceLevel, Pool } from '@/types/actions';
import * as API from '@/types/api';
import { parseCoins } from '@/utils/basic';
import { chainAddressfromAddress, keyHashfromAddress } from '@/utils/basic';

import { ChainData, State } from './state';

export type Getters = {
  getGasLimit(state: State): number;
  isSignedIn(state: State): boolean;
  getKeyhashes(state: State): string[];
  getKeplrAccountName(state: State): string | null;
  isDemoAccount(state: State): boolean;
  hasSeenReedem(state: State): boolean;
  viewUnverified(state: State): boolean;
  viewLPAssetPools(state: State): boolean;
  allowCustomSlippage(state: State): boolean;
  getSlippagePerc(state: State): number;
  theme(state: State): string;
  getPreferredGasPriceLevel(state: State): GasPriceLevel;
  getOwnAddress(state: State): { (params: API.APIRequests): string | null };
};

export const getters: GetterTree<State, RootState> & Getters = {
  getSlippagePerc: (state) => {
    return state._Session.slippagePerc;
  },
  isDemoAccount: (state) => {
    return state._Session.isDemoAccount;
  },
  hasSeenReedem: (state) => {
    return state._Session.hasSeenRedeem;
  },
  theme: (state) => {
    return state._Session.theme;
  },
  getPreferredGasPriceLevel: (state) => {
    return state._Session.gasPriceLevel;
  },
  allowCustomSlippage: (state) => {
    return state._Session.customSlippage;
  },
  viewUnverified: (state) => {
    return state._Session.viewUnverified;
  },
  viewLPAssetPools: (state) => {
    return state._Session.viewLPAssetPools;
  },
  isSignedIn: (state) => {
    return state.keplr ? true : false;
  },
  getKeplrAccountName: (state) => {
    return state.keplr?.name ?? null;
  },
  getOwnAddress: (state) => (params) => {
    return null;
    // return (
    //   chainAddressfromAddress(
    //     state.chains[(params as API.ChainReq).chain_name].node_info.bech32_config.main_prefix,
    //     state.keplr.bech32Address,
    //   ) ?? null
    // );
  },
  getKeplrAddress: (state) => {
    if (state.keplr) {
      return keyHashfromAddress(state.keplr.bech32Address);
    } else {
      return null;
    }
  },
  getKeyhashes: (state) => {
    if (state.keplr && state.keplr.keyHashes) {
      return state.keplr.keyHashes;
    } else {
      return null;
    }
  },
  getGasLimit: (state) => {
    return state.gas_limit;
  },
};
