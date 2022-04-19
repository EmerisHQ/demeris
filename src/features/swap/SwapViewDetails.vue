<template>
  <div class="flex flex-col space-y-2">
    <dl class="grid grid-cols-[auto_1fr] gap-y-6 border-y border-border py-6">
      <dt class="font-medium -text-1">Pay</dt>
      <dd class="place-self-end">
        <CoinDescription
          :amount="transaction.data.from.amount"
          :denom="getBaseDenomSync(transaction.data.from.denom)"
          :chain="transaction.data.chainName"
        />
      </dd>
      <dt>
        <span class="font-medium -text-1">Receive</span>
        <div class="-text-1 text-muted">(estimated)</div>
      </dt>
      <dd class="place-self-end">
        <CoinDescription
          :amount="transaction.data.to.amount"
          :denom="getBaseDenomSync(transaction.data.to.denom)"
          :chain="transaction.data.chainName"
        />
      </dd>
    </dl>

    <CollapseDescription content-class="pb-6" is-open>
      <template #title><span class="-text-1">Price</span></template>
      <template #label>
        <AmountDisplay :amount="inputAmount" /> ≈
        <AmountDisplay :amount="exchangeAmount" />
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

        <dt class="text-muted">Route</dt>
        <dd class="place-self-end">2 transactions</dd>

        <dt class="text-muted">Limit price</dt>
        <dd class="text-right">
          <AmountDisplay :amount="inputAmount" /> ≈
          <AmountDisplay :amount="exchangeAmount" />
        </dd>

        <dt class="text-muted">
          Min. received
          <div>(if 100% swapped)</div>
        </dt>
        <dd class="text-right">
          <AmountDisplay :amount="outputAmount" />
        </dd>
      </dl>
    </CollapseDescription>

    <CollapseDescription content-class="pb-6" is-open>
      <template #title><span class="-text-1">Fees (included)</span></template>
      <template #label><AmountDisplay :amount="{ amount: '1000', denom: 'uatom' }" /></template>

      <dl class="grid grid-cols-[auto_1fr] gap-y-4 -text-1">
        <dt class="text-muted">Transaction fee</dt>
        <dd class="text-right">
          <AmountDisplay v-for="fee of txFeesAmount" :key="fee.denom" :amount="fee" />
        </dd>

        <dt class="text-muted">Swap fee</dt>
        <dd class="text-right">
          <AmountDisplay :amount="{ amount: '1000', denom: 'uatom' }" />
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

import CoinDescription from './components/shared/CoinDescription.vue';
import CollapseDescription from './components/shared/CollapseDescription.vue';
import {
  amountToUnit,
  formatProtocolName,
  getChainFromProtocol,
  getOrderPriceFromStep,
  resolveBaseDenom,
} from './logic';
import { useSwapStore } from './state';

const props = defineProps(['step', 'fees']);
const swapStore = useSwapStore();

const transaction = computed(() => {
  return props.step.transactions[0];
});

const inputAmount = computed(() => {
  const denom = transaction.value.data.from.denom;
  const { amount } = amountToUnit({ amount: '1', denom });
  const baseDenom = resolveBaseDenom(denom, { swaps: swapStore.sync.swaps });
  return { amount, denom: baseDenom };
});

const exchangeAmount = computed(() => {
  const denom = transaction.value.data.to.denom;
  const { amount } = amountToUnit({
    amount: getOrderPriceFromStep(transaction.value),
    denom,
  });
  const baseDenom = resolveBaseDenom(denom, { swaps: swapStore.sync.swaps });
  return { amount, denom: baseDenom };
});

const outputAmount = computed(() => {
  const denom = transaction.value.data.to.denom;
  const baseDenom = resolveBaseDenom(denom, { swaps: swapStore.sync.swaps });
  return {
    amount: transaction.value.data.to.amount,
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
</script>
