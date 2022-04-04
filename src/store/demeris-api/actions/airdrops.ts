import { EmerisAirdrops } from '@emeris/types';
import axios, { AxiosResponse } from 'axios';
import { ActionTree } from 'vuex';

import { RootState } from '@/store';
import { ActionParams, LoadingState, SimpleSubscribable, Subscribable } from '@/types/util';
import EmerisError from '@/utils/EmerisError';

import { ActionTypes } from '../action-types';
import { MutationTypes } from '../mutation-types';
import { APIState } from '../state';
import { APIActionContext } from './api-action-context-type';

export interface AirdropActionsInterface {
  //Airdrops Action types
  [ActionTypes.GET_GIT_AIRDROPS_LIST](
    context: APIActionContext,
    payload: SimpleSubscribable,
  ): Promise<EmerisAirdrops.AirdropList>;
  [ActionTypes.GET_AIRDROPS](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAirdrops.GitAirdropsListReq>>,
  ): Promise<void>;
  [ActionTypes.RESET_AIRDROPS](context: APIActionContext): void;
  [ActionTypes.SET_SELECTED_AIRDROP](
    context: APIActionContext,
    payload: ActionParams<EmerisAirdrops.selectedAirdropReq>,
  ): void;
}

export const AirdropActions: ActionTree<APIState, RootState> & AirdropActionsInterface = {
  /**
   * Chain Logic Action types
   */
  async [ActionTypes.GET_GIT_AIRDROPS_LIST]({ commit, getters }, { subscribe = false }) {
    try {
      delete axios.defaults.headers.get['X-Correlation-Id'];
      const response: AxiosResponse<EmerisAirdrops.AirdropList> = await axios.get(
        `${getters['getGitEndpoint']}/repos/allinbits/Emeris-Airdrop/contents/airdropList`,
      );
      if (subscribe) {
        commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_GIT_AIRDROPS_LIST });
      }
      return response.data;
    } catch (e) {
      throw new EmerisError('Demeris:gitAirdropsList', 'Could not perform API query.');
    }
  },
  async [ActionTypes.GET_AIRDROPS]({ commit, getters }, { subscribe = false, params }) {
    commit(MutationTypes.SET_AIRDROPS_STATUS, {
      value: LoadingState.LOADING,
    });
    try {
      delete axios.defaults.headers.get['X-Correlation-Id'];
      const response = await axios.get(
        `${getters['getRawGitEndpoint']}/EmerisHQ/Emeris-Airdrop/main/airdropList/${params.airdropFileName}`,
      );
      const image_check_response = await fetch(response.data.tokenIcon);

      commit(MutationTypes.SET_AIRDROPS, {
        value: {
          ...response.data,
          imageExists: image_check_response.status === 200,
          eligibilityStatusCode: null,
          eligibility: null,
          eligibilityResponse: null,
          address: null,
        },
      });

      commit(MutationTypes.SET_AIRDROPS_STATUS, {
        value: LoadingState.LOADED,
      });

      if (subscribe) {
        commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_AIRDROPS, payload: { params } });
      }
    } catch (e) {
      commit(MutationTypes.SET_AIRDROPS_STATUS, {
        value: LoadingState.ERROR,
      });
      throw new EmerisError('Demeris:getAirdrops', 'Could not perform API query.');
    }
  },
  [ActionTypes.SET_SELECTED_AIRDROP]({ commit }, { params }) {
    commit(MutationTypes.SET_SELECTED_AIRDROP, { value: params.airdrop });
  },
  [ActionTypes.RESET_AIRDROPS]({ commit }) {
    commit(MutationTypes.RESET_AIRDROPS);
  },
};
