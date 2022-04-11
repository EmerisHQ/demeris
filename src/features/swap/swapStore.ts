import { useActor } from '@xstate/vue';
import { defineStore } from 'pinia';

import { SwapService } from './swapMachine';

interface SwapStoreState {
  selectAssetType: string;
  shownSettings: boolean;
  shownRoutes: boolean;
  service: SwapService;
}

export const useSwapStore = defineStore('swap', {
  state: () =>
    ({
      selectAssetType: undefined,
      shownSettings: false,
      shownRoutes: false,
      service: undefined,
    } as SwapStoreState),

  getters: {
    shownAssetMenu: (state) => !!state.selectAssetType,
  },

  actions: {
    openAssetsMenu(type: 'input' | 'output') {
      this.selectAssetType = type;
    },

    closeAssetsMenu() {
      this.selectAssetType = undefined;
    },

    setService(actor: any) {
      this.service = actor;
    },

    toggleSettings() {
      this.shownSettings = !this.shownSettings;
    },

    toggleRoutes() {
      this.shownRoutes = !this.shownRoutes;
    },

    useSwapMachine() {
      return useActor(this.service as SwapService);
    },
  },
});
