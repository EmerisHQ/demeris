import { useMachine } from '@xstate/vue';
import { defineStore } from 'pinia';

import { transactionsMachine } from './transactionsMachine';

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    pending: {},
  }),

  actions: {
    createTransactionMachine(action: string, steps: any[]) {
      const { service, send } = useMachine(transactionsMachine);
      send({ type: 'SET_DATA', action, steps });

      this.pending = {
        ...this.pending,
        ['new']: service,
      };

      return service;
    },
  },
});
