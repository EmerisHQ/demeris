/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import { ActionTree } from 'vuex';

import { walletActionHandler } from '@/features/extension/WalletActionHandler';
import { GlobalActionTypes, GlobalGetterTypes, RootState, RootStoreTyped } from '@/store';
import { SignParams, TxParams, TxResponse } from '@/types/tx';
import { Namespaced } from '@/types/util';
import { keyHashfromAddress } from '@/utils/basic';
import EmerisError from '@/utils/EmerisError';
import { featureRunning } from '@/utils/FeatureManager';

import { TXStore } from '.';
import { ActionTypes } from './action-types';
import DemerisSigningClient from './demerisSigningClient';
import { MutationTypes } from './mutation-types';
import { TXState } from './state';

type TxActionContext = {
  dispatch: Pick<TXStore<TXState>, 'dispatch'>['dispatch'] & Pick<RootStoreTyped, 'dispatch'>['dispatch'];
  commit: Pick<TXStore<TXState>, 'commit'>['commit'];
  state: TXState;
  getters: Pick<TXStore<TXState>, 'getters'>['getters'];
  rootState: RootState;
  rootGetters: Pick<RootStoreTyped, 'getters'>['getters'];
};
export interface Actions {
  [ActionTypes.BROADCAST_TX](contex: TxActionContext, { tx, chain_name }: TxParams): Promise<TxResponse>;
  [ActionTypes.SIGN_WITH_KEPLR](contex: TxActionContext, { msgs, chain_name }: SignParams): Promise<TxParams>;
  [ActionTypes.RESET_STATE](contex: TxActionContext): void;
}

export type GlobalActions = Namespaced<Actions, 'demerisTX'>;

export const actions: ActionTree<TXState, RootState> & Actions = {
  // Cross-chain endpoint actions

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async [ActionTypes.SIGN_WITH_KEPLR]({ dispatch, rootGetters }, { msgs, chain_name, fee, registry, memo }) {
    try {
      let chain = rootGetters[GlobalGetterTypes.API.getChain]({
        chain_name,
      });
      if (!chain || !chain.node_info) {
        chain = await dispatch(
          GlobalActionTypes.API.GET_CHAIN,
          {
            subscribe: true,
            params: {
              chain_name,
            },
          },
          { root: true },
        );
      }
      // await addChain(chain_name);

      if (featureRunning('USE_EMERIS_EXTENSION')) {
        await walletActionHandler.enable(chain.node_info.chain_id);
      } else {
        await window.keplr.enable(chain.node_info.chain_id);
      }
      let offlineSigner;
      if (!featureRunning('USE_EMERIS_EXTENSION')) {
        offlineSigner = await window.getOfflineSigner(chain.node_info.chain_id);
      } else {
        offlineSigner = await walletActionHandler.getOfflineSigner(chain.node_info.chain_id);
      }
      const [account] = await offlineSigner.getAccounts();

      const client = new DemerisSigningClient(undefined, offlineSigner, { registry });
      let numbers;
      try {
        numbers = await dispatch(
          GlobalActionTypes.API.GET_NUMBERS_CHAIN,
          {
            subscribe: false,
            params: {
              address: keyHashfromAddress(account.address),
              chain_name: chain_name,
            },
          },
          { root: true },
        );
      } catch (ex) {
        console.error(ex);
        return Promise.reject('GET_NUMBERS_CHAIN request failed');
      }

      const signerData = numbers;
      const cosmjsSignerData = {
        chainId: chain.node_info.chain_id,
        accountNumber: signerData.account_number,
        sequence: signerData.sequence_number,
      };
      const tx = await (client as DemerisSigningClient).signWMeta(account.address, msgs, fee, memo, cosmjsSignerData);

      const tx_data = Buffer.from(tx).toString('base64');
      //console.log(Buffer.from(tx).toString('hex'));
      return { tx: tx_data, chain_name, address: account.address };
    } catch (e) {
      console.error(e);
      return Promise.reject('Failed to sign tx');
    }
  },

  async [ActionTypes.BROADCAST_TX]({ rootGetters }, { tx, chain_name, address }) {
    axios.defaults.headers.post['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    try {
      const response = await axios.post(rootGetters[GlobalGetterTypes.API.getEndpoint] + '/tx/' + chain_name, {
        tx_bytes: tx,
        address,
      });
      return response.data;
    } catch (e) {
      const cause = e.response?.data?.cause || e.message;
      throw new EmerisError('Demeris:BroadcastTx', 'Could not broadcastTx.' + cause);
    }
  },

  [ActionTypes.RESET_STATE]({ commit }) {
    commit(MutationTypes.RESET_STATE);
  },
};
