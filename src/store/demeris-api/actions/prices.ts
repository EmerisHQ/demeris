/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/naming-convention */
import { EmerisAPI } from '@emeris/types';
import axios, { AxiosResponse } from 'axios';
import { ActionTree } from 'vuex';

import usePool from '@/composables/usePool';
import { GlobalActionTypes, GlobalGetterTypes, RootState } from '@/store';
import { ActionParams, ChartPrices, LoadingState, SimpleSubscribable, Subscribable } from '@/types/util';
import { hashObject } from '@/utils/basic';
import EmerisError from '@/utils/EmerisError';

import { ActionTypes } from '../action-types';
import { MutationTypes } from '../mutation-types';
import { APIState } from '../state';
import { APIActionContext } from './api-action-context-type';

export const PriceActions: ActionTree<APIState, RootState> = {
  /**
   * Staking Logic Action types
   */
  async [ActionTypes.GET_PRICES](
    { commit, getters, rootGetters, state, dispatch }: APIActionContext,
    { subscribe = false }: SimpleSubscribable,
  ): Promise<EmerisAPI.Prices> {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_PRICES, payload: {} });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getPrices'];
    } else {
      let resolver;
      let rejecter;
      const promise: Promise<void> = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response: AxiosResponse<EmerisAPI.PricesResponse> = await axios.get(
          getters['getEndpoint'] + '/oracle/prices',
        );
        if (response.data?.data?.Tokens) {
          commit(MutationTypes.SET_PRICES, { value: response.data.data });

          // Set initial prices so pool calculations can find them
          await Promise.all(
            getters['getVerifiedDenoms'].map(async (denom) => {
              if (denom.name.startsWith('pool')) {
                const pools = rootGetters['tendermint.liquidity.v1beta1/getLiquidityPools']().pools;

                if (pools) {
                  const pool = pools.find((pool) => pool.pool_coin_denom == denom.name);

                  if (pool) {
                    const { totalLiquidityPrice, totalSupply, initPromise } = usePool(pool.id);
                    await initPromise;
                    try {
                      if (totalLiquidityPrice.value > 0) {
                        const priceData = {
                          Symbol: denom.ticker + 'USDT',
                          Price: (totalLiquidityPrice.value * 10 ** 6) / totalSupply.value,
                          Supply: totalSupply.value,
                        };
                        response.data.data.Tokens.push(priceData);
                      }
                    } catch (e) {}
                  }
                }
              }
            }),
          );
          commit(MutationTypes.SET_PRICES, { value: response.data.data });

          // Set prices incl. pool calculations

          if (rootGetters[GlobalGetterTypes.USER.getPricesFirstLoad]) {
            dispatch(GlobalActionTypes.USER.PRICES_LOADED, null, { root: true });
          }
        }
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_PRICES, payload: {} });
        }
      } catch (e) {
        commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_PRICES, payload: {} });
        }
        throw new EmerisError('Demeris:GetPrices', 'Could not perform API query.');
      }
      commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
      resolver();
      return getters['getPrices'];
    }
  },
  async [ActionTypes.GET_TOKEN_PRICES](
    { commit, getters, rootGetters }: APIActionContext,
    { subscribe = false, params }: Subscribable<ActionParams<EmerisAPI.TokenPriceReq>>,
  ): Promise<ChartPrices> {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    commit(MutationTypes.SET_TOKEN_PRICES_STATUS, {
      value: params.showSkeleton ? LoadingState.LOADING : LoadingState.LOADED,
    });
    try {
      const response: AxiosResponse<EmerisAPI.TokenPriceResponse> = await axios.get(
        getters['getEndpoint'] + `/oracle/chart/${params.token_id}?days=${params.days}&vs_currency=${params.currency}`,
      );
      commit(MutationTypes.SET_TOKEN_PRICES, { value: response.data.data.prices });
      commit(MutationTypes.SET_TOKEN_PRICES_STATUS, { value: LoadingState.LOADED });
      if (subscribe) {
        commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_TOKEN_PRICES, payload: { params } });
      }
    } catch (e) {
      commit(MutationTypes.SET_TOKEN_PRICES_STATUS, { value: LoadingState.ERROR });
      throw new EmerisError('Demeris:getTokenPrices', 'Could not perform API query.');
    }
    return getters['getTokenPrices'];
  },
  [ActionTypes.RESET_TOKEN_PRICES]({ commit }: APIActionContext): void {
    commit(MutationTypes.SET_TOKEN_PRICES, { value: [] });
  },

  // Coingecko Actions
  async [ActionTypes.GET_COINGECKO_ID_BY_NAMES](
    { commit, getters, rootGetters }: APIActionContext,
    { params }: Subscribable<ActionParams<EmerisAPI.TokenIdReq>>,
  ): Promise<any> {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    commit(MutationTypes.SET_COINGECKO_ID_STATUS, {
      value: LoadingState.LOADING,
    });
    try {
      const response: AxiosResponse<EmerisAPI.TokenIdResponse> = await axios.get(
        getters['getEndpoint'] + `/oracle/geckoid?names=${params.token}`,
      );
      commit(MutationTypes.SET_COINGECKO_ID, { params: params.token, value: response.data });
      commit(MutationTypes.SET_COINGECKO_ID_STATUS, { value: LoadingState.LOADED });
      return getters['getCoinGeckoId'];
    } catch (e) {
      commit(MutationTypes.SET_COINGECKO_ID_STATUS, { value: LoadingState.ERROR });
      console.error('Demeris:getCoinGeckoId: Could not perform API query.');
    }
  },
};
