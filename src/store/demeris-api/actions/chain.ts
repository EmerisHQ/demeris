/* eslint-disable @typescript-eslint/naming-convention */
import { EmerisAPI } from '@emeris/types';
import axios, { AxiosResponse } from 'axios';
import { ActionTree } from 'vuex';

import { GlobalGetterTypes, RootState } from '@/store';
import { ActionParams, SimpleSubscribable, Subscribable } from '@/types/util';
import { hashObject } from '@/utils/basic';
import EmerisError from '@/utils/EmerisError';
import { featureRunning } from '@/utils/FeatureManager';

import { ActionTypes } from '../action-types';
import { MutationTypes } from '../mutation-types';
import { APIState } from '../state';
import { APIActionContext } from './api-action-context-type';

export const ChainActions: ActionTree<APIState, RootState> = {
  /**
   * Chain Logic Action types
   */
  async [ActionTypes.GET_CHAIN](
    { commit, getters, state, rootGetters }: APIActionContext,
    { subscribe = false, params }: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<EmerisAPI.Chain> {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_CHAIN, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters[GlobalGetterTypes.API.getChain](params);
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
          `${getters[GlobalGetterTypes.API.getEndpoint]}/chain/${params.chain_name}`,
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
      return getters[GlobalGetterTypes.API.getChain](params);
    }
  },
  async [ActionTypes.GET_CHAIN_STATUS](
    { commit, getters, state, rootGetters }: APIActionContext,
    { subscribe = false, params },
  ): Promise<boolean> {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_CHAIN_STATUS, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters[GlobalGetterTypes.API.getChainStatus](params);
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
          `${getters[GlobalGetterTypes.API.getEndpoint]}/chain/${params.chain_name}/status`,
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
      return getters[GlobalGetterTypes.API.getChainStatus](params);
    }
  },
  async [ActionTypes.GET_CHAINS](
    { commit, getters, rootGetters, state }: APIActionContext,
    { subscribe = false }: SimpleSubscribable,
  ): Promise<Record<string, EmerisAPI.Chain>> {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_CHAINS, payload: {} });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);
      return getters[GlobalGetterTypes.API.getChains];
    }
    let resolver;
    const promise: Promise<void> = new Promise((resolve, _) => {
      resolver = resolve;
    });
    try {
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      const response: AxiosResponse<EmerisAPI.ChainsResponse> = await axios.get(
        `${getters[GlobalGetterTypes.API.getEndpoint]}/chains`,
      );
      commit(MutationTypes.SET_CHAINS, { value: response.data.chains });
      if (subscribe) {
        commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_CHAINS, payload: {} });
      }
    } catch (e) {
      throw new EmerisError('Demeris:GetChains', 'Could not perform API query.');
    }
    resolver();
    commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
    return getters[GlobalGetterTypes.API.getChains];
  },
  async [ActionTypes.GET_CHAINS_AND_CHAIN_STATUS](
    { dispatch, getters }: APIActionContext,
    { subscribe = false }: SimpleSubscribable,
  ): Promise<Record<string, EmerisAPI.Chain>> {
    if (featureRunning('USE_NEW_CHAINS_API')) {
      dispatch(ActionTypes.GET_CHAINS, {
        subscribe: true,
      });
    } else {
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
    }
    return getters[GlobalGetterTypes.API.getChains];
  },
};
