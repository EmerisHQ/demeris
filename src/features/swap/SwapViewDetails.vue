<template>
  <div class="flex flex-col space-y-2">
    <dl class="grid grid-cols-[auto_1fr] gap-y-6 border-y border-border py-6">
      <dt class="font-medium">Pay</dt>
      <dd class="place-self-end">
        <CoinDescription amount="1000" denom="uatom" chain="cosmos-hub" />
      </dd>
      <dt>
        <span class="font-medium">Receive</span>
        <div class="-text-1 text-muted">(estimated)</div>
      </dt>
      <dd class="place-self-end">
        <CoinDescription amount="1000" denom="uosmo" chain="osmosis" />
      </dd>
    </dl>

    <CollapseDescription title="Price" :is-open="true">
      <template #label> OSMO </template>

      <dl class="grid grid-cols-[auto_1fr] gap-y-4 -text-1">
        <dt class="text-muted">Exchange</dt>
        <dd class="place-self-end">
          <div class="flex items-center space-x-1">
            <CircleSymbol :chain-status="false" size="xs" variant="chain" chain-name="osmosis" />
            <span>{{ formatProtocolName('osmosis') }}</span>
          </div>
        </dd>

        <dt class="text-muted">Route</dt>
        <dd class="place-self-end">2 transactions</dd>

        <dt class="text-muted">Limit price</dt>
        <dd class="place-self-end">
          <div class="text-right">
            <AmountDisplay :amount="{ amount: '1000', denom: 'uatom' }" /> ≈
            <AmountDisplay :amount="{ amount: '1000', denom: 'uosmo' }" />
          </div>
        </dd>
      </dl>
    </CollapseDescription>
  </div>
</template>

<script lang="tsx" setup>
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';

import CoinDescription from './components/shared/CoinDescription.vue';
import CollapseDescription from './components/shared/CollapseDescription.vue';
import { formatProtocolName } from './logic';
</script>
