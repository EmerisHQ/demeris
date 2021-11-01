import { GetterTree } from 'vuex';

import { RootState } from '@/store';

import { State } from './state';

export type Getters = Record<string, never>;

export const getters: GetterTree<State, RootState> & Getters = {};
