<template>
  <button class="flex w-full items-center hover:bg-fg" :class="hideControls ? 'space-x-3' : 'space-x-4'">
    <div>
      <StateIcon />
    </div>

    <div class="flex-1 text-left flex flex-col">
      <p class="font-medium"><StateTitle /></p>
      <p class="-text-1 opacity-60"><StateDescription /></p>
    </div>

    <div>
      <StateControls v-if="!hideControls" />
    </div>
  </button>
</template>

<script lang="tsx" setup>
import { defineComponent } from '@vue/runtime-core';
import { useActor } from '@xstate/vue';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import Spinner from '@/components/ui/Spinner.vue';
import { IBCForwardsData, SwapData, TransferData } from '@/types/actions';

import {
  getCurrentTransaction,
  getCurrentTransactionOffset,
  getTransactionsLength,
} from '../transactionProcessSelectors';

const props = defineProps({
  service: {
    type: Object,
    required: true,
  },
  hideControls: {
    type: Boolean,
    default: false,
  },
});
// @ts-ignore
const { state, send } = useActor(props.service);

const StateIcon = defineComponent({
  name: 'StateIcon',
  setup() {
    return () => {
      const iconResult = {
        failed: <Icon name="WarningTriangleIcon" class="text-negative" />,
        success: <Icon name="SuccessIcon" class="text-positive" />,
        waitingPreviousTransaction: <Icon name="TimeIcon" class="opacity-60" />,
      };

      if (state.value.value in iconResult) {
        return iconResult[state.value.value];
      }

      if (state.value.matches('review')) {
        const transaction = getCurrentTransaction(state.value.context);
        const name = transaction.name;

        if (name === 'transfer' || name.startsWith('ibc')) {
          const denom = (transaction.data as TransferData).amount.denom;
          const chain =
            (transaction.data as TransferData).chain_name || (transaction.data as IBCForwardsData).from_chain;

          return <CircleSymbol denom={denom} chainName={chain} size="sm" />;
        }

        if (name === 'swap') {
          const denom = (transaction.data as SwapData).to.denom;
          return <CircleSymbol denom={denom} size="sm" />;
        }
      }

      if (state.value.matches('transacting') || state.value.matches('validating')) {
        return (
          <div style="transform: scale(0.5)">
            <Spinner size={2.5} />
          </div>
        );
      }

      return <Icon name="ExclamationIcon" class="text-warning" />;
    };
  },
});

const StateDescription = defineComponent({
  name: 'StateDescription',
  setup() {
    const textResultMap = {
      validating: 'Preparing transaction...',
      transacting: 'Transaction in progress...',
      waitingPreviousTransaction: 'Pending',
      success: 'Transaction completed',
      'failed.sign': 'Transaction not signed',
      'failed.confirmation': 'Transaction failed',
    };

    const transactionsLength = getTransactionsLength(state.value.context);
    const transactionOffset = getCurrentTransactionOffset(state.value.context) + 1;

    return () => {
      if (state.value.value in textResultMap) {
        return <p>{textResultMap[state.value.value]}</p>;
      }

      if (state.value.matches('review')) {
        return (
          <p>
            Sign in Keplr
            {transactionsLength > 1 && (
              <span>
                &nbsp;({transactionOffset}/{transactionsLength})
              </span>
            )}
          </p>
        );
      }

      if (state.value.matches('receipt')) {
        return (
          <p>
            Partially completed ({transactionOffset}/{transactionsLength})
          </p>
        );
      }
    };
  },
});

const StateControls = defineComponent({
  name: 'StateControls',
  setup() {
    const dispatch = (action: any) => (event: Event) => {
      event.stopPropagation();
      send(action);
    };

    return () => {
      if (state.value.can('RETRY')) {
        return <Button name="Try again" onClick={dispatch('RETRY')} size="sm" />;
      }

      if (state.value.can('SIGN')) {
        return <Button name="Sign" onClick={dispatch('SIGN')} size="sm" />;
      }

      if (state.value.matches('waitingPreviousTransaction')) {
        return (
          <Button
            name="Sign"
            size="sm"
            tooltipText="Waiting for other transactions to complete on the Cosmos Hub."
            disabled
          />
        );
      }

      if (state.value.matches('receipt')) {
        return <Button name="Next" size="sm" onClick={dispatch('CONTINUE')} />;
      }

      return null;
    };
  },
});

const StateTitle = defineComponent({
  name: 'StateTitle',
  setup() {
    const currentTransaction =
      state.value.context.steps[state.value.context.currentStepIndex].transactions[
        state.value.context.currentTransactionIndex
      ];
    const name = currentTransaction.name;

    return () => {
      switch (name) {
        case 'transfer':
          return <span>Transfer</span>;
        default:
          return <span>{name}</span>;
      }
    };
  },
});
</script>
