<template>
  <div>
    <GobackWithClose
      v-if="action === 'swap'"
      :class="{ invisible: !['review', 'waitingPreviousTransaction', 'ibcConfirmation'].some(state.matches) }"
      :show-close="!state.matches('ibcConfirmation')"
      class="relative z-10"
      @goback="
        () => {
          transactionsStore.removeTransaction(stepId);
          emits('close');
        }
      "
      @close="handleCloseHeader"
    />
    <TransactionProcessViewer v-if="stepId" :step-id="stepId" @close="onClose" @previous="onPrevious" />
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

const emits = defineEmits(['pending', 'close', 'previous']);

const transactionsStore = useTransactionsStore();

const { balances } = useAccount();
const [stepId, service] = transactionsStore.createTransaction({
  action: props.action,
  steps: props.steps,
  balances: balances.value,
});
const isPending = computed(() => transactionsStore.isPending(stepId));

const { state } = useActor(service);

const handleCloseHeader = () => transactionsStore.setTransactionAsPending();
const onClose = () => emits('close');
const onPrevious = () => emits('previous');

watch(isPending, (value) => {
  if (value) {
    emits('pending');
  }
});
</script>
