/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/naming-convention */
import { EmerisAPI } from '@emeris/types';
import axios, { AxiosResponse } from 'axios';
import { ActionTree } from 'vuex';

import { GlobalGetterTypes, RootState } from '@/store';
import { ActionParams, Subscribable } from '@/types/util';
import EmerisError from '@/utils/EmerisError';
import { featureRunning } from '@/utils/FeatureManager';
import TendermintWS from '@/utils/TendermintWS';

import { ActionTypes } from '../action-types';
import { MutationTypes } from '../mutation-types';
import { APIState } from '../state';
import { APIActionContext } from './api-action-context-type';

export interface TransactionActionsInterface {
  //Transaction Logic Action types
  [ActionTypes.GET_TX_STATUS](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.TicketReq>>,
  ): Promise<EmerisAPI.TicketResponse>;
  [ActionTypes.GET_NUMBERS_CHAIN](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.ChainAddrReq>>,
  ): Promise<EmerisAPI.SeqNumber>;
}

export const TransactionActions: ActionTree<APIState, RootState> & TransactionActionsInterface = {
  /**
   * Gets sequence and account number. Used when making a transaction.
   * @param {string} chain_name - chain name
   * @param {string} address - address
   */
  async [ActionTypes.GET_NUMBERS_CHAIN]({ commit, getters, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    try {
      const response: AxiosResponse<EmerisAPI.NumbersResponse> = await axios.get(
        getters['getEndpoint'] + '/chain/' + params.chain_name + '/numbers/' + params.address,
      );
      commit(MutationTypes.SET_NUMBERS_CHAIN, { params, value: response.data.numbers });
      if (subscribe) {
        commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_NUMBERS_CHAIN, payload: { params } });
      }
    } catch (e) {
      throw new EmerisError('Demeris:GetNumbersChain', 'Could not perform API query.');
    }
    return getters['getNumbersChain'](params);
  },
  async [ActionTypes.GET_TX_STATUS]({ commit, getters, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    try {
      const response: AxiosResponse<EmerisAPI.TicketResponse> = await axios.get(
        getters['getEndpoint'] + '/tx/ticket/' + params.chain_name + '/' + params.ticket,
      );
      commit(MutationTypes.SET_TX_STATUS, { params, value: response.data });
      if (subscribe) {
        commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_TX_STATUS, payload: { params } });
      }
    } catch (e) {
      console.error(e);
      throw new EmerisError('Demeris:GetTXStatus', 'Could not perform API query.');
    }
    return getters['getTxStatus'](params);
  },
  async [ActionTypes.GET_TX_DEST_HASH]({ getters, rootGetters }, { from_chain, to_chain, txhash }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    try {
      const response: AxiosResponse<EmerisAPI.DestinationTXResponse> = await axios.get(
        `${getters['getEndpoint']}/tx/${from_chain}/${to_chain}/${txhash}`,
      );
      const data = response.data;

      if (data.cause) {
        throw new Error(data.cause);
      }

      if (!data.tx_hash) {
        throw new Error('Failed to fetch destination hash');
      }

      return response.data;
    } catch (e) {
      throw new EmerisError('Demeris:GetTXDestHash', 'Could not perform API query.');
    }
  },
  async [ActionTypes.TRACE_TX_RESPONSE]({ getters, dispatch }, { txhash, chain_name }) {
    return new Promise(async (resolve, reject) => {
      const timeoutMs = 300000;
      const fallbackIntervalMs = 50000;

      let timeoutId = undefined;
      let intervalId = undefined;

      const wsUrl = `${getters['getWebSocketEndpoint']}/chain/${chain_name}/rpc/websocket`;

      const wss = new TendermintWS({ server: wsUrl, timeout: 5000, autoReconnect: false });
      const txHash64 = Buffer.from(txhash, 'hex').toString('base64');
      const subscribeQuery = `tm.event = 'Tx' AND tx.hash = '${txhash}'`;

      let done = false;

      const getTx = async () => {
        const result = await wss.call('tx', [txHash64, false]);
        handleMessage(result);
      };

      const subscribeTx = () => {
        wss.subscribe(
          {
            query: subscribeQuery,
          },
          handleMessage,
        );
      };

      const handleOpen = () => {
        getTx();
        subscribeTx();
      };

      const handleError = (err: Error) => {
        complete();
        return reject(err);
      };

      const handleSuccess = (data: Record<string, any>) => {
        complete();
        return resolve(data);
      };

      const complete = () => {
        done = true;
        clearTimeout(timeoutId);
        clearInterval(intervalId);
      };

      const handleMessage = async (data: Record<string, any>) => {
        if (done) return;

        if (data.error) {
          // Not found
          if (data.error.code === -32603) return;

          return handleError(new Error(data.error));
        }

        if (data.result && !Object.values(data.result).length) return;

        if (!data.rpc && featureRunning('FORCE_RPC_FALLBACK')) {
          console.log('Skipping websocket result, FORCE_RPC fallback enabled', data);
          return;
        }

        if (data.result?.data?.value?.TxResult) {
          // Subscription response
          const txResult = data.result.data.value.TxResult;

          if (txResult.result.code) {
            return handleError(new Error(txResult.result.log));
          }

          return handleSuccess({
            ...data.result,
            height: txResult.height,
            tx_result: txResult.result,
          });
        }

        if (data?.result?.tx_result) {
          const txResult = data.result.tx_result;
          if (txResult.code === 0) {
            return handleSuccess({ ...data.result, height: data.result.height });
          }
          return handleError(new Error(txResult.log));
        }
      };

      intervalId = setInterval(() => {
        if (done) return;
        dispatch(ActionTypes.GET_TX_FROM_RPC, { chain_name, txhash }).then(handleMessage);
      }, fallbackIntervalMs);

      timeoutId = setTimeout(() => {
        handleError(new Error('Could not find transaction response'));
      }, timeoutMs);

      try {
        await wss.connect();
        handleOpen();
      } catch {
        // Skip websocket connection failure to be handled by fallback
      }
    });
  },

  async [ActionTypes.GET_TX_FROM_RPC]({ getters }, { txhash, chain_name }) {
    const rpcUrl = `${getters['getEndpoint']}/chain/${chain_name}/rpc`;

    if (!rpcUrl) {
      throw new Error(`${chain_name} RPC endpoint not found`);
    }

    try {
      delete axios.defaults.headers.get['X-Correlation-Id'];
      const { data } = await axios.get(`${rpcUrl}/tx?hash=0x${txhash}`);

      return { rpc: true, ...data };
    } catch (e) {
      throw new Error('Could not find transaction response from RPC');
    }
  },
};
