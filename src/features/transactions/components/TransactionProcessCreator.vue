<template>
  <TransactionProcessViewer v-if="stepHash" :step-hash="stepHash" />
</template>

<script lang="tsx" setup>
import { computed, watch } from '@vue/runtime-core';

import { useTransactionsStore } from '../transactionsStore';
import TransactionProcessViewer from './TransactionProcessViewer.vue';

const props = defineProps({
  steps: {
    type: Array,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(['pending']);

const transactionsStore = useTransactionsStore();
const [stepHash] = transactionsStore.findOrCreateTransactionMachine(props.action, props.steps);
const isPending = computed(() => transactionsStore.isPending(stepHash));

watch(isPending, (value) => {
  if (value) {
    emits('pending');
  }
});
</script>
