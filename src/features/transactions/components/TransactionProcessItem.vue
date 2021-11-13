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
import { useActor } from '@xstate/vue';
import { computed,defineComponent, PropType } from 'vue';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import Spinner from '@/components/ui/Spinner.vue';
import { IBCForwardsData, SwapData, TransferData } from '@/types/actions';

import { TransactionProcessService } from '../transactionProcessMachine';
import {
  getCurrentTransaction,
  getOffsetFromCurrentTransaction,
  getTransactionsLength,
} from '../transactionProcessSelectors';

const props = defineProps({
  service: {
    type: Object as PropType<TransactionProcessService>,
    required: true,
  },
  hideControls: {
    type: Boolean,
    default: false,
  },
});

const { state, send } = useActor(props.service);

const StateIcon = defineComponent({
  name: 'StateIcon',
  setup() {
    return () => {
      const iconResultMap = {
        failed: <Icon name="WarningTriangleIcon" class="text-negative" />,
        success: <Icon name="SuccessIcon" class="text-positive" />,
        waitingPreviousTransaction: <Icon name="TimeIcon" class="opacity-60" />,
      };

      if (Object.keys(iconResultMap).some(state.value.matches)) {
        return iconResultMap[state.value.value as string];
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
    const transactionOffset = getOffsetFromCurrentTransaction(state.value.context) + 1;

    return () => {
      if (Object.keys(textResultMap).some(state.value.matches)) {
        return <p>{textResultMap[state.value.value as string]}</p>;
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

      return null;
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
    const currentTransaction = computed(() => getCurrentTransaction(state.value.context));
    const name = computed(() => currentTransaction.value.name);

    return () => {
      if (name.value === 'transfer') {
        return (
          <div>
            Send <Ticker name={(currentTransaction.value.data as TransferData).amount.denom} />
          </div>
        );
      }

      if (name.value.startsWith('ibc')) {
        return (
          <div>
            Move <Ticker name={(currentTransaction.value.data as IBCForwardsData).amount.denom} />
          </div>
        );
      }

      return name;
    };
  },
});
</script>
