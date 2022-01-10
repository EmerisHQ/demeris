import { defineStore } from 'pinia';
import { interpret } from 'xstate';

import { GlobalDemerisGetterTypes } from '@/store';
import { Step } from '@/types/actions';
import { Balance } from '@/types/api';
import { hashObject } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

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
  isCancelModalOpen: boolean;
  hasShownNotification: boolean;
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
      isCancelModalOpen: false,
      hasShownNotification: false,
      currentId: undefined,
    } as State),

  getters: {
    isPending: (state) => (stepId: string) => stepId in state.pending,
  },

  actions: {
    toggleCancelModal() {
      this.isCancelModalOpen = !this.isCancelModalOpen;
    },

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

    createTransaction({
      action,
      steps,
      balances,
      machine,
    }: {
      action: string;
      steps: Step[];
      balances: Balance[];
      machine?: typeof transactionProcessMachine;
    }): [string, TransactionProcessService] {
      const globalStore = useStore();
      const stepId = `${hashObject(steps)}-${Date.now()}`;
      const pendingTransactions = this.pending;

      let processMachine = machine;

      if (!processMachine) {
        processMachine = transactionProcessMachine.withConfig({
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

                  if (['receipt', 'failed'].some(snapshot.matches)) {
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
        });
      }

      const service = interpret(processMachine);

      service.start();
      service.send({
        type: 'SET_DATA',
        balances,
        action,
        steps,
        gasPriceLevel: globalStore.getters[GlobalDemerisGetterTypes.USER.getPreferredGasPriceLevel],
        gasLimit: globalStore.getters[GlobalDemerisGetterTypes.USER.getGasLimit],
      });

      service.subscribe((state) => {
        // Notify all waiting services when this completes
        if (state.done || state.matches('receipt') || state.matches('failed')) {
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
