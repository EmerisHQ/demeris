import {
  APIState,
  GlobalActionTypes as GlobalActionTypesAPI,
  GlobalGetterTypes as GlobalGetterTypesAPI,
  module as moduleAPI,
  namespace as namespaceAPI,
  NamespacedAPIStore,
} from '@/store/demeris-api';
import {
  GlobalActionTypes as GlobalActionTypesTX,
  GlobalGetterTypes as GlobalGetterTypesTX,
  module as moduleTX,
  namespace as namespaceTX,
  NamespacedTXStore,
  TXState,
} from '@/store/demeris-tx';
import {
  GlobalActionTypes as GlobalActionTypesUSER,
  GlobalGetterTypes as GlobalGetterTypesUSER,
  module as moduleUSER,
  namespace as namespaceUSER,
  NamespacedUSERStore,
  USERState,
} from '@/store/demeris-user';

export type RootState = {
  [namespaceAPI]: APIState;
  [namespaceTX]: TXState;
  [namespaceUSER]: USERState;
  [key: string]: unknown;
};

import { Store as VuexStore } from 'vuex';
export type RootStore<S> = NamespacedAPIStore<S> & NamespacedTXStore<S> & NamespacedUSERStore<S>;

export type RootStoreTyped = RootStore<
  Pick<RootState, typeof namespaceAPI | typeof namespaceTX | typeof namespaceUSER>
>;
export type RootStoreUntyped = VuexStore<RootState>;

export const GlobalActionTypes = {
  TX: GlobalActionTypesTX,
  USER: GlobalActionTypesUSER,
  API: GlobalActionTypesAPI,
};
export const GlobalGetterTypes = {
  TX: GlobalGetterTypesTX,
  USER: GlobalGetterTypesUSER,
  API: GlobalGetterTypesAPI,
};

export { moduleAPI, moduleTX, moduleUSER };
