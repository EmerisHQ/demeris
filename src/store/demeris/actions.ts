import { EncodeObject, Registry } from '@cosmjs/proto-signing';
import { SpVuexError } from '@starport/vuex';
import axios from 'axios';
import { ActionContext, ActionTree } from 'vuex';

import { RootState } from '@/store';
import * as API from '@/types/api';
import { Amount } from '@/types/base';
import { keyHashfromAddress } from '@/utils/basic';
import { addChain } from '@/utils/keplr';

import {
  DemerisActionParams,
  DemerisActionsByAddressParams,
  DemerisActionsByChainParams,
  DemerisActionsByTicketParams,
  DemerisActionsTraceParams,
  DemerisActionTypes,
  DemerisSubscriptions,
  GlobalDemerisActionTypes,
} from './action-types';
import DemerisSigningClient from './demerisSigningClient';
import { DemerisMutationTypes } from './mutation-types';
import { ChainData, State } from './state';

export type DemerisConfig = {
  endpoint: string;
  refreshTime?: number;
};
export type DemerisTxParams = {
  tx: string;
  chain_name: string;
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
export type TicketResponse = {
  ticket: string;
};
export interface Actions {
  // Cross-chain endpoint actions
  [DemerisActionTypes.GET_BALANCES](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByAddressParams,
  ): Promise<API.Balances>;
  [DemerisActionTypes.REDEEM_GET_HAS_SEEN]({ commit, getters }: ActionContext<State, RootState>): Promise<boolean>;
  [DemerisActionTypes.REDEEM_SET_HAS_SEEN](
    { commit, getters }: ActionContext<State, RootState>,
    seen: boolean,
  ): Promise<void>;
  [DemerisActionTypes.GET_STAKING_BALANCES](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByAddressParams,
  ): Promise<API.StakingBalances>;
  [DemerisActionTypes.GET_NUMBERS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByAddressParams,
  ): Promise<API.Numbers>;
  [DemerisActionTypes.GET_VERIFIED_DENOMS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionsByAddressParams,
  ): Promise<API.VerifiedDenoms>;
  [DemerisActionTypes.GET_TX_STATUS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionsByTicketParams,
  ): Promise<API.Ticket>;
  [DemerisActionTypes.GET_FEE_ADDRESSES](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionParams,
  ): Promise<API.FeeAddresses>;
  [DemerisActionTypes.GET_CHAINS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionParams,
  ): Promise<Record<string, ChainData>>;
  [DemerisActionTypes.GET_PRICES](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionParams,
  ): Promise<Array<any>>; //TODO prices

  // Chain-specific endpoint actions
  [DemerisActionTypes.GET_VERIFY_TRACE](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsTraceParams,
  ): Promise<API.VerifyTrace>;
  [DemerisActionTypes.GET_FEE_ADDRESS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByChainParams,
  ): Promise<API.FeeAddress>;
  [DemerisActionTypes.GET_BECH32_CONFIG](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByChainParams,
  ): Promise<API.Bech32Config>;
  [DemerisActionTypes.GET_CHAIN](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionsByChainParams,
  ): Promise<API.Chain>;
  [DemerisActionTypes.GET_PRIMARY_CHANNEL](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByChainParams,
  ): Promise<API.PrimaryChannel>;
  [DemerisActionTypes.GET_PRIMARY_CHANNELS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByChainParams,
  ): Promise<API.PrimaryChannels>;
  [DemerisActionTypes.GET_CHAIN_STATUS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByChainParams,
  ): Promise<boolean>;

  [DemerisActionTypes.BROADCAST_TX](
    { commit, getters }: ActionContext<State, RootState>,
    { tx, chain_name }: DemerisTxParams,
  ): Promise<TicketResponse>;
  [DemerisActionTypes.SIGN_WITH_KEPLR](
    { commit, getters }: ActionContext<State, RootState>,
    { msgs, chain_name }: DemerisSignParams,
  ): Promise<DemerisTxParams>;
  [DemerisActionTypes.SIGN_IN]({ commit, getters, dispatch }: ActionContext<State, RootState>): Promise<boolean>;
  // Internal module actions

  [DemerisActionTypes.INIT](
    { commit, dispatch }: ActionContext<State, RootState>,
    { endpoint, refreshTime }: DemerisConfig,
  ): void;
  [DemerisActionTypes.RESET_STATE]({ commit }: ActionContext<State, RootState>): void;
  [DemerisActionTypes.UNSUBSCRIBE](
    { commit }: ActionContext<State, RootState>,
    subscription: DemerisSubscriptions,
  ): void;
  [DemerisActionTypes.STORE_UPDATE]({ state, dispatch }: ActionContext<State, RootState>): void;
}
export interface GlobalActions {
  // Cross-chain endpoint actions
  [GlobalDemerisActionTypes.GET_BALANCES](
    ...args: Parameters<Actions[DemerisActionTypes.GET_BALANCES]>
  ): ReturnType<Actions[DemerisActionTypes.GET_BALANCES]>;
  [GlobalDemerisActionTypes.REDEEM_GET_HAS_SEEN](
    ...args: Parameters<Actions[DemerisActionTypes.REDEEM_GET_HAS_SEEN]>
  ): ReturnType<Actions[DemerisActionTypes.REDEEM_GET_HAS_SEEN]>;
  [GlobalDemerisActionTypes.REDEEM_SET_HAS_SEEN](
    ...args: Parameters<Actions[DemerisActionTypes.REDEEM_SET_HAS_SEEN]>
  ): ReturnType<Actions[DemerisActionTypes.REDEEM_SET_HAS_SEEN]>;
  [GlobalDemerisActionTypes.GET_STAKING_BALANCES](
    ...args: Parameters<Actions[DemerisActionTypes.GET_STAKING_BALANCES]>
  ): ReturnType<Actions[DemerisActionTypes.GET_STAKING_BALANCES]>;
  [GlobalDemerisActionTypes.GET_NUMBERS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_NUMBERS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_NUMBERS]>;
  [GlobalDemerisActionTypes.GET_FEE_ADDRESSES](
    ...args: Parameters<Actions[DemerisActionTypes.GET_FEE_ADDRESSES]>
  ): ReturnType<Actions[DemerisActionTypes.GET_FEE_ADDRESSES]>;
  [GlobalDemerisActionTypes.GET_VERIFIED_DENOMS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_VERIFIED_DENOMS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_VERIFIED_DENOMS]>;
  [GlobalDemerisActionTypes.GET_CHAINS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_CHAINS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_CHAINS]>;
  [GlobalDemerisActionTypes.GET_PRICES](
    ...args: Parameters<Actions[DemerisActionTypes.GET_PRICES]>
  ): ReturnType<Actions[DemerisActionTypes.GET_PRICES]>;
  [GlobalDemerisActionTypes.GET_TX_STATUS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_TX_STATUS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_TX_STATUS]>;
  [GlobalDemerisActionTypes.GET_VERIFY_TRACE](
    ...args: Parameters<Actions[DemerisActionTypes.GET_VERIFY_TRACE]>
  ): ReturnType<Actions[DemerisActionTypes.GET_VERIFY_TRACE]>;
  [GlobalDemerisActionTypes.GET_FEE_ADDRESS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_FEE_ADDRESS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_FEE_ADDRESS]>;
  [GlobalDemerisActionTypes.GET_BECH32_CONFIG](
    ...args: Parameters<Actions[DemerisActionTypes.GET_BECH32_CONFIG]>
  ): ReturnType<Actions[DemerisActionTypes.GET_BECH32_CONFIG]>;
  [GlobalDemerisActionTypes.GET_CHAIN](
    ...args: Parameters<Actions[DemerisActionTypes.GET_CHAIN]>
  ): ReturnType<Actions[DemerisActionTypes.GET_CHAIN]>;
  [GlobalDemerisActionTypes.GET_PRIMARY_CHANNEL](
    ...args: Parameters<Actions[DemerisActionTypes.GET_PRIMARY_CHANNEL]>
  ): ReturnType<Actions[DemerisActionTypes.GET_PRIMARY_CHANNEL]>;
  [GlobalDemerisActionTypes.GET_PRIMARY_CHANNELS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_PRIMARY_CHANNELS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_PRIMARY_CHANNELS]>;
  [GlobalDemerisActionTypes.GET_CHAIN_STATUS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_CHAIN_STATUS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_CHAIN_STATUS]>;
  [GlobalDemerisActionTypes.BROADCAST_TX](
    ...args: Parameters<Actions[DemerisActionTypes.BROADCAST_TX]>
  ): ReturnType<Actions[DemerisActionTypes.BROADCAST_TX]>;
  [GlobalDemerisActionTypes.SIGN_WITH_KEPLR](
    ...args: Parameters<Actions[DemerisActionTypes.SIGN_WITH_KEPLR]>
  ): ReturnType<Actions[DemerisActionTypes.SIGN_WITH_KEPLR]>;
  [GlobalDemerisActionTypes.SIGN_IN](
    ...args: Parameters<Actions[DemerisActionTypes.SIGN_IN]>
  ): ReturnType<Actions[DemerisActionTypes.SIGN_IN]>;
  [GlobalDemerisActionTypes.INIT](
    ...args: Parameters<Actions[DemerisActionTypes.INIT]>
  ): ReturnType<Actions[DemerisActionTypes.INIT]>;
  [GlobalDemerisActionTypes.RESET_STATE](
    ...args: Parameters<Actions[DemerisActionTypes.RESET_STATE]>
  ): ReturnType<Actions[DemerisActionTypes.RESET_STATE]>;
  [GlobalDemerisActionTypes.UNSUBSCRIBE](
    ...args: Parameters<Actions[DemerisActionTypes.UNSUBSCRIBE]>
  ): ReturnType<Actions[DemerisActionTypes.UNSUBSCRIBE]>;
  [GlobalDemerisActionTypes.STORE_UPDATE](
    ...args: Parameters<Actions[DemerisActionTypes.STORE_UPDATE]>
  ): ReturnType<Actions[DemerisActionTypes.STORE_UPDATE]>;
}
export const actions: ActionTree<State, RootState> & Actions = {
  // Cross-chain endpoint actions

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async [DemerisActionTypes.GET_BALANCES]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] + '/account/' + (params as API.AddrReq).address + '/balance',
      );
      commit(DemerisMutationTypes.SET_BALANCES, { params, value: response.data.balances });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_BALANCES, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetBalances', 'Could not perform API query.');
    }
    return getters['getBalances'](JSON.stringify(params));
  },
  async [DemerisActionTypes.REDEEM_GET_HAS_SEEN]() {
    const redeem = window.localStorage.getItem('redeem');
    return redeem === 'true' ? true : false;
  },
  async [DemerisActionTypes.REDEEM_SET_HAS_SEEN]({}, seen) {
    seen ? window.localStorage.setItem('redeem', 'true') : window.localStorage.setItem('redeem', 'false');
  },
  async [DemerisActionTypes.GET_STAKING_BALANCES]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] + '/account/' + (params as API.AddrReq).address + '/stakingbalances',
      );
      commit(DemerisMutationTypes.SET_STAKING_BALANCES, { params, value: response.data.staking_balances });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_STAKING_BALANCES, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetStakingBalances', 'Could not perform API query.');
    }
    return getters['getStakingBalances'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_NUMBERS]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] + '/account/' + (params as API.AddrReq).address + '/numbers',
      );
      commit(DemerisMutationTypes.SET_NUMBERS, { params, value: response.data.numbers });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_NUMBERS, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetNumbers', 'Could not perform API query.');
    }
    return getters['getNumbers'](params);
  },
  async [DemerisActionTypes.GET_VERIFIED_DENOMS]({ commit, getters }, { subscribe = false }) {
    try {
      const response = await axios.get(getters['getEndpoint'] + '/verified_denoms');
      commit(DemerisMutationTypes.SET_VERIFIED_DENOMS, { value: response.data.verified_denoms });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_VERIFIED_DENOMS, payload: {} });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetVerifiedDenoms', 'Could not perform API query.');
    }
    return getters['getVerifiedDenoms'];
  },
  async [DemerisActionTypes.GET_FEE_ADDRESSES]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(getters['getEndpoint'] + '/chains/fee/addresses');
      commit(DemerisMutationTypes.SET_FEE_ADDRESSES, { params, value: response.data.fee_addresses });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_FEE_ADDRESSES, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetFeeAddresses', 'Could not perform API query.');
    }
    return getters['getFeeAddresses'](JSON.stringify(params));
  },
  async [DemerisActionTypes.SIGN_WITH_KEPLR]({ getters, dispatch }, { msgs, chain_name, fee, registry, memo }) {
    try {
      let chain = getters['getChain']({
        chain_name,
      }) as ChainData;
      if (!chain || !chain.node_info) {
        chain = await dispatch(DemerisActionTypes.GET_CHAIN, {
          subscribe: true,
          params: {
            chain_name,
          },
        });
      }
      await addChain(chain_name);

      await window.keplr.enable(chain.node_info.chain_id);
      const offlineSigner = await window.getOfflineSigner(chain.node_info.chain_id);

      const [account] = await offlineSigner.getAccounts();

      const client = new DemerisSigningClient(undefined, offlineSigner, { registry });

      const numbers =
        getters['getNumbers']({ address: keyHashfromAddress(account.address) }) ??
        (await dispatch(DemerisActionTypes.GET_NUMBERS, {
          subscribe: true,
          params: {
            address: keyHashfromAddress(account.address),
          },
        }));
      const signerData = numbers.find((x) => x.chain_name == chain_name);
      const cosmjsSignerData = {
        chainId: chain.node_info.chain_id,
        accountNumber: parseInt(signerData.account_number),
        sequence: parseInt(signerData.sequence_number),
      };

      const tx = await (client as DemerisSigningClient).signWMeta(account.address, msgs, fee, memo, cosmjsSignerData);

      const tx_data = Buffer.from(tx).toString('base64');
      return { tx: tx_data, chain_name };
    } catch (e) {
      console.log(e);
      throw new SpVuexError('Demeris:SignWithKeplr', 'Could not sign TX.');
    }
  },

  async [DemerisActionTypes.SIGN_IN]({ commit, getters, dispatch }) {
    try {
      await window.keplr.enable('cosmoshub-4');
      const key = await window.keplr.getKey('cosmoshub-4');
      commit(DemerisMutationTypes.SET_KEPLR, key);
      dispatch('common/wallet/signIn', { keplr: await window.getOfflineSigner('cosmoshub-4') }, { root: true });
      dispatch(DemerisActionTypes.GET_BALANCES, { subscribe: true, params: { address: getters['getKeplrAddress'] } });
      dispatch(DemerisActionTypes.GET_STAKING_BALANCES, {
        subscribe: true,
        params: { address: getters['getKeplrAddress'] },
      });
      return true;
    } catch (e) {
      return false;
    }
  },
  // TODO Prices query
  async [DemerisActionTypes.GET_PRICES]({ commit, getters }, { subscribe = false }) {
    try {
      const response = await axios.get(getters['getEndpoint'] + '/prices');
      commit(DemerisMutationTypes.SET_PRICES, { value: response.data.prices });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_PRICES, payload: {} });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetPrices', 'Could not perform API query.');
    }
    return getters['getPrices'];
  },
  async [DemerisActionTypes.GET_TX_STATUS]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] +
          '/tx/ticket/' +
          (params as API.TicketReq).chain_name +
          '/' +
          (params as API.TicketReq).ticket,
      );
      commit(DemerisMutationTypes.SET_TX_STATUS, { params, value: response.data });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_TX_STATUS, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetTXStatus', 'Could not perform API query.');
    }
    return getters['getTxStatus'](params);
  },
  async [DemerisActionTypes.GET_CHAINS]({ commit, getters }, { subscribe = false }) {
    try {
      const response = await axios.get(getters['getEndpoint'] + '/chains');
      commit(DemerisMutationTypes.SET_CHAINS, { value: response.data.chains });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_CHAINS, payload: {} });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetChains', 'Could not perform API query.');
    }
    return getters['getChains'];
  },

  // Chain-specific endpoint actions

  async [DemerisActionTypes.GET_VERIFY_TRACE]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] +
          '/chain/' +
          (params as API.VerifyTraceReq).chain_name +
          '/denom/verify_trace/' +
          (params as API.VerifyTraceReq).hash,
      );
      commit(DemerisMutationTypes.SET_VERIFY_TRACE, { params, value: response.data.verify_trace });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_VERIFY_TRACE, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetVerifiedPath', 'Could not perform API query.');
    }
    return getters['getVerifyTrace'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_FEE_ADDRESS]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] + '/chain/' + (params as API.ChainReq).chain_name + '/fee/address',
      );
      commit(DemerisMutationTypes.SET_FEE_ADDRESS, { params, value: response.data.fee_address });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_FEE_ADDRESS, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetFeeAddress', 'Could not perform API query.');
    }
    return getters['getFeeAddress'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_BECH32_CONFIG]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] + '/chain/' + (params as API.ChainReq).chain_name + '/bech32',
      );
      commit(DemerisMutationTypes.SET_BECH32_CONFIG, { params, value: response.data.bech32_config });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_BECH32_CONFIG, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetBech32Config', 'Could not perform API query.');
    }
    return getters['getBech32Config'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_CHAIN]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(getters['getEndpoint'] + '/chain/' + (params as API.ChainReq).chain_name);
      commit(DemerisMutationTypes.SET_CHAIN, { params, value: response.data.chain });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_CHAIN, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetChain', 'Could not perform API query.');
    }
    return getters['getChain'](params);
  },
  async [DemerisActionTypes.GET_PRIMARY_CHANNEL]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] +
          '/chain/' +
          (params as API.ChainReq).chain_name +
          '/primary_channel/' +
          (params as API.ChainReq).destination_chain_name,
      );
      commit(DemerisMutationTypes.SET_PRIMARY_CHANNEL, { params, value: response.data.primary_channel });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_PRIMARY_CHANNEL, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetPrimaryChannel', 'Could not perform API query.');
    }
    return getters['getPrimaryChannel'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_PRIMARY_CHANNELS]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] + '/chain/' + (params as API.ChainReq).chain_name + '/primary_channels',
      );
      commit(DemerisMutationTypes.SET_PRIMARY_CHANNELS, { params, value: response.data.primary_channels });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_PRIMARY_CHANNELS, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetPrimaryChannels', 'Could not perform API query.');
    }
    return getters['getPrimaryChannels'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_CHAIN_STATUS]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] + '/chain/' + (params as API.ChainReq).chain_name + '/status',
      );
      commit(DemerisMutationTypes.SET_CHAIN_STATUS, { params, value: response.data.online });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_CHAIN_STATUS, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetChainStatus', 'Could not perform API query.');
    }
    return getters['getChainStatus'](params);
  },

  async [DemerisActionTypes.BROADCAST_TX]({ getters }, { tx, chain_name }: DemerisTxParams) {
    try {
      const response = await axios.post(getters['getEndpoint'] + '/tx/' + chain_name, { tx_bytes: tx });
      return response.data;
    } catch (e) {
      throw new SpVuexError('Demeris:BroadcastTx', 'Could not broadcastTx.' + e.message);
    }
  },
  // Internal module actions

  [DemerisActionTypes.INIT]({ commit, dispatch }, { endpoint, refreshTime }) {
    console.log('Vuex nodule: demeris initialized!');
    commit('INIT', { endpoint });
    setInterval(() => {
      dispatch(DemerisActionTypes.STORE_UPDATE);
    }, refreshTime);
  },
  [DemerisActionTypes.RESET_STATE]({ commit }) {
    commit(DemerisMutationTypes.RESET_STATE);
  },
  [DemerisActionTypes.STORE_UPDATE]({ state, dispatch }) {
    state._Subscriptions.forEach((subscription_json) => {
      const subscription = JSON.parse(subscription_json);
      dispatch(subscription.action, subscription.payload);
    });
  },
  [DemerisActionTypes.UNSUBSCRIBE]({ commit }, subscription) {
    commit('UNSUBSCRIBE', subscription);
  },
};
