<template>
  <div>
    <GobackWithClose
      v-if="action === 'swap'"
      :class="{ invisible: service.state.matches('signing') }"
      @goback="emits('close')"
      @close="emits('close')"
    />
    <TransactionProcessViewer v-if="stepId" :step-id="stepId" @close="emits('close')" />
    <ConnectWalletModal
      :open="transactionsStore.isConnectWalletModalOpen"
      @close="transactionsStore.toggleConnectWalletModal"
    />
  </div>
</template>

<script lang="tsx" setup>
import { computed, PropType, watch } from 'vue';

import ConnectWalletModal from '@/components/account/ConnectWalletModal.vue';
import GobackWithClose from '@/components/common/headers/GobackWithClose.vue';
import useAccount from '@/composables/useAccount';
import { Step } from '@/types/actions';

import { useTransactionsStore } from '../transactionsStore';
import TransactionProcessViewer from './TransactionProcessViewer.vue';

const props = defineProps({
  steps: {
    type: Array as PropType<Step[]>,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(['pending', 'close']);

const transactionsStore = useTransactionsStore();

const { balances } = useAccount();
const [stepId, service] = transactionsStore.createTransactionMachine(props.action, props.steps, balances.value);
const isPending = computed(() => transactionsStore.isPending(stepId));

watch(isPending, (value) => {
  if (value) {
    emits('pending');
  }
});
</script>
