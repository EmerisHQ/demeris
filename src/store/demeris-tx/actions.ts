import { EncodeObject, Registry } from '@cosmjs/proto-signing';
import { SpVuexError } from '@starport/vuex';
import axios from 'axios';
import { ActionContext, ActionTree } from 'vuex';

import { RootState } from '@/store';
import { DemerisMutationTypes } from '@/store/demeris-tx/mutation-types';
import { Amount } from '@/types/base';
import { keyHashfromAddress } from '@/utils/basic';

import { DemerisActionTypes, GlobalDemerisActionTypes } from './action-types';
import { DemerisSubscriptions } from './action-types';
import DemerisSigningClient from './demerisSigningClient';
import { ChainData, State } from './state';

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

export type TicketResponse = {
  ticket: string;
};
export interface Actions {
  [DemerisActionTypes.BROADCAST_TX](
    { commit, getters }: ActionContext<State, RootState>,
    { tx, chain_name }: DemerisTxParams,
  ): Promise<TicketResponse>;
  [DemerisActionTypes.SIGN_WITH_KEPLR](
    { commit, getters }: ActionContext<State, RootState>,
    { msgs, chain_name }: DemerisSignParams,
  ): Promise<DemerisTxParams>;
  [DemerisActionTypes.RESET_STATE]({ commit }: ActionContext<State, RootState>): void;
  [DemerisActionTypes.UNSUBSCRIBE](
    { commit }: ActionContext<State, RootState>,
    subscription: DemerisSubscriptions,
  ): void;
}
export interface GlobalActions {
  [GlobalDemerisActionTypes.BROADCAST_TX](
    ...args: Parameters<Actions[DemerisActionTypes.BROADCAST_TX]>
  ): ReturnType<Actions[DemerisActionTypes.BROADCAST_TX]>;
  [GlobalDemerisActionTypes.SIGN_WITH_KEPLR](
    ...args: Parameters<Actions[DemerisActionTypes.SIGN_WITH_KEPLR]>
  ): ReturnType<Actions[DemerisActionTypes.SIGN_WITH_KEPLR]>;
  [GlobalDemerisActionTypes.RESET_STATE](
    ...args: Parameters<Actions[DemerisActionTypes.RESET_STATE]>
  ): ReturnType<Actions[DemerisActionTypes.RESET_STATE]>;
  [GlobalDemerisActionTypes.UNSUBSCRIBE](
    ...args: Parameters<Actions[DemerisActionTypes.UNSUBSCRIBE]>
  ): ReturnType<Actions[DemerisActionTypes.UNSUBSCRIBE]>;
}
//@ts-ignore
export const actions: ActionTree<State, RootState> & Actions = {
  // Cross-chain endpoint actions

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async [DemerisActionTypes.SIGN_WITH_KEPLR]({ getters, dispatch }, { msgs, chain_name, fee, registry, memo }) {
    try {
      let chain = getters['demeris/getChain']({
        chain_name,
      }) as ChainData;
      if (!chain || !chain.node_info) {
        chain = await dispatch('demeris/GET_CHAINS', {
          subscribe: true,
          params: {
            chain_name,
          },
        });
      }
      // await addChain(chain_name);

      await window.keplr.enable(chain.node_info.chain_id);
      const offlineSigner = await window.getOfflineSigner(chain.node_info.chain_id);
      const [account] = await offlineSigner.getAccounts();

      const client = new DemerisSigningClient(undefined, offlineSigner, { registry });

      const numbers = await dispatch('demeris/GET_NUMBERS_CHAIN', {
        subscribe: false,
        params: {
          address: keyHashfromAddress(account.address),
          chain_name: chain_name,
        },
      });

      const signerData = numbers;
      const cosmjsSignerData = {
        chainId: chain.node_info.chain_id,
        accountNumber: parseInt(signerData.account_number),
        sequence: parseInt(signerData.sequence_number),
      };
      const tx = await (client as DemerisSigningClient).signWMeta(account.address, msgs, fee, memo, cosmjsSignerData);

      const tx_data = Buffer.from(tx).toString('base64');
      //console.log(Buffer.from(tx).toString('hex'));
      return { tx: tx_data, chain_name, address: account.address };
    } catch (e) {
      console.error(e);
      throw new SpVuexError('Demeris:SignWithKeplr', 'Could not sign TX.');
    }
  },

  async [DemerisActionTypes.BROADCAST_TX]({ getters }, { tx, chain_name, address }: DemerisTxParams) {
    try {
      const response = await axios.post(getters['demeris/getEndpoint'] + '/tx/' + chain_name, {
        tx_bytes: tx,
        address,
      });
      return response.data;
    } catch (e) {
      const cause = e.response?.data?.cause || e.message;
      throw new SpVuexError('Demeris:BroadcastTx', 'Could not broadcastTx.' + cause);
    }
  },

  [DemerisActionTypes.RESET_STATE]({ commit }) {
    console.log('reset_state called');
    commit(DemerisMutationTypes.RESET_STATE);
  },

  [DemerisActionTypes.UNSUBSCRIBE]({ commit }, subscription) {
    commit('UNSUBSCRIBE', subscription);
  },
};
