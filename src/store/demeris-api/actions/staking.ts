/* eslint-disable @typescript-eslint/naming-convention */
import { EmerisAPI } from '@emeris/types';
import axios, { AxiosResponse } from 'axios';
import { ActionTree } from 'vuex';

import { GlobalGetterTypes, RootState } from '@/store';
import { ActionParams, Subscribable } from '@/types/util';
import { getOwnAddress, hashObject, keyHashfromAddress } from '@/utils/basic';
import EmerisError from '@/utils/EmerisError';

import { ActionTypes } from '../action-types';
import { MutationTypes } from '../mutation-types';
import { APIState } from '../state';
import { APIActionContext } from './api-action-context-type';

export const StakingActions: ActionTree<APIState, RootState> = {
  /**
   * Staking Logic Action types
   */
  async [ActionTypes.GET_INFLATION](
    { getters, rootGetters }: APIActionContext,
    { subscribe: _subscribe, params: { chain_name } }: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<number> {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    try {
      const response: AxiosResponse<EmerisAPI.InflationResponse> = await axios.get(
        getters['getEndpoint'] + '/chain/' + chain_name + '/mint/inflation',
      );
      return Number(response.data?.inflation);
    } catch (e) {
      throw new EmerisError('Demeris:GET_INFLATION', `Could not get ${chain_name} inflation.` + e.message);
    }
  },

  async [ActionTypes.GET_STAKING_REWARDS](
    { getters, rootGetters }: APIActionContext,
    { subscribe: _subscribe, params: { chain_name } }: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<EmerisAPI.StakingRewardsResponse> {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    try {
      const address = keyHashfromAddress(await getOwnAddress({ chain_name }));
      const response: AxiosResponse<EmerisAPI.StakingRewardsResponse> = await axios.get(
        getters['getEndpoint'] + '/account/' + address + '/delegatorrewards/' + chain_name,
      );
      return response.data;
    } catch (e) {
      throw new EmerisError('Demeris:GET_REWARDS', `Could not get ${chain_name} rewards.` + e.message);
    }
  },

  async [ActionTypes.GET_UNSTAKING_PARAM](
    { commit, getters }: APIActionContext,
    { subscribe: _subscribe, params: { chain_name } }: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<EmerisAPI.StakingParams> {
    try {
      const {
        data: { params: unstakingParam },
      } = await axios.get(`${getters['getEndpoint']}/chain/${chain_name}/staking/params`);
      commit(MutationTypes.SET_UNSTAKING_PARAM, { params: { chain_name }, value: unstakingParam });
      return getters['getUnstakingParam']({ chain_name });
    } catch {
      throw new EmerisError('Demeris:getUnstakingParam', 'Could not retrieve staking param.');
    }
  },

  async [ActionTypes.GET_CHAIN_APR](
    { commit, getters, state, rootGetters }: APIActionContext,
    { params }: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<string> {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_CHAIN_APR, payload: { params } });
    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);
      return getters['getChainAPR'](params);
    }
    let resolver;
    const promise: Promise<void> = new Promise((resolve, _) => {
      resolver = resolve;
    });
    commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
    try {
      const response: AxiosResponse<EmerisAPI.ChainAPR> = await axios.get(
        getters['getEndpoint'] + '/chain/' + params.chain_name + '/apr',
      );
      commit(MutationTypes.SET_CHAIN_APR, { params, value: response.data.apr ? response.data.apr : '0.00' });
    } catch (e) {
      throw new EmerisError('Demeris:GetChainAPR', 'Could not perform API query.');
    }
    resolver();
    commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
    return getters['getChainAPR'](params);
  },

  async [ActionTypes.GET_VALIDATORS](
    { getters, rootGetters }: APIActionContext,
    { subscribe: _subscribe, params: { chain_name } }: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<EmerisAPI.Validator[]> {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    try {
      const response: AxiosResponse<EmerisAPI.ValidatorsResponse> = await axios.get(
        getters['getEndpoint'] + '/chain/' + chain_name + '/validators',
      );
      return response.data?.validators;
    } catch (e) {
      throw new EmerisError('Demeris:GET_VALIDATORS', `Could not get ${chain_name} validators.` + e.message);
    }
  },
};
