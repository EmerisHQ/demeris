import { useActor } from '@xstate/vue';
import { defineStore } from 'pinia';

import * as logic from '../logic';
import { SwapService } from './machine';

interface SwapStoreState {
  selectAssetType: string;
  shownSettings: boolean;
  shownRoutes: boolean;
  service: SwapService;
  sync: {
    availableDenoms: string[];
  };
}

export const useSwapStore = defineStore('swap', {
  state: () =>
    ({
      selectAssetType: undefined,
      shownSettings: false,
      shownRoutes: false,
      service: undefined,
      sync: {
        availableDenoms: [],
      },
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

    async syncAvailableDenoms() {
      if (this.sync.availableDenoms.length > 0) {
        return this.sync.availableDenoms;
      }

      const data = await logic.fetchAvailableDenoms();
      this.sync.availableDenoms = data;
    },

    useSwapMachine() {
      return useActor(this.service as SwapService);
    },
  },
});
