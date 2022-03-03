import { MutationTree } from 'vuex'

import { DemerisSubscriptions } from './action-types'
import { DemerisMutationTypes as MutationTypes } from './mutation-types'
import { getDefaultState, State } from './state'

//export type MutationCallSigature<S = State> = {
//  (state: S, payload?: any, subscription?: DemerisSubscriptions): void;
//};
//export type Mutations<S = State> = Record<MutationTypes, MutationCallSigature>;

export type Mutations<S = State> = {
  [MutationTypes.RESET_STATE](state: S): void
  [MutationTypes.SUBSCRIBE](state: S, subscription: DemerisSubscriptions): void
  [MutationTypes.UNSUBSCRIBE](state: S, subscription: DemerisSubscriptions): void
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.RESET_STATE](state: State) {
    Object.assign(state, getDefaultState())
  },
  [MutationTypes.SUBSCRIBE](state: State, subscription) {
    state._Subscriptions.add(JSON.stringify(subscription))
  },
  [MutationTypes.UNSUBSCRIBE](state: State, subscription) {
    state._Subscriptions.delete(JSON.stringify(subscription))
  },
}
