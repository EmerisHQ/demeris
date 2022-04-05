import { EmerisAirdrops } from '@emeris/types';
import { Airdrop } from '@emeris/types/lib/EmerisAirdrops';
import axios, { AxiosResponse } from 'axios';
import { toRaw } from 'vue';
import { ActionTree } from 'vuex';

import { RootState } from '@/store';
import { AirdropEligibilityStatus } from '@/types/api';
import { ActionParams, LoadingState, SimpleSubscribable, Subscribable } from '@/types/util';
import { getOwnAddress } from '@/utils/basic';
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
  [ActionTypes.AIRDROPS_ELIGIBILITY_CHECK](context: APIActionContext): void;
  [ActionTypes.SET_SELECTED_AIRDROP](
    context: APIActionContext,
    payload: ActionParams<EmerisAirdrops.selectedAirdropReq>,
  ): void;
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  [ActionTypes.GET_GIT_AIRDROPS_LIST](
    context: APIActionContext,
    payload: SimpleSubscribable,
  ): Promise<EmerisAirdrops.AirdropList>;
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
  async [ActionTypes.AIRDROPS_ELIGIBILITY_CHECK]({ commit, getters }) {
    try {
      const airdrops = getters['getAirdrops'];
      airdrops.forEach((data: Airdrop) => {
        let eligibility = null;
        let eligibility_status = null;
        let eligibility_data = null;
        if (data.claimActions && data.claimActions.length === 1 && data.claimActions[0].actionType === 'autodrop') {
          commit(MutationTypes.SET_AIRDROPS, {
            value: {
              ...data,
              eligibilityStatusCode: 200,
              eligibility: AirdropEligibilityStatus.AUTO_DROP,
              eligibilityResponse: null,
              address: null,
            },
          });
        } else if (data.eligibleTokens && data.eligibleTokens.length > 0) {
          const verified_denoms = toRaw(getters['getVerifiedDenoms']);
          const denoms_existing = verified_denoms.filter((denom) => data.eligibleTokens.includes(denom.ticker));

          denoms_existing.forEach(async (denom_existing) => {
            const own_address = await getOwnAddress({ chain_name: denom_existing.chain_name });
            if (data.eligibilityCheckEndpoint && own_address) {
              delete axios.defaults.headers.get['X-Correlation-Id'];
              const eligibilityEndpoint = data.eligibilityCheckEndpoint.replace('<address>', own_address);
              try {
                const eligibility_res = await axios.get(eligibilityEndpoint);
                eligibility_status = eligibility_res.status;
                eligibility_data = eligibility_res.data;
                if (eligibility_res.status === 200) {
                  eligibility = AirdropEligibilityStatus.ELIGIBLE;
                }
              } catch (err) {
                eligibility_status = err.response.status;
                eligibility_data = err.response.data;
                if (err.response.status === 403) {
                  eligibility = AirdropEligibilityStatus.NOT_ELIGIBLE;
                } else {
                  eligibility = AirdropEligibilityStatus.NOT_AVAILABLE;
                }
              }
            } else {
              eligibility = AirdropEligibilityStatus.NOT_AVAILABLE;
            }

            // FURTHER WORK TO BE DONE HERE, COMPARING AND MERGING INDIVIDUAL ADDRESS RESPONSES FOR EACH AIRDROP PROJECT (ISSUE #1423 CREATED FOR THIS)
            commit(MutationTypes.SET_AIRDROPS, {
              value: {
                ...data,
                eligibilityStatusCode: eligibility_status,
                eligibility,
                eligibilityResponse: eligibility_data,
                address: own_address,
              },
            });
          });
        } else {
          commit(MutationTypes.SET_AIRDROPS, {
            value: {
              ...data,
              eligibilityStatusCode: 200,
              eligibility: AirdropEligibilityStatus.NOT_AVAILABLE,
              eligibilityResponse: null,
              address: null,
            },
          });
        }
      });
    } catch (e) {
      console.error('Demeris:airdropEligibilityCheck: Could not perform API query.');
    }
  },
};
