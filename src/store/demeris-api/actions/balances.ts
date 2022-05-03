/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/naming-convention */
import { EmerisAPI } from '@emeris/types';
import axios, { AxiosResponse } from 'axios';
import { ActionTree } from 'vuex';

import { GlobalActionTypes, GlobalGetterTypes, RootState } from '@/store';
import { ActionParams, Subscribable } from '@/types/util';
import { hashObject } from '@/utils/basic';
import EmerisError from '@/utils/EmerisError';

import { ActionTypes } from '../action-types';
import { MutationTypes } from '../mutation-types';
import { APIState } from '../state';
import { APIActionContext } from './api-action-context-type';

export interface BalanceActionsInterface {
  //Balances Action types
  [ActionTypes.GET_BALANCES](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.AddrReq>>,
  ): Promise<EmerisAPI.Balances>;
  [ActionTypes.GET_POOL_BALANCES](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.AddrReq>>,
  ): Promise<EmerisAPI.Balances>;
  [ActionTypes.GET_STAKING_BALANCES](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.AddrReq>>,
  ): Promise<EmerisAPI.StakingBalances>;
  [ActionTypes.GET_UNBONDING_DELEGATIONS](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.AddrReq>>,
  ): Promise<EmerisAPI.UnbondingDelegations>;
  [ActionTypes.GET_ALL_BALANCES](context: APIActionContext): Promise<EmerisAPI.Balances>;
  [ActionTypes.GET_ALL_STAKING_BALANCES](context: APIActionContext): Promise<EmerisAPI.StakingBalances>;
  [ActionTypes.GET_ALL_UNBONDING_DELEGATIONS](context: APIActionContext): Promise<EmerisAPI.UnbondingDelegations>;
}

export const BalanceActions: ActionTree<APIState, RootState> & BalanceActionsInterface = {
  /**
   * Balances Logic Action types
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async [ActionTypes.GET_BALANCES]({ commit, dispatch, getters, state, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_BALANCES, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getBalances'](params);
    } else {
      let resolver;
      let rejecter;
      const promise: Promise<void> = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response: AxiosResponse<EmerisAPI.BalancesResponse> = await axios.get(
          getters['getEndpoint'] + '/account/' + params.address + '/balance',
        );

        if (response.data.balances) {
          const tracesLoaded = [];
          for (const balance of response.data.balances) {
            if (
              // balance.ibc holds resolved ibc denoms so we can show the name of the coin. this functions as a cache. so if it was loaded in the past we don't need to load it again.
              Object.keys(balance.ibc).length != 0 &&
              !getters['getVerifyTrace']({
                chain_name: balance.on_chain,
                hash: balance.ibc.hash,
              })
            ) {
              tracesLoaded.push(
                dispatch(ActionTypes.GET_VERIFY_TRACE, {
                  subscribe: false,
                  params: { chain_name: balance.on_chain, hash: balance.ibc.hash },
                }),
              );
            }
          }
          await Promise.all(tracesLoaded);
        }
        commit(MutationTypes.SET_BALANCES, { params, value: response.data.balances });
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_BALANCES, payload: { params } });
        }
      } catch (e) {
        commit(MutationTypes.SET_BALANCES, { params, value: null });
        commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_BALANCES, payload: { params } });
        }
        throw new EmerisError('Demeris:GetBalances', 'Could not perform API query.');
      }
      commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
      resolver();
      return getters['getBalances'](params);
    }
  },
  async [ActionTypes.GET_POOL_BALANCES]({ commit, getters, state, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_POOL_BALANCES, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getBalances'](params);
    } else {
      let resolver;
      let rejecter;
      const promise: Promise<void> = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response: AxiosResponse<EmerisAPI.BalancesResponse> = await axios.get(
          getters['getEndpoint'] + '/account/' + params.address + '/balance',
        );

        commit(MutationTypes.SET_POOL_BALANCES, { params, value: response.data.balances });
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_POOL_BALANCES, payload: { params } });
        }
      } catch (e) {
        commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_POOL_BALANCES, payload: { params } });
        }
        throw new EmerisError('Demeris:GetPoolBalances', 'Could not perform API query.');
      }
      commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
      resolver();

      return getters['getBalances'](params);
    }
  },
  async [ActionTypes.GET_ALL_BALANCES]({ dispatch, getters, rootGetters }) {
    try {
      const keyHashes = rootGetters[GlobalGetterTypes.USER.getKeyhashes];

      const balanceLoads = [];

      const chains =
        getters['getChains'] ??
        (await dispatch(ActionTypes.GET_CHAINS, {
          subscribe: false,
        }));
      for (const chain in chains) {
        if (!chains[chain].primary_channel)
          chains[chain] = await dispatch(ActionTypes.GET_CHAIN, {
            subscribe: true,
            params: {
              chain_name: chain,
            },
          });
      }
      for (const keyHash of keyHashes) {
        balanceLoads.push(dispatch(ActionTypes.GET_BALANCES, { subscribe: true, params: { address: keyHash } }));
      }
      await Promise.all(balanceLoads);
      if (rootGetters[GlobalGetterTypes.USER.getBalancesFirstLoad]) {
        dispatch(GlobalActionTypes.USER.BALANCES_LOADED, null, { root: true });
      }
    } catch (e) {
      throw new EmerisError('Demeris:GetAllBalances', 'Could not perform API query.');
    }
    return getters['getAllBalances'];
  },
  async [ActionTypes.GET_ALL_STAKING_BALANCES]({ dispatch, getters, rootGetters }) {
    try {
      const keyHashes = rootGetters[GlobalGetterTypes.USER.getKeyhashes];

      const stakingBalanceLoads = [];
      for (const keyHash of keyHashes) {
        stakingBalanceLoads.push(
          dispatch(ActionTypes.GET_STAKING_BALANCES, { subscribe: true, params: { address: keyHash } }),
        );
      }
      await Promise.all(stakingBalanceLoads);

      if (rootGetters[GlobalGetterTypes.USER.getStakingBalancesFirstLoad]) {
        dispatch(GlobalActionTypes.USER.STAKING_BALANCES_LOADED, null, { root: true });
      }
    } catch (e) {
      throw new EmerisError('Demeris:GetAllStakingBalances', 'Could not perform API query.');
    }
    return getters['getAllStakingBalances'];
  },
  async [ActionTypes.GET_ALL_UNBONDING_DELEGATIONS]({ dispatch, getters, rootGetters }) {
    try {
      const keyHashes = rootGetters[GlobalGetterTypes.USER.getKeyhashes];
      for (const keyHash of keyHashes) {
        dispatch(ActionTypes.GET_UNBONDING_DELEGATIONS, { subscribe: true, params: { address: keyHash } });
      }
    } catch (e) {
      throw new EmerisError('Demeris:GetAllUnbondingDelegations', 'Could not perform API query.');
    }
    return getters['getAllUnbondingDelegations'];
  },
  async [ActionTypes.GET_STAKING_BALANCES]({ commit, getters, state, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_STAKING_BALANCES, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getStakingBalances'](params);
    } else {
      let resolver;
      let rejecter;
      const promise: Promise<void> = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response: AxiosResponse<EmerisAPI.StakingBalancesResponse> = await axios.get(
          getters['getEndpoint'] + '/account/' + params.address + '/stakingbalances',
        );
        commit(MutationTypes.SET_STAKING_BALANCES, { params, value: response.data.staking_balances });
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_STAKING_BALANCES, payload: { params } });
        }
      } catch (e) {
        commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_STAKING_BALANCES, payload: { params } });
        }
        throw new EmerisError('Demeris:GetStakingBalances', 'Could not perform API query.');
      }
      commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
      resolver();

      return getters['getStakingBalances'](params);
    }
  },
  async [ActionTypes.GET_UNBONDING_DELEGATIONS](
    { commit, getters, state, rootGetters },
    { subscribe = false, params },
  ) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_UNBONDING_DELEGATIONS, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getUnbondingDelegations'](params);
    } else {
      let resolver;
      let rejecter;
      const promise: Promise<void> = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response: AxiosResponse<EmerisAPI.UnbondingDelegationsResponse> = await axios.get(
          getters['getEndpoint'] + '/account/' + params.address + '/unbondingdelegations',
        );
        commit(MutationTypes.SET_UNBONDING_DELEGATIONS, { params, value: response.data.unbonding_delegations });
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_UNBONDING_DELEGATIONS, payload: { params } });
        }
      } catch (e) {
        commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_UNBONDING_DELEGATIONS, payload: { params } });
        }
        throw new EmerisError('Demeris:GetUnbondingDelegations', 'Could not perform API query.');
      }
      commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
      resolver();

      return getters['getUnbondingDelegations'](params);
    }
  },
};
