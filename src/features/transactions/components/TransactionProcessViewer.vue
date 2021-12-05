<template>
  <div class="flex items-center justify-center w-full">
    <TransferInterstitialConfirmation
      v-if="state.matches('ibcConfirmation')"
      :action="state.context.input.action"
      :steps="state.context.formattedSteps"
      @continue="() => send('CONTINUE')"
    />
    <ViewStateReview v-else-if="state.matches('review')" />
    <ViewStateSigning v-else-if="state.matches('signing')" />
    <ViewStateTransacting v-else-if="state.matches('transacting')" />
    <ViewStateReceipt v-else-if="state.matches('receipt') || state.matches('success')" />
    <ViewStateWaitingTransaction v-else-if="state.matches('waitingPreviousTransaction')" />

    <template v-else-if="state.matches('failed.chainStatus')">
      <ModalChainDown />
      <ViewStateReview />
    </template>

    <ViewStateFailed v-else-if="state.matches('failed')" />
    <div v-else-if="state.matches('aborted')">Aborted</div>

    <div v-else class="flex flex-col items-center justify-center h-full w-full py-28">
      <Spinner :size="2.5" />
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { useActor } from '@xstate/vue';
import { computed, defineProps, provide } from 'vue';

import Spinner from '@/components/ui/Spinner.vue';
import TransferInterstitialConfirmation from '@/components/wizard/TransferInterstitialConfirmation.vue';

import { isSwapAction, ProvideViewerKey } from '../transactionProcessHelpers';
import { TransactionProcessService } from '../transactionProcessMachine';
import { useTransactionsStore } from '../transactionsStore';
import ModalChainDown from './TransactionProcessViewer/ModalChainDown.vue';
import ViewStateFailed from './TransactionProcessViewer/ViewStateFailed.vue';
import ViewStateReceipt from './TransactionProcessViewer/ViewStateReceipt.vue';
import ViewStateReview from './TransactionProcessViewer/ViewStateReview.vue';
import ViewStateSigning from './TransactionProcessViewer/ViewStateSigning.vue';
import ViewStateTransacting from './TransactionProcessViewer/ViewStateTransacting.vue';
import ViewStateWaitingTransaction from './TransactionProcessViewer/ViewStateWaitingTransaction.vue';

const props = defineProps({
  stepId: {
    type: String,
    default: undefined,
  },
});

const emits = defineEmits(['close']);

const transactionStore = useTransactionsStore();
const transactionService = computed(() => transactionStore.transactions[props.stepId] as TransactionProcessService);
const isSwapComponent = computed(() => isSwapAction(state.value.context) && !transactionStore.isViewerModalOpen);

const actor = useActor(transactionService);
const { state, send } = actor;

const closeModal = () => emits('close');
const removeTransactionAndClose = () => {
  transactionStore.removePendingTransaction(props.stepId);
  closeModal();
};

provide(ProvideViewerKey, {
  actor,
  closeModal,
  removeTransactionAndClose,
  isSwapComponent,
  stepId: props.stepId,
});
</script>
