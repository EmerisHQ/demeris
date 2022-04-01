import { RootState } from '@/store';

import { RootStoreTyped } from '../../';
import { APIStore } from '../';
import { APIState } from '../state';

export type APIActionContext = {
  dispatch: Pick<APIStore<APIState>, 'dispatch'>['dispatch'] & Pick<RootStoreTyped, 'dispatch'>['dispatch'];
  commit: Pick<APIStore<APIState>, 'commit'>['commit'];
  state: APIState;
  getters: Pick<APIStore<APIState>, 'getters'>['getters'];
  rootState: RootState;
  rootGetters: Pick<RootStoreTyped, 'getters'>['getters'];
};
