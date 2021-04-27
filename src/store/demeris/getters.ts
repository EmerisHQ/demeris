import { GetterTree } from 'vuex';
import { RootState } from '@/store';
import { State } from './state';
import * as API from '@/types/api';


export type Getters = {
  getBalances(state: State): {(params: API.APIRequests):Array<API.Balance>};
}

export const getters: GetterTree<State, RootState> & Getters = {
  getBalances: (state) => (params) => {
		return state.balances[JSON.stringify(params)] ?? [];
	}
};

