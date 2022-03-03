import { GetterTree } from 'vuex'

import { RootState } from '@/store'

import { State } from './state'

export type GetterMapperSignature = {
  (params?: any): any
}
type Namespaced<T, N extends string> = {
  [P in keyof T & string as `${N}/${P}`]: T[P]
}
export type GetterMapper<S = State> = {
  (state: S): GetterMapperSignature | any
}

export type Getters<S = State> = Record<string, GetterMapper<S>>

export type GlobalGetters = Namespaced<Getters, 'demerisTX'>
export const getters: GetterTree<State, RootState> & Getters = {}
