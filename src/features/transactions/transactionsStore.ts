import { defineStore } from 'pinia';
import { interpret } from 'xstate';

import { store as globalStore } from '@/store';
import { Step } from '@/types/actions';
import { Balance } from '@/types/api';
import { hashObject } from '@/utils/basic';

import { getCurrentTransaction, getSourceChainFromTransaction } from './transactionProcessHelpers';
import {
  TransactionProcessContext,
  transactionProcessMachine,
  TransactionProcessService,
} from './transactionProcessMachine';

type State = {
  transactions: Record<string, TransactionProcessService>;
  pending: Record<string, TransactionProcessService>;
  isBottomSheetMinimized: boolean;
  isViewerModalOpen: boolean;
  isConnectWalletModalOpen: boolean;
  currentId: string;
};

export const useTransactionsStore = defineStore('transactions', {
  state: () =>
    ({
      transactions: {},
      pending: {},
      isBottomSheetMinimized: true,
      isViewerModalOpen: false,
      isConnectWalletModalOpen: false,
      currentId: undefined,
    } as State),

  getters: {
    isPending: (state) => (stepId: string) => stepId in state.pending,
  },

  actions: {
    toggleBottomSheet() {
      this.isBottomSheetMinimized = !this.isBottomSheetMinimized;
    },

    toggleConnectWalletModal() {
      this.isConnectWalletModalOpen = !this.isConnectWalletModalOpen;
    },

    toggleViewerModal() {
      this.isViewerModalOpen = !this.isViewerModalOpen;
    },

    setCurrentId(id: string | undefined) {
      this.currentId = id;
    },

    setTransactionAsPending() {
      const stepId = this.currentId;
      if (!this.transactions[stepId] || this.pending[stepId]) {
        return;
      }

      this.pending = {
        [stepId]: this.transactions[stepId],
        ...this.pending,
      };
    },

    removeTransaction(stepId: string) {
      delete this.pending[stepId];
      delete this.transactions[stepId];
    },

    createTransactionMachine(action: string, steps: Step[], balances: Balance[]): [string, TransactionProcessService] {
      const stepId = `${hashObject(steps)}-${Date.now()}`;
      const pendingTransactions = this.pending;

      const service = interpret(
        transactionProcessMachine.withConfig({
          services: {
            async validatePreviousTransaction(context: TransactionProcessContext) {
              const currentTransaction = getCurrentTransaction(context);
              const currentSourceChain = getSourceChainFromTransaction(currentTransaction);

              const hasPendingInChain = Object.values(pendingTransactions).some((item: TransactionProcessService) => {
                const snapshot = item.getSnapshot();
                const itemTransaction = getCurrentTransaction(snapshot.context);
                const itemSourceChain = getSourceChainFromTransaction(itemTransaction);

                if (itemSourceChain === currentSourceChain) {
                  if (snapshot.done) {
                    return false;
                  }

                  if (snapshot.matches('receipt')) {
                    return false;
                  }

                  return true;
                }

                return false;
              });

              if (hasPendingInChain) {
                throw new Error(`Pending transaction in ${currentSourceChain}.`);
              }

              return Promise.resolve(true);
            },
          },
        }),
        { devTools: true },
      );

      service.start();
      service.send({
        type: 'SET_DATA',
        balances,
        action,
        steps,
        gasPriceLevel: globalStore.getters['demeris/getPreferredGasPriceLevel'],
        gasLimit: globalStore.getters['demeris/getGasLimit'],
      });

      service.subscribe((state) => {
        // Notify all waiting services when this completes
        if (state.done || state.matches('receipt')) {
          Object.values(this.transactions).forEach((itemService: TransactionProcessService) => {
            if (itemService.state.matches('waitingPreviousTransaction')) {
              itemService.send('VERIFY');
            }
          });
        }
      });

      this.transactions[stepId] = service;
      this.setCurrentId(stepId);

      return [stepId, service];
    },
  },
});
