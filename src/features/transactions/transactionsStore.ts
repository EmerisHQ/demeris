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
  selectedId: string;
};

export const useTransactionsStore = defineStore('transactions', {
  state: () =>
    ({
      transactions: {},
      pending: {},
      isBottomSheetMinimized: false,
      isConnectWalletModalOpen: false,
      selectedId: undefined,
    } as State),

  getters: {
    isPending: (state) => (stepId: string) => stepId in state.pending,
    isViewerModalOpen: (state) => !!state.selectedId,
  },

  actions: {
    toggleBottomSheet() {
      this.isBottomSheetMinimized = !this.isBottomSheetMinimized;
    },

    toggleConnectWalletModal() {
      this.isConnectWalletModalOpen = !this.isConnectWalletModalOpen;
    },

    setSelectedId(selectedId: string | undefined) {
      this.selectedId = selectedId;
    },

    removePendingTransaction(stepId: string) {
      delete this.pending[stepId];
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
        // Add transaction to the floating widget list
        if (state.matches('transacting') || state.matches('waitingPreviousTransaction')) {
          if (!(stepId in this.pending)) {
            this.pending = {
              [stepId]: service,
              ...this.pending,
            };
          }
        }

        // Notify all waiting services when this completes
        if (state.done) {
          Object.values(this.pending).forEach((itemService: TransactionProcessService) => {
            if (itemService.state.matches('waitingPreviousTransaction')) {
              itemService.send('CONTINUE');
            }
          });
        }
      });

      this.transactions[stepId] = service;

      return [stepId, service];
    },
  },
});
