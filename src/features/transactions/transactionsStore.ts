import { defineStore } from 'pinia';
import { interpret } from 'xstate';

import { hashObject } from '@/utils/basic';

import { transactionProcessMachine } from './transactionProcessMachine';

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: {},
    pending: {},
    isBottomSheetMinimized: false,
  }),

  getters: {
    isPending: (state) => (stepHash: string) => stepHash in state.pending,
  },

  actions: {
    toggleBottomSheet() {
      this.isBottomSheetMinimized = !this.isBottomSheetMinimized;
    },

    removePendingTransaction(stepHash: string) {
      delete this.pending[stepHash];
    },

    findOrCreateTransactionMachine(action: string, steps: any[]): [string, any] {
      const stepHash = hashObject(steps);

      if (stepHash in this.transactions) {
        return [stepHash, this.transactions[stepHash]];
      }

      const service = interpret(
        transactionProcessMachine.withConfig({
          actions: {
            async validatePreviousTransaction() {
              return Promise.resolve(true);
            },
          },
        }),
        { devTools: true },
      );

      service.start();
      service.send({ type: 'SET_DATA', action, steps });

      const listener = service.subscribe((actor) => {
        // console.log(actor);
        if (actor.matches('transacting')) {
          this.pending[stepHash] = service;
          listener.unsubscribe();
        }
      });

      this.transactions[stepHash] = service;

      return [stepHash, service];
    },
  },
});
