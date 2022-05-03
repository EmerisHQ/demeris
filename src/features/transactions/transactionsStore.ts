/* eslint-disable max-lines-per-function */
import { EmerisAPI } from '@emeris/types';
import { defineStore } from 'pinia';
import { interpret } from 'xstate';

import { GlobalGetterTypes } from '@/store';
import { Step } from '@/types/actions';
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
  isPendingModalOpen: boolean;
  isRemoveModalOpen: boolean;
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
      isPendingModalOpen: false,
      isRemoveModalOpen: false,
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

    togglePendingModal() {
      this.isPendingModalOpen = !this.isPendingModalOpen;
    },

    toggleRemoveModal() {
      this.isRemoveModalOpen = !this.isRemoveModalOpen;
    },

    closeRemoveModal() {
      this.isRemoveModalOpen = false;
    },

    closePendingModal() {
      this.isPendingModalOpen = false;
    },

    toggleBottomSheet() {
      this.isBottomSheetMinimized = !this.isBottomSheetMinimized;
    },

    closeConnectWalletModal() {
      this.isConnectWalletModalOpen = false;
    },

    toggleConnectWalletModal() {
      this.isConnectWalletModalOpen = !this.isConnectWalletModalOpen;
    },

    toggleViewerModal() {
      this.isViewerModalOpen = !this.isViewerModalOpen;
    },

    getCurrentService(): TransactionProcessService {
      return this.transactions[this.currentId];
    },

    setCurrentId(id: string | undefined) {
      this.currentId = id;
    },

    setTransactionAsPending(stepId?: string) {
      const id = stepId || this.currentId;
      if (!this.transactions[id] || this.pending[id]) {
        return;
      }

      this.pending = {
        [id]: this.transactions[id],
        ...this.pending,
      };
    },

    removeTransactionFromPending(stepId: string) {
      delete this.pending[stepId];
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
      balances: EmerisAPI.Balance[];
      machine?: typeof transactionProcessMachine;
    }): [string, TransactionProcessService] {
      const globalStore = useStore();
      const stepId = `${hashObject(steps)}-${Date.now()}`;
      const allTransactions = () => this.transactions;

      let processMachine = machine;

      if (!processMachine) {
        processMachine = transactionProcessMachine.withConfig({
          services: {
            async validatePreviousTransaction(context: TransactionProcessContext) {
              const currentTransaction = getCurrentTransaction(context);
              const currentSourceChain = getSourceChainFromTransaction(currentTransaction);

              const hasPendingInChain = Object.values(allTransactions()).some((item: TransactionProcessService) => {
                const snapshot = item.getSnapshot();
                const itemTransaction = getCurrentTransaction(snapshot.context);
                const itemSourceChain = getSourceChainFromTransaction(itemTransaction);

                if (itemSourceChain === currentSourceChain) {
                  if (['transacting', 'signing'].some(snapshot.matches)) {
                    return true;
                  }

                  return false;
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
        balances: JSON.parse(JSON.stringify(balances)),
        action,
        steps,
        isDemoAccount: globalStore.getters[GlobalGetterTypes.USER.isDemoAccount],
        gasPriceLevel: globalStore.getters[GlobalGetterTypes.USER.getPreferredGasPriceLevel],
        gasLimit: globalStore.getters[GlobalGetterTypes.USER.getGasLimit],
      });

      service.subscribe((state) => {
        if (state.matches('signing.active')) {
          Object.values(allTransactions()).forEach((itemService: TransactionProcessService) => {
            if (['receipt', 'review'].some(itemService.state.matches)) {
              itemService.send('VERIFY_QUEUE');
            }
          });
        }

        // Notify all waiting services when this completes
        if (state.done || ['receipt', 'failed'].some(state.matches) || state.event.type === 'ABORT') {
          Object.values(allTransactions()).forEach((itemService: TransactionProcessService) => {
            if (itemService.state.matches('waitingPreviousTransaction')) {
              itemService.send('VERIFY_QUEUE');
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
