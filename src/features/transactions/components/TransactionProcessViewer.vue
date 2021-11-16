<template>
  <div v-if="hasFoundService" class="flex items-center justify-center">
    <StateIBCConfirmation v-if="state.matches('ibcConfirmation')" />
    <StateReview v-else-if="state.matches('review')" />
    <StateSigning v-else-if="state.matches('signing')" />
    <StateTransacting v-else-if="state.matches('transacting')" />
    <StateReceipt v-else-if="state.matches('receipt') || state.matches('success')" />
    <StateFailed v-else-if="state.matches('failed')" />
    <div v-else-if="state.matches('aborted')">Aborted</div>
    <div v-else-if="state.matches('waitingPreviousTransaction')">Pending</div>
    <div v-else>Loading</div>
  </div>

  <div v-else>
    <h1>Not found</h1>
  </div>
</template>

<script lang="tsx" setup>
import { useActor } from '@xstate/vue';
import { computed, defineComponent, defineProps } from 'vue';

import Button from '@/components/ui/Button.vue';
import TransferInterstitialConfirmation from '@/components/wizard/TransferInterstitialConfirmation.vue';

import { useTransactionsStore } from '../transactionsStore';

const props = defineProps({
  stepHash: {
    type: String,
    default: undefined,
  },
});

const emits = defineEmits(['close']);

const transactionStore = useTransactionsStore();
const transactionService = computed(() => transactionStore.transactions[props.stepHash]);
const hasFoundService = computed(() => !!transactionService.value);

const { state, send } = useActor(transactionService.value);

const StateIBCConfirmation = defineComponent({
  name: 'StateIBConfirmation',
  setup() {
    return () => (
      <div>
        <TransferInterstitialConfirmation
          action={state.value.context.input.action}
          steps={state.value.context.input.steps}
          onContinue={() => send('CONTINUE')}
        />
      </div>
    );
  },
});

const StateReview = defineComponent({
  name: 'StateReview',
  setup() {
    return () => (
      <div>
        <h1>Review</h1>
        <button onClick={() => send('SIGN')}>Sign</button>
      </div>
    );
  },
});

const StateSigning = defineComponent({
  name: 'StateSigning',
  setup() {
    return () => <h2>Signing</h2>;
  },
});

const StateTransacting = defineComponent({
  name: 'StateTransacting',
  setup() {
    const onCancel = () => {
      send('ABORT');
    };

    return () => (
      <div>
        <h1>Transferring</h1>
        <p>This may take up to 1 minute.</p>
        {state.value.can('ABORT') && <Button onClick={onCancel}>Cancel</Button>}
      </div>
    );
  },
});

const StateReceipt = defineComponent({
  name: 'StateReceipt',
  setup() {
    const onDone = () => {
      transactionStore.removePendingTransaction(props.stepHash);
      emits('close');
    };

    const onNext = () => {
      send('CONTINUE');
    };

    return () => (
      <div>
        <h1>Receipt</h1>
        {state.value.matches('receipt') && <Button onClick={onNext}>Next</Button>}
        {state.value.matches('success') && <Button onClick={onDone}>Done</Button>}
      </div>
    );
  },
});

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
</script>
