<template>
  <div class="flex items-center justify-center w-full">
    <TransferInterstitialConfirmation
      v-if="state.matches('ibcConfirmation')"
      :action="state.context.input.action"
      :steps="state.context.formattedSteps"
      class="max-w-lg"
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

    <template v-else-if="state.matches('feeWarning')">
      <ModalFeeWarning @close="goBack" />
      <ViewStateReview />
    </template>

    <ViewStateFailed v-else-if="state.matches('failed')" />
    <div v-else-if="state.matches('aborted')">Aborted</div>

    <div v-else class="flex flex-col items-center justify-center h-full w-full py-28">
      <Spinner :size="2.5" />
    </div>
  </div>

  <ModalCancel v-if="transactionsStore.isCancelModalOpen" />
</template>

<script lang="tsx" setup>
import { useActor } from '@xstate/vue';
import { computed, provide } from 'vue';

import Spinner from '@/components/ui/Spinner.vue';
import TransferInterstitialConfirmation from '@/components/wizard/TransferInterstitialConfirmation.vue';

import { isSwapAction, ProvideViewerKey } from '../transactionProcessHelpers';
import { TransactionProcessService } from '../transactionProcessMachine';
import { useTransactionsStore } from '../transactionsStore';
import ModalCancel from './TransactionProcessViewer/ModalCancel.vue';
import ModalChainDown from './TransactionProcessViewer/ModalChainDown.vue';
import ModalFeeWarning from './TransactionProcessViewer/ModalFeeWarning.vue';
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

const emits = defineEmits(['close', 'minimize', 'previous']);

const transactionsStore = useTransactionsStore();
const transactionService = computed(() => transactionsStore.transactions[props.stepId] as TransactionProcessService);
const isSwapComponent = computed(() => isSwapAction(state.value.context) && !transactionsStore.isViewerModalOpen);

const actor = useActor(transactionService);
const { state, send } = actor;

const minimizeModal = () => {
  transactionsStore.setTransactionAsPending();
  if (transactionsStore.isViewerModalOpen) {
    closeModal();
  }
};

const closeModal = () => emits('close');
const goBack = () => emits('previous');

const removeTransactionAndClose = () => {
  transactionsStore.removeTransaction(props.stepId);
  closeModal();
};

provide(ProvideViewerKey, {
  actor,
  closeModal,
  minimizeModal,
  removeTransactionAndClose,
  isSwapComponent,
  stepId: props.stepId,
});
</script>
