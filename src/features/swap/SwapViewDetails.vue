<template>
  <div class="flex flex-col space-y-2">
    <dl class="grid grid-cols-[auto_1fr] gap-y-6 py-6" :class="{ 'border-y border-border': context === 'widget' }">
      <dt class="font-medium -text-1">Pay</dt>
      <dd class="place-self-end">
        <CoinDescription
          :amount="transaction.data[0].from.amount"
          :denom="getBaseDenomSync(transaction.data[0].from.denom)"
          :chain="transaction.data[0].chainName"
        />
      </dd>
      <dt>
        <span class="font-medium -text-1">Receive</span>
        <div class="-text-1 text-muted">(estimated)</div>
      </dt>
      <dd class="place-self-end">
        <CoinDescription
          :amount="transaction.data[transaction.data.length - 1].to.amount"
          :denom="getBaseDenomSync(transaction.data[transaction.data.length - 1].to.denom)"
          :chain="transaction.data[transaction.data.length - 1].chainName"
        />
      </dd>
    </dl>

    <CollapseDescription content-class="pb-6" is-open>
      <template #title><span class="-text-1">Price</span></template>
      <template #label>
        <AmountDisplay :amount="priceInputAmount" trunc-big-balance /> ≈
        <AmountDisplay :amount="expectOutputAmount" :chain="transaction.data[0].chainName" trunc-big-balance />
      </template>

      <dl class="grid grid-cols-[auto_1fr] gap-y-4 -text-1">
        <dt class="text-muted">Exchange</dt>
        <dd class="place-self-end">
          <div class="flex items-center space-x-1">
            <CircleSymbol
              :chain-status="false"
              size="xs"
              variant="chain"
              :chain-name="getChainFromProtocol(transaction.protocol)"
            />
            <span>{{ formatProtocolName(transaction.protocol) }}</span>
          </div>
        </dd>

        <template v-if="transactionOffset">
          <dt class="text-muted">Route</dt>
          <dd class="place-self-end">{{ transactionOffset.offset }} / {{ transactionOffset.total }}</dd>
        </template>

        <dt class="text-muted">Expected rate</dt>
        <dd class="text-right">
          <AmountDisplay :amount="priceInputAmount" /> =
          <AmountDisplay :amount="expectOutputAmount" :chain="transaction.data[0].chainName" trunc-big-balance />
        </dd>

        <dt class="text-muted">Max slippage</dt>
        <dd class="text-right">{{ swapStore.getSlippageSession() }}%</dd>

        <dt class="text-muted">
          Min. received
          <div>(if 100% swapped)</div>
        </dt>
        <dd class="text-right">
          <AmountDisplay :amount="minOutputAmount" :chain="transaction.data[0].chainName" trunc-big-balance />
        </dd>
      </dl>
    </CollapseDescription>

    <CollapseDescription content-class="pb-6" is-open>
      <template #title><span class="-text-1">Fees (included)</span></template>
      <template #label><AmountDisplay v-for="fee of txFeesAmount" :key="fee.denom" :amount="fee" /></template>

      <dl class="grid grid-cols-[auto_1fr] gap-y-4 -text-1">
        <dt class="text-muted">Transaction fee</dt>
        <dd class="text-right">
          <AmountDisplay v-for="fee of txFeesAmount" :key="fee.denom" :amount="fee" />
        </dd>

        <dt v-if="false" class="text-muted">Swap fee</dt>
        <dd v-if="false" class="text-right">
          <AmountDisplay :amount="{ amount: '0', denom: 'uatom' }" />
        </dd>
      </dl>
    </CollapseDescription>
  </div>
</template>

<script lang="tsx" setup>
import { computed } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import { getBaseDenomSync } from '@/utils/actionHandler';

import { getTransactionOffset } from '../transactions/transactionProcessHelpers';
import CoinDescription from './components/shared/CoinDescription.vue';
import CollapseDescription from './components/shared/CollapseDescription.vue';
import {
  amountToUnit,
  calculateSlippage,
  formatProtocolName,
  getChainFromProtocol,
  getOrderPrice,
  resolveBaseDenom,
} from './logic';
import { useSwapStore } from './state';

// NOTE: We should not interact with the current swap machine here
// this component is used to display a transaction in the `review` or `receipt` state.

const props = defineProps(['step', 'fees', 'context', 'transactionProcessContext']);
const swapStore = useSwapStore();

const transaction = computed(() => {
  return props.step.transactions[0];
});

const expectOutputAmount = computed(() => {
  const denom = transaction.value.data[transaction.value.data.length - 1].to.denom;
  const orderPrice = getOrderPrice(
    transaction.value.data[0].from,
    transaction.value.data[transaction.value.data.length - 1].to,
  );

  const { amount } = amountToUnit({ amount: orderPrice, denom });
  const baseDenom = resolveBaseDenom(denom, { swaps: swapStore.sync.swaps });
  return { amount, denom: baseDenom };
});

const priceInputAmount = computed(() => {
  const denom = transaction.value.data[0].from.denom;
  const { amount } = amountToUnit({ amount: '1', denom });
  const baseDenom = resolveBaseDenom(denom, { swaps: swapStore.sync.swaps });
  return { amount, denom: baseDenom };
});

const minOutputAmount = computed(() => {
  const denom = transaction.value.data[transaction.value.data.length - 1].to.denom;
  const baseDenom = resolveBaseDenom(denom, { swaps: swapStore.sync.swaps });
  return {
    amount: calculateSlippage(
      transaction.value.data[transaction.value.data.length - 1].to.amount,
      swapStore.getSlippageSession(),
    ),
    denom: baseDenom,
  };
});

const txFeesAmount = computed(() => {
  const amounts = [];
  for (const [chain, fees] of Object.entries(props.fees)) {
    for (const [denom, amount] of Object.entries(fees)) {
      amounts.push({ denom, amount, chain });
    }
  }
  return amounts;
});

const transactionOffset = computed(
  () => props.transactionProcessContext && getTransactionOffset(props.transactionProcessContext),
);
</script>
