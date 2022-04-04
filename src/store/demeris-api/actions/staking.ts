import { EmerisAPI } from '@emeris/types';
import axios, { AxiosResponse } from 'axios';
import { ActionTree } from 'vuex';

import { GlobalGetterTypes, RootState } from '@/store';
import { ActionParams, Subscribable } from '@/types/util';
import { getOwnAddress, keyHashfromAddress } from '@/utils/basic';
import EmerisError from '@/utils/EmerisError';

import { ActionTypes } from '../action-types';
import { MutationTypes } from '../mutation-types';
import { APIState } from '../state';
import { APIActionContext } from './api-action-context-type';

export interface StakingActionsInterface {
  //Staking Action types
  [ActionTypes.GET_INFLATION](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<number>;
  [ActionTypes.GET_STAKING_REWARDS](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<EmerisAPI.StakingRewardsResponse>;
  [ActionTypes.GET_UNSTAKING_PARAM](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<EmerisAPI.StakingParams>;
  [ActionTypes.GET_VALIDATORS](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<EmerisAPI.Validator[]>;
}

export const StakingActions: ActionTree<APIState, RootState> & StakingActionsInterface = {
  /**
   * Staking Logic Action types
   */
  async [ActionTypes.GET_INFLATION]({ getters, rootGetters }, { subscribe: _subscribe, params: { chain_name } }) {
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

  async [ActionTypes.GET_STAKING_REWARDS]({ getters, rootGetters }, { subscribe: _subscribe, params: { chain_name } }) {
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
    { commit, getters },
    { subscribe: _subscribe, params: { chain_name } },
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

  async [ActionTypes.GET_VALIDATORS]({ getters, rootGetters }, { subscribe: _subscribe, params: { chain_name } }) {
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
