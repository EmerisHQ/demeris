/* eslint-disable @typescript-eslint/naming-convention */
import { EmerisAirdrops } from '@emeris/types';
import axios, { AxiosResponse } from 'axios';
import { ActionTree } from 'vuex';

import { RootState } from '@/store';
import { ActionParams, LoadingState, SimpleSubscribable, Subscribable } from '@/types/util';
import { getAirdropEligibility } from '@/utils/airdropEligibility';
import EmerisError from '@/utils/EmerisError';

import { ActionTypes } from '../action-types';
import { MutationTypes } from '../mutation-types';
import { APIState } from '../state';
import { APIActionContext } from './api-action-context-type';

export type GitAirdropsListReq = {
  airdropFileName: string;
  checkEligibility: boolean;
};

export const AirdropActions: ActionTree<APIState, RootState> = {
  /**
   * Chain Logic Action types
   */
  async [ActionTypes.GET_GIT_AIRDROPS_LIST](
    { commit }: APIActionContext,
    { subscribe = false }: SimpleSubscribable,
  ): Promise<EmerisAirdrops.AirdropList> {
    try {
      delete axios.defaults.headers.get['X-Correlation-Id'];
      const response: AxiosResponse<EmerisAirdrops.AirdropList> = await axios.get(
        `https://api.github.com/repos/allinbits/Emeris-Airdrop/contents/airdropList`,
      );
      if (subscribe) {
        commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_GIT_AIRDROPS_LIST });
      }
      return response.data;
    } catch (e) {
      throw new EmerisError('Demeris:gitAirdropsList', 'Could not perform API query.');
    }
  },
  async [ActionTypes.GET_AIRDROPS](
    { commit, getters }: APIActionContext,
    { subscribe = false, params }: Subscribable<ActionParams<GitAirdropsListReq>>,
  ): Promise<void> {
    let eligibility = null;
    commit(MutationTypes.SET_AIRDROPS_STATUS, {
      value: LoadingState.LOADING,
    });
    try {
      delete axios.defaults.headers.get['X-Correlation-Id'];
      const response = await axios.get(
        `${getters['getRawGitEndpoint']}/EmerisHQ/Emeris-Airdrop/main/airdropList/${params.airdropFileName}`,
      );

      if (params.checkEligibility) {
        eligibility = await getAirdropEligibility(response.data);
      }

      commit(MutationTypes.SET_AIRDROPS, {
        value: {
          ...response.data,
          eligibility,
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
  [ActionTypes.RESET_AIRDROPS]({ commit }: APIActionContext): void {
    commit(MutationTypes.RESET_AIRDROPS);
  },
};
