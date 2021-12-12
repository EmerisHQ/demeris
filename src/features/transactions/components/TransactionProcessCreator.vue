<template>
  <div>
    <GobackWithClose
      v-if="action === 'swap'"
      :class="{ invisible: !['review', 'waitingPreviousTransaction'].some(state.matches) }"
      @goback="onBack"
      @close="handleCloseHeader"
    />
    <TransactionProcessViewer v-if="stepId" :step-id="stepId" @close="onClose" />
    <ConnectWalletModal
      :open="transactionsStore.isConnectWalletModalOpen"
      @close="transactionsStore.toggleConnectWalletModal"
    />
  </div>
</template>

<script lang="tsx" setup>
import { useActor } from '@xstate/vue';
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

const { state } = useActor(service);

const handleCloseHeader = () => transactionsStore.setTransactionAsPending();
const onClose = () => emits('close');
const onBack = () => {
  transactionsStore.removeTransaction(stepId);
  emits('close');
};

watch(isPending, (value) => {
  if (value) {
    emits('pending');
  }
});
</script>
