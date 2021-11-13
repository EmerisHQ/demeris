import { Getter as VuexGetter,GetterTree } from 'vuex';

import { RootState } from '@/store';
import * as API from '@/types/api';

import { State } from './state';

export type GetterMapperSignature = {
  (params?: any): any;
};
export type GetterMapper<S = State> = {
  (state: S): GetterMapperSignature | any;
};

export type Getters<S = State> = Record<string, GetterMapper<S>>;

export const getters: GetterTree<State, RootState> & Getters = {};
