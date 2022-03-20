import { GetterTree } from 'vuex';

import { RootState } from '@/store';
import { Namespaced } from '@/types/util';

import { TXState } from './state';

export type Getters = Record<string, never>;

export type GlobalGetters = Namespaced<Getters, 'demerisTX'>;

export const getters: GetterTree<TXState, RootState> & Getters = {};
