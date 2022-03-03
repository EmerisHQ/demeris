<template>
  <div class="flex-1 flex flex-col w-full" :class="{ 'items-center': !isSwapComponent }">
    <TransferInterstitialConfirmation
      v-if="showTransferInterstitialConfirmationState"
      :action="state.context.input.action"
      :steps="state.context.formattedSteps"
      :is-swap-component="isSwapComponent"
      class="max-w-lg"
      @continue="() => send('CONTINUE')"
    />
    <ViewStateReview v-else-if="showReviewState" />
    <ViewStateSigning v-else-if="showSigningState" />
    <ViewStateTransacting v-else-if="showTransactingState" />
    <ViewStateReceipt v-else-if="showReceiptState" />
    <ViewStateWaitingTransaction v-else-if="showWaitingPreviousTransactionState" />

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
  <ModalPendingTransaction v-if="transactionsStore.isPendingModalOpen" />
  <ModalRemove v-if="transactionsStore.isRemoveModalOpen" @undo="emit('undo')" />
</template>

<script lang="ts" setup>
import { useActor } from '@xstate/vue';
import { computed, nextTick, provide, watch } from 'vue';

import Spinner from '@/components/ui/Spinner.vue';
import TransferInterstitialConfirmation from '@/components/wizard/TransferInterstitialConfirmation.vue';

import { isSwapAction, ProvideViewerKey } from '../transactionProcessHelpers';
import { TransactionProcessService } from '../transactionProcessMachine';
import { useTransactionsStore } from '../transactionsStore';
import ModalCancel from './TransactionProcessViewer/ModalCancel.vue';
import ModalChainDown from './TransactionProcessViewer/ModalChainDown.vue';
import ModalFeeWarning from './TransactionProcessViewer/ModalFeeWarning.vue';
import ModalPendingTransaction from './TransactionProcessViewer/ModalPendingTransaction.vue';
import ModalRemove from './TransactionProcessViewer/ModalRemove.vue';
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

const emit = defineEmits(['close', 'minimize', 'previous', 'onReceiptState', 'undo']);

const transactionsStore = useTransactionsStore();
const transactionService = computed(() => transactionsStore.transactions[props.stepId] as TransactionProcessService);
const isSwapComponent = computed(
  () =>
    isSwapAction(state.value.context) && !transactionsStore.isViewerModalOpen && !transactionsStore.isPendingModalOpen,
);

const actor = useActor(transactionService);
const { state, send } = actor;

const minimizeModal = () => {
  transactionsStore.setTransactionAsPending();

  if (transactionsStore.isPendingModalOpen) {
    transactionsStore.closePendingModal();
  }

  if (transactionsStore.isViewerModalOpen) {
    closeModal();
  }
};

watch(
  () => state.value,
  (newState) => {
    if (newState.matches('receipt') || newState.matches('success')) {
      emit('onReceiptState');
    }
  },
);

const showTransferInterstitialConfirmationState = computed(() => state.value.matches('ibcConfirmation'));
const showReviewState = computed(() => state.value.matches('review'));
const showSigningState = computed(() => state.value.matches('signing'));
const showTransactingState = computed(() => state.value.matches('transacting'));
const showWaitingPreviousTransactionState = computed(() => state.value.matches('waitingPreviousTransaction'));
const showReceiptState = computed(() => state.value.matches('receipt') || state.value.matches('success'));

const closeModal = (payload?) => emit('close', payload);
const goBack = () => emit('previous');

const removeTransactionAndClose = (payload) => {
  closeModal(payload);
  nextTick(() => transactionsStore.removeTransaction(props.stepId));
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
