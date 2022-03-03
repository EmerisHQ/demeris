import { InjectionKey } from 'vue'
import { createStore, Store as VuexStore, useStore as baseUseStore } from 'vuex'

import {
  DemerisStore as DemerisStoreAPI,
  GlobalDemerisActionTypes as GlobalDemerisActionTypesAPI,
  module as moduleAPI,
  namespace as namespaceAPI,
} from '@/store/demeris-api'
import { DemerisStore as DemerisStoreTX, module as moduleTX, namespace as namespaceTX } from '@/store/demeris-tx'
import {
  DemerisStore as DemerisStoreUSER,
  module as moduleUSER,
  namespace as namespaceUSER,
} from '@/store/demeris-user'

import init from './config'
import { RootState } from './index'

export type RootStore<S> = DemerisStoreAPI<S> & DemerisStoreTX<S> & DemerisStoreUSER<S>

export type RootStoreType = RootStore<Pick<RootState, typeof namespaceAPI | typeof namespaceTX | typeof namespaceUSER>>

export type TypedAPIStore = DemerisStoreAPI<Pick<RootState, typeof namespaceAPI>>
export type TypedUSERStore = DemerisStoreUSER<Pick<RootState, typeof namespaceUSER>>
export type TypedTXStore = DemerisStoreTX<Pick<RootState, typeof namespaceTX>>

export const key: InjectionKey<VuexStore<RootState>> = Symbol()
// add all modules to vuex
const initstore = createStore<RootState>({
  modules: {
    // the name in this dictionary reflects the namespace of the store
    [namespaceAPI]: moduleAPI,
    [namespaceTX]: moduleTX,
    [namespaceUSER]: moduleUSER,
  },
})

// add library modules
init(initstore as RootStoreType)

initstore.subscribe((mutation) => {
  if (mutation.type == 'tendermint.liquidity.v1beta1/QUERY' && mutation.payload.query == 'LiquidityPools') {
    initstore.dispatch(GlobalDemerisActionTypesAPI.VALIDATE_POOLS, mutation.payload.value.pools)
  }
})

//Module typed exports
export const store = initstore as VuexStore<any>
export const apistore: TypedAPIStore = initstore as TypedAPIStore
export const userstore: TypedUSERStore = initstore as TypedUSERStore
export const txstore: TypedTXStore = initstore as TypedTXStore

//Composition API exports
export function useStore(): VuexStore<any> {
  return baseUseStore(key) as VuexStore<any>
}
export function useEmerisAPIStore(): TypedAPIStore {
  return baseUseStore(key) as TypedAPIStore
}
export function useEmerisUSERStore(): TypedUSERStore {
  return baseUseStore(key) as TypedUSERStore
}
export function useEmerisTXStore(): TypedTXStore {
  return baseUseStore(key) as TypedTXStore
}
