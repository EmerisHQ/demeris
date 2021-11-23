<template>
  <div v-if="hasFoundService" class="flex items-center justify-center w-full">
    <TransferInterstitialConfirmation
      v-if="state.matches('ibcConfirmation')"
      :action="state.context.input.action"
      :steps="state.context.input.steps"
      @continue="() => send('CONTINUE')"
    />
    <ViewStateReview v-else-if="state.matches('review')" />
    <ViewStateSigning v-else-if="state.matches('signing')" />
    <ViewStateTransacting v-else-if="state.matches('transacting')" />
    <ViewStateReceipt v-else-if="state.matches('receipt') || state.matches('success')" />
    <ViewStateFailed v-else-if="state.matches('failed')" />
    <div v-else-if="state.matches('aborted')">Aborted</div>
    <ViewStateWaitingTransaction v-else-if="state.matches('waitingPreviousTransaction')" />
    <div v-else>Loading</div>
  </div>

  <div v-else>
    <h1>Not found</h1>
  </div>
</template>

<script lang="tsx" setup>
import { useActor } from '@xstate/vue';
import { computed, defineComponent, defineProps, provide } from 'vue';

import TransferInterstitialConfirmation from '@/components/wizard/TransferInterstitialConfirmation.vue';

import { TransactionProcessService } from '../transactionProcessMachine';
import { isSwapAction, ProvideViewerKey } from '../transactionProcessSelectors';
import { useTransactionsStore } from '../transactionsStore';
import ViewStateFailed from './TransactionProcessViewer/ViewStateFailed.vue';
import ViewStateReceipt from './TransactionProcessViewer/ViewStateReceipt.vue';
import ViewStateReview from './TransactionProcessViewer/ViewStateReview.vue';
import ViewStateSigning from './TransactionProcessViewer/ViewStateSigning.vue';
import ViewStateTransacting from './TransactionProcessViewer/ViewStateTransacting.vue';
import ViewStateWaitingTransaction from './TransactionProcessViewer/ViewStateWaitingTransaction.vue';

const props = defineProps({
  stepHash: {
    type: String,
    default: undefined,
  },
});

const emits = defineEmits(['close']);

const transactionStore = useTransactionsStore();
const transactionService = computed(() => transactionStore.transactions[props.stepHash] as TransactionProcessService);
const hasFoundService = computed(() => !!transactionService.value);
const isSwapComponent = computed(() => isSwapAction(state.value.context) && !transactionStore.isViewerModalOpen);

const actor = useActor(transactionService);
const { state, send } = actor;

const closeModal = () => emits('close');
const removeTransactionAndClose = () => {
  transactionStore.removePendingTransaction(props.stepHash);
  closeModal();
};

const StateFailed = defineComponent({
  name: 'StateFailed',
  setup() {
    const onAbort = () => {
      transactionStore.removePendingTransaction(props.stepHash);
      emits('close');
    };

    return () => (
      <div>
        <h1>Failed</h1>
        {state.value.can('ABORT') && <button onClick={onAbort}>Cancel</button>}
      </div>
    );
  },
});

provide(ProvideViewerKey, {
  actor,
  closeModal,
  removeTransactionAndClose,
  isSwapComponent,
  stepHash: props.stepHash,
});
</script>
