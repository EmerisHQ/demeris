<template>
  <div class="flex items-center justify-center p-20 w-full space-x-6">
    <div class="p-10 shadow-dropdown w-1/3">
      <TransactionProcessViewer v-if="state.steps.length" :step-id="state.steps[0]" />
      <Button>Swap</Button>
    </div>

    <Button class="flex-1">Transfer</Button>
    <Button class="flex-1">Add Liquidity</Button>
    <Button class="flex-1">Withdraw Liquidity</Button>
  </div>

  <TransactionsCenter />

  <Modal v-if="state.isOpen" variant="full" fullscreen show-close-button @close="state.isOpen = false">
    <div class="p-20 w-full flex items-center justify-center">Hello</div>
  </Modal>
</template>

<script type="ts" setup>
import { onMounted,reactive } from "vue";

import Button from "@/components/ui/Button.vue";
import Modal from '@/components/ui/Modal.vue';
import TransactionProcessViewer from '@/features/transactions/components/TransactionProcessViewer.vue';
import TransactionsCenter from '@/features/transactions/components/TransactionsCenter.vue';
import {transactionProcessMachine} from '@/features/transactions/transactionProcessMachine';
import {useTransactionsStore} from '@/features/transactions/transactionsStore';

const state = reactive({
  isOpen: false,
  steps: []
})

const transactionsStore = useTransactionsStore()
const customMachine = transactionProcessMachine.withConfig({
  services: {
    validateFees: () => Promise.resolve({ totals: [] }),
    validateChainStatus: () => Promise.resolve(),
    validatePreviousTransaction: () => Promise.resolve(),
    signTransaction: () => Promise.reject()
  }
})

onMounted(() => {
  state.steps.push(transactionsStore.createTransaction({
    action: 'swap',
    steps: [{
      name: 'swap',
      description: '',
      transactions: [{
        name: 'swap',
        data: {
          from: {
            denom: 'uatom',
            amount: 10
          },
          to: {
            denom: 'uosmo',
            amount: 1
          },
          pool: { id: 1 }
        }
      }]
    }],
    balances: [
      {
        amount: '1000uatom',
        base_denom: 'uatom',
        verified: true
      }
    ],
    machine: customMachine
  })[0])
})
</script>
