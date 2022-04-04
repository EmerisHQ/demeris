import { EmerisAPI } from '@emeris/types';
import axios, { AxiosResponse } from 'axios';
import { ActionTree } from 'vuex';

import { GlobalGetterTypes, RootState } from '@/store';
import { ActionParams, SimpleSubscribable, Subscribable } from '@/types/util';
import { hashObject } from '@/utils/basic';
import EmerisError from '@/utils/EmerisError';

import { ActionTypes } from '../action-types';
import { MutationTypes } from '../mutation-types';
import { APIState } from '../state';
import { APIActionContext } from './api-action-context-type';

export interface ChainActionsInterface {
  //Chain Action Types
  [ActionTypes.GET_CHAIN](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<EmerisAPI.Chain>;
  [ActionTypes.GET_CHAIN_STATUS](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<boolean>;
  [ActionTypes.GET_CHAINS](
    context: APIActionContext,
    payload: SimpleSubscribable,
  ): Promise<Record<string, EmerisAPI.Chain>>;
  [ActionTypes.GET_CHAINS_AND_CHAIN_STATUS](
    context: APIActionContext,
    payload: SimpleSubscribable,
  ): Promise<Record<string, EmerisAPI.Chain>>;
}

export const ChainActions: ActionTree<APIState, RootState> & ChainActionsInterface = {
  /**
   * Chain Logic Action types
   */
  async [ActionTypes.GET_CHAIN]({ commit, getters, state, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_CHAIN, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getChain'](params);
    } else {
      let resolver;
      let rejecter;
      const promise: Promise<void> = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response: AxiosResponse<EmerisAPI.ChainResponse> = await axios.get(
          getters['getEndpoint'] + '/chain/' + params.chain_name,
        );
        commit(MutationTypes.SET_CHAIN, { params, value: { ...response.data.chain, status: true } });
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_CHAIN, payload: { params } });
        }
      } catch (e) {
        commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_CHAIN, payload: { params } });
        }
        throw new EmerisError('Demeris:GetChain', 'Could not perform API query.');
      }
      resolver();
      commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
      return getters['getChain'](params);
    }
  },
  async [ActionTypes.GET_CHAIN_STATUS]({ commit, getters, state, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_CHAIN_STATUS, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getChainStatus'](params);
    } else {
      let resolver;
      let rejecter;
      const promise: Promise<void> = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response: AxiosResponse<EmerisAPI.ChainStatusResponse> = await axios.get(
          getters['getEndpoint'] + '/chain/' + params.chain_name + '/status',
        );
        commit(MutationTypes.SET_CHAIN_STATUS, { params, value: response.data.online });
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_CHAIN_STATUS, payload: { params } });
        }
      } catch (e) {
        commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_CHAIN_STATUS, payload: { params } });
        }
        throw new EmerisError('Demeris:GetChainStatus', 'Could not perform API query.');
      }
      resolver();
      commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
      return getters['getChainStatus'](params);
    }
  },
  async [ActionTypes.GET_CHAINS]({ commit, getters, rootGetters, state }, { subscribe = false }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_CHAINS, payload: {} });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);
      return getters['getChains'];
    }
    let resolver;
    const promise: Promise<void> = new Promise((resolve, _) => {
      resolver = resolve;
    });
    try {
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      const response: AxiosResponse<EmerisAPI.ChainsResponse> = await axios.get(getters['getEndpoint'] + '/chains');
      commit(MutationTypes.SET_CHAINS, { value: response.data.chains });
      if (subscribe) {
        commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_CHAINS, payload: {} });
      }
    } catch (e) {
      throw new EmerisError('Demeris:GetChains', 'Could not perform API query.');
    }
    resolver();
    commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
    return getters['getChains'];
  },
  async [ActionTypes.GET_CHAINS_AND_CHAIN_STATUS]({ dispatch, getters }, { subscribe = false }) {
    dispatch(ActionTypes.GET_CHAINS, {
      subscribe: subscribe,
    })
      .then((chains) => {
        for (const chain in chains) {
          dispatch(ActionTypes.GET_CHAIN, {
            subscribe: true,
            params: {
              chain_name: chain,
            },
          }).then((chain) => {
            dispatch(ActionTypes.GET_CHAIN_STATUS, {
              subscribe: true,
              params: {
                chain_name: chain.chain_name,
              },
            });
          });
        }
      })
      .catch((e) => {
        console.error('Could not load chain information: ' + e);
      });
    return getters['getChains'];
  },
};
