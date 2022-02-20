<template>
  <div class="max-w-5xl p-10 shadow-dropdown mt-20 mx-auto">
    <TransactionProcessViewer v-if="state.key" :step-id="state.key" />
  </div>
  <div class="flex items-center justify-center p-20 w-full space-x-6">
    <Button class="flex-1" @click="state.key = 'swap-success'">Swap Success</Button>
    <Button class="flex-1" @click="state.key = 'swap-partial'">Swap Partial</Button>
    <Button class="flex-1">Transfer</Button>
    <Button class="flex-1">Add Liquidity</Button>
    <Button class="flex-1">Withdraw Liquidity</Button>
  </div>
  <Toast
    :messages="testData"
    @onButton1Click="($event) => undo($event)"
    @onButton2Click="($event) => details($event)"
    @on-update="($event) => updateTestData($event)"
  />
  <button @click="addone()">add one</button>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { interpret, State } from 'xstate';

import SwapPartialFixture from '@/../tests/fixtures/transaction-process/swap-partial-osmo-cosmos.json';
import SwapSuccessFixture from '@/../tests/fixtures/transaction-process/swap-success-osmo-cosmos.json';
import Button from '@/components/ui/Button.vue';
import Toast from '@/components/ui/Toast/Toast.vue';
import TransactionProcessViewer from '@/features/transactions/components/TransactionProcessViewer.vue';
import { transactionProcessMachine } from '@/features/transactions/transactionProcessMachine';
import { useTransactionsStore } from '@/features/transactions/transactionsStore';

const state = reactive({
  key: undefined,
});

const transactionsStore = useTransactionsStore();
const customMachine = transactionProcessMachine.withConfig({
  services: {
    validateFees: () => Promise.resolve({ totals: [] }),
    validateChainStatus: () => Promise.resolve(),
    validatePreviousTransaction: () => Promise.resolve(),
    signTransaction: () => Promise.reject(),
  },
});

onMounted(() => {
  addService('swap-success', SwapSuccessFixture);
  addService('swap-partial', SwapPartialFixture);
});

const addService = (key: string, stateDefinition: any) => {
  const prevState = State.create(stateDefinition);
  // @ts-ignore
  const service = interpret(customMachine).start(prevState);
  // @ts-ignore
  transactionsStore.transactions[key] = service;
};

const testData = ref([]);
let i = 0;
for (i = 0; i < 10; i++) {
  if (i % 2 === 0) {
    testData.value.push({ message: `Transaction  ${i}`, action: '', date: '', id: i });
  } else {
    testData.value.push({ message: `Transaction asasdas dasd a sdas dasd item ${i}`, action: '', date: '', id: i });
  }
}
function undo(id) {
  console.log('undo id', id);
}
function details(id) {
  console.log('details id', id);
}
function addone() {
  i++;
  if (i % 2 === 0) {
    testData.value.push({ message: `Transaction  ${i}`, action: '', date: '', id: i });
  } else {
    testData.value.push({ message: `Transaction asasdas dasd a sdas dasd item ${i}`, action: '', date: '', id: i });
  }
}

function updateTestData($event) {
  console.log('updateTestData', $event);
  i = $event.length;
  testData.value = $event;
}
</script>
