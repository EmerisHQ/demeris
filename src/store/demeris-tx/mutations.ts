import { MutationTree } from 'vuex';

import { MutationTypes } from './mutation-types';
import { getDefaultState, TXState } from './state';

//export type MutationCallSigature<S = State> = {
//  (state: S, payload?: any, subscription?: DemerisSubscriptions): void;
//};
//export type Mutations<S = State> = Record<MutationTypes, MutationCallSigature>;

export type Mutations<S = TXState> = {
  [MutationTypes.RESET_STATE](state: S): void;
};

export const mutations: MutationTree<TXState> & Mutations = {
  [MutationTypes.RESET_STATE](state: TXState) {
    Object.assign(state, getDefaultState());
  },
};
