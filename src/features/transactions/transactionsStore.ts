import { useMachine } from '@xstate/vue';
import { defineStore } from 'pinia';

import { hashObject } from '@/utils/basic';

import { transactionsMachine } from './transactionsMachine';

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    pending: [],
  }),

  actions: {
    createTransactionMachine(action: string, steps: any[]) {
      const { service, send } = useMachine(transactionsMachine);
      const stepHash = hashObject(steps);
      send({ type: 'SET_DATA', action, steps });

      const listener = service.subscribe((actor) => {
        if (actor.matches('transacting')) {
          this.pending[stepHash] = service;
          listener.unsubscribe();
        }
      });

      return service;
    },
  },
});
