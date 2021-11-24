<template>
  <button class="flex w-full items-center hover:bg-fg" :class="hideControls ? 'space-x-3' : 'space-x-4'">
    <div class="w-6">
      <StateIcon />
    </div>

    <div class="flex-1 text-left flex flex-col">
      <p class="font-medium"><StateTitle /></p>
      <p class="-text-1 opacity-75"><StateDescription /></p>
    </div>

    <div>
      <StateControls v-if="!hideControls" />
    </div>
  </button>
</template>

<script lang="tsx" setup>
import { useActor } from '@xstate/vue';
import { computed, defineComponent, PropType, toRefs } from 'vue';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import Spinner from '@/components/ui/Spinner.vue';
import { AddLiquidityData, IBCForwardsData, SwapData, TransferData } from '@/types/actions';
import { getBaseDenomSync } from '@/utils/actionHandler';

import { TransactionProcessService } from '../transactionProcessMachine';
import {
  formatTransactionOffset,
  getCurrentTransaction,
  getTransactionFromAction,
  matchesObject,
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

const { service } = toRefs(props);
const { state, send } = useActor(service);

const StateIcon = defineComponent({
  name: 'StateIcon',
  setup() {
    return () => {
      const iconResultMap = {
        failed: <Icon name="WarningTriangleIcon" class="text-negative" />,
        success: <Icon name="SuccessIcon" class="text-positive" />,
        waitingPreviousTransaction: <Icon name="TimeIcon" class="opacity-60" />,
      };

      const staticIcon = matchesObject(iconResultMap, state.value.matches);
      if (staticIcon) {
        return staticIcon;
      }

      if (Object.keys(iconResultMap).some(state.value.matches)) {
        return iconResultMap[state.value.value as string];
      }

      if (state.value.matches('review') || state.value.matches('receipt')) {
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

      if (['transacting', 'validating', 'signing'].some(state.value.matches)) {
        return (
          <div style="transform: scale(0.5) translateX(-0.75rem);">
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
      signing: 'Signing...',
      waitingPreviousTransaction: 'Pending',
      success: 'Transaction completed',
      'failed.sign': 'Transaction not signed',
      failed: <span class="text-negative">Transaction failed</span>,
    };

    const transactionOffset = computed(() => formatTransactionOffset(state.value.context));

    return () => {
      const staticValue = matchesObject(textResultMap, state.value.matches);
      if (staticValue) {
        return staticValue;
      }

      if (state.value.matches('review')) {
        return <p>Sign in Keplr {transactionOffset.value}</p>;
      }

      if (state.value.matches('receipt')) {
        return <p>Partially completed {transactionOffset.value}</p>;
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
    const action = computed(() => state.value.context.input.action);
    const transaction = computed(() => getTransactionFromAction(state.value.context));

    return () => {
      if (action.value === 'transfer') {
        const denom = (transaction.value.data as TransferData).amount.denom;
        return (
          <div>
            Send <Ticker name={getBaseDenomSync(denom)} />
          </div>
        );
      }

      if (action.value.startsWith('move')) {
        const denom = (transaction.value.data as TransferData).amount.denom;
        return (
          <div>
            Move <Ticker name={getBaseDenomSync(denom)} />
          </div>
        );
      }

      if (action.value === 'swap') {
        const denomA = (transaction.value.data as SwapData).from.denom;
        const denomB = (transaction.value.data as SwapData).to.denom;
        return (
          <p>
            Swap <Ticker name={getBaseDenomSync(denomA)} /> &rarr; <Ticker name={getBaseDenomSync(denomB)} />
          </p>
        );
      }

      if (action.value === 'addliquidity') {
        const denomA = (transaction.value.data as AddLiquidityData).coinA.denom;
        const denomB = (transaction.value.data as AddLiquidityData).coinB.denom;
        return (
          <p>
            Add <Ticker name={getBaseDenomSync(denomA)} /> &middot; <Ticker name={getBaseDenomSync(denomB)} />
          </p>
        );
      }

      return <p>{action.value}</p>;
    };
  },
});
</script>
