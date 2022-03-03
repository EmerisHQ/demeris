import { defineStore } from 'pinia'
import { interpret } from 'xstate'

import { GlobalDemerisGetterTypes } from '@/store'
import { Step } from '@/types/actions'
import { Balance } from '@/types/api'
import { hashObject } from '@/utils/basic'
import { useStore } from '@/utils/useStore'

import { getCurrentTransaction, getSourceChainFromTransaction } from './transactionProcessHelpers'
import {
  TransactionProcessContext,
  transactionProcessMachine,
  TransactionProcessService,
} from './transactionProcessMachine'

type State = {
  transactions: Record<string, TransactionProcessService>
  pending: Record<string, TransactionProcessService>
  isBottomSheetMinimized: boolean
  isViewerModalOpen: boolean
  isConnectWalletModalOpen: boolean
  isCancelModalOpen: boolean
  isPendingModalOpen: boolean
  hasShownNotification: boolean
  currentId: string
}

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
      hasShownNotification: false,
      currentId: undefined,
    } as State),

  getters: {
    isPending: (state) => (stepId: string) => stepId in state.pending,
  },

  actions: {
    toggleCancelModal() {
      this.isCancelModalOpen = !this.isCancelModalOpen
    },

    togglePendingModal() {
      this.isPendingModalOpen = !this.isPendingModalOpen
    },

    closePendingModal() {
      this.isPendingModalOpen = false
    },

    toggleBottomSheet() {
      this.isBottomSheetMinimized = !this.isBottomSheetMinimized
    },

    toggleConnectWalletModal() {
      this.isConnectWalletModalOpen = !this.isConnectWalletModalOpen
    },

    toggleViewerModal() {
      this.isViewerModalOpen = !this.isViewerModalOpen
    },

    getCurrentService(): TransactionProcessService {
      return this.transactions[this.currentId]
    },

    setCurrentId(id: string | undefined) {
      this.currentId = id
    },

    setTransactionAsPending() {
      const stepId = this.currentId
      if (!this.transactions[stepId] || this.pending[stepId]) {
        return
      }

      this.pending = {
        [stepId]: this.transactions[stepId],
        ...this.pending,
      }
    },

    removeTransactionFromPending(stepId: string) {
      delete this.pending[stepId]
    },

    removeTransaction(stepId: string) {
      delete this.pending[stepId]
      delete this.transactions[stepId]
    },

    createTransaction({
      action,
      steps,
      balances,
      machine,
    }: {
      action: string
      steps: Step[]
      balances: Balance[]
      machine?: typeof transactionProcessMachine
    }): [string, TransactionProcessService] {
      const globalStore = useStore()
      const stepId = `${hashObject(steps)}-${Date.now()}`
      const allTransactions = () => this.transactions

      let processMachine = machine

      if (!processMachine) {
        processMachine = transactionProcessMachine.withConfig({
          services: {
            async validatePreviousTransaction(context: TransactionProcessContext) {
              const currentTransaction = getCurrentTransaction(context)
              const currentSourceChain = getSourceChainFromTransaction(currentTransaction)

              const hasPendingInChain = Object.values(allTransactions()).some((item: TransactionProcessService) => {
                const snapshot = item.getSnapshot()
                const itemTransaction = getCurrentTransaction(snapshot.context)
                const itemSourceChain = getSourceChainFromTransaction(itemTransaction)

                if (itemSourceChain === currentSourceChain) {
                  if (['transacting', 'signing'].some(snapshot.matches)) {
                    return true
                  }

                  return false
                }

                return false
              })

              if (hasPendingInChain) {
                throw new Error(`Pending transaction in ${currentSourceChain}.`)
              }

              return Promise.resolve(true)
            },
          },
        })
      }

      const service = interpret(processMachine)

      service.start()
      service.send({
        type: 'SET_DATA',
        balances,
        action,
        steps,
        gasPriceLevel: globalStore.getters[GlobalDemerisGetterTypes.USER.getPreferredGasPriceLevel],
        gasLimit: globalStore.getters[GlobalDemerisGetterTypes.USER.getGasLimit],
      })

      service.subscribe(function (state) {
        if (state.matches('signing.active')) {
          Object.values(allTransactions()).forEach((itemService: TransactionProcessService) => {
            if (['receipt', 'review'].some(itemService.state.matches)) {
              itemService.send('VERIFY_QUEUE')
            }
          })
        }

        // Notify all waiting services when this completes
        if (state.done || state.matches('receipt') || state.matches('failed')) {
          Object.values(allTransactions()).forEach((itemService: TransactionProcessService) => {
            if (itemService.state.matches('waitingPreviousTransaction')) {
              itemService.send('VERIFY_QUEUE')
            }
          })
        }
      })

      this.transactions[stepId] = service
      this.setCurrentId(stepId)

      return [stepId, service]
    },
  },
})
