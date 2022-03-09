import axios from 'axios';
import { defineStore } from 'pinia';

import * as API from '@/types/api';

import { useEnvironment } from './environment';

export const useDenoms = defineStore('denoms', {
  state: () => {
    return {
      verifiedDenoms: [] as API.VerifiedDenoms,
    };
  },
  actions: {
    async getVerified(params: { subscribe: boolean }) {
      const environment = useEnvironment();
      //axios.defaults.headers.get['X-Correlation-Id'] = store.getters['demerisUSER/getCorrelationId'];
      try {
        const response = await axios.get(environment.endpoint + '/verified_denoms');
        this.verifiedDenoms = response.data.verified_denoms;
      } catch (e) {
        throw new Error('Demeris:GetVerifiedDenoms: Could not perform API query.');
      }
      if (params.subscribe) {
        setTimeout(() => {
          this.getVerified({ subscribe: false });
        }, 5000);
      }
      return this.verifiedDenoms;
    },
  },
  getters: {
    isVerified: (state) => {
      return (name) => state.verifiedDenoms.find((x) => x.name == name)?.verified ?? false;
    },
    getTicker: (state) => {
      return (name) => state.verifiedDenoms.find((x) => x.name == name)?.ticker ?? null;
    },
    getDenomPrecision: (state) => {
      return (name) => state.verifiedDenoms.find((x) => x.name == name)?.precision ?? null;
    },
  },
});
