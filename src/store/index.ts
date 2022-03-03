import {
  DemerisStore as DemerisStoreAPI,
  GlobalDemerisActionTypes as GlobalDemerisActionTypesAPI,
  GlobalGetterTypes as GlobalGetterTypesAPI,
  module as moduleAPI,
  namespace as namespaceAPI,
  State as StateAPI,
} from '@/store/demeris-api'
import {
  DemerisStore as DemerisStoreTX,
  GlobalDemerisActionTypes as GlobalDemerisActionTypesTX,
  GlobalGetterTypes as GlobalGetterTypesTX,
  module as moduleTX,
  namespace as namespaceTX,
  State as StateTX,
} from '@/store/demeris-tx'
import {
  DemerisStore as DemerisStoreUSER,
  GlobalDemerisActionTypes as GlobalDemerisActionTypesUSER,
  GlobalGetterTypes as GlobalGetterTypesUSER,
  module as moduleUSER,
  namespace as namespaceUSER,
  State as StateUSER,
} from '@/store/demeris-user'

export type RootState = {
  [namespaceAPI]: StateAPI
  [namespaceTX]: StateTX
  [namespaceUSER]: StateUSER
  [key: string]: unknown
}

export type RootStore<S> = DemerisStoreAPI<S> & DemerisStoreTX<S> & DemerisStoreUSER<S>

export type RootStoreType = RootStore<Pick<RootState, typeof namespaceAPI | typeof namespaceTX | typeof namespaceUSER>>

export type TypedAPIStore = DemerisStoreAPI<Pick<RootState, typeof namespaceAPI>>
export type TypedUSERStore = DemerisStoreUSER<Pick<RootState, typeof namespaceUSER>>
export type TypedTXStore = DemerisStoreTX<Pick<RootState, typeof namespaceTX>>

export const GlobalDemerisActionTypes = {
  TX: GlobalDemerisActionTypesTX,
  USER: GlobalDemerisActionTypesUSER,
  API: GlobalDemerisActionTypesAPI,
}
export const GlobalDemerisGetterTypes = {
  TX: GlobalGetterTypesTX,
  USER: GlobalGetterTypesUSER,
  API: GlobalGetterTypesAPI,
}

export { moduleAPI, moduleTX, moduleUSER }
