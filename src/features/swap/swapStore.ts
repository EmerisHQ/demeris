import { useActor } from '@xstate/vue';
import { defineStore } from 'pinia';

export const useSwapStore = defineStore('swap', {
  state: () => ({
    selectAssetType: undefined,
    shownSettings: false,
    shownRoutes: false,
    machineActor: undefined,
  }),

  getters: {
    shownAssetMenu: (state) => !!state.selectAssetType,
  },

  actions: {
    openAssetsMenu(type: 'deposit' | 'receive') {
      this.selectAssetType = type;
    },

    closeAssetsMenu() {
      this.selectAssetType = undefined;
    },

    setActor(actor: any) {
      this.machineActor = actor;
    },

    toggleSettings() {
      this.shownSettings = !this.shownSettings;
    },

    toggleRoutes() {
      this.shownRoutes = !this.shownRoutes;
    },

    useSwapMachine() {
      return useActor(this.machineActor);
    },
  },
});
