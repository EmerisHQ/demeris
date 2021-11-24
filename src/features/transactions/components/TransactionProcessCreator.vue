<template>
  <div>
    <GobackWithClose
      v-if="action === 'swap'"
      :class="{ invisible: service.state.matches('signing') }"
      @goback="emits('close')"
      @close="emits('close')"
    />
    <TransactionProcessViewer v-if="stepId" :step-id="stepId" />
    <ConnectWalletModal
      :open="transactionsStore.isConnectWalletModalOpen"
      @close="transactionsStore.toggleConnectWalletModal"
    />
  </div>
</template>

<script lang="tsx" setup>
import { computed, watch } from '@vue/runtime-core';

import ConnectWalletModal from '@/components/account/ConnectWalletModal.vue';
import GobackWithClose from '@/components/common/headers/GobackWithClose.vue';

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

const emits = defineEmits(['pending', 'close']);

const transactionsStore = useTransactionsStore();

const [stepId, service] = transactionsStore.createTransactionMachine(props.action, props.steps);
const isPending = computed(() => transactionsStore.isPending(stepId));

watch(isPending, (value) => {
  if (value) {
    emits('pending');
  }
});
</script>
