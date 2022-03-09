import { defineStore } from 'pinia';

export const useEnvironment = defineStore('environment', {
  state: () => {
    return {
      endpoint: '',
      wsEndpoint: '',
      hub_chain: 'cosmos-hub',
      refreshTime: 5000,
      gas_limit: 500000,
    };
  },
});
