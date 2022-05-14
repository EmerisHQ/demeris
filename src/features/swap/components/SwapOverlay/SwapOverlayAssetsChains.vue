<template>
  <SwapOverlay>
    <template #header>
      <Button variant="link" size="sm" @click="emit('back')">
        <Icon name="ArrowLeftIcon" :icon-size="1.5" />
      </Button>
      <h2 class="mx-auto text-2 font-bold">Chains</h2>
      <Button variant="link" size="sm" @click="emit('close')">
        <Icon name="CloseIcon" :icon-size="1.5" />
      </Button>
    </template>

    <div class="text-center text-muted leading-copy">
      <p v-if="swap.selectAssetType === 'input'">
        <i18n-t scope="global" keypath="components.chainSelect.text1" chain-no="4" chains="chains">
          <template #asset>
            <Denom :name="denom" />
          </template>
          <template #chainNo>{{ chains.length }}</template>
        </i18n-t>
      </p>
      <p>{{ $t('components.chainSelect.text2') }}</p>
    </div>

    <SwapMenu :items="chains" class="mt-3" @select="emit('select', $event)">
      <template #symbol="{ item }">
        <CircleSymbol :display-status="true" variant="chain" :chain-name="item.chain" />
      </template>

      <template #title="{ item }">
        <ChainName :name="item.chain" />
      </template>

      <template #label="{ item }">
        <AmountDisplay
          :amount="{ amount: totalDenomBalance(state.context, denom, item.chain), denom: denom }"
          :chain="item.chain"
        />
      </template>
    </SwapMenu>
  </SwapOverlay>
</template>

<script lang="ts" setup>
// TODO: Use DenomSelect component to display available chains/balances
import { computed } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { denomBalancesPerChain, totalDenomBalance } from '@/features/swap/logic';
import { useSwapActor, useSwapStore } from '@/features/swap/state';

import SwapMenu from '../SwapMenu.vue';
import SwapOverlay from './SwapOverlay.vue';

const props = defineProps<{ denom: string }>();
const emit = defineEmits(['back', 'close', 'select']);

const swap = useSwapStore();
const { state } = useSwapActor();

const chains = computed(() => {
  const balances = denomBalancesPerChain(state.value.context, props.denom);
  return Object.entries(balances).map(([chain, balance]) => ({
    chain,
    denom: balance[0].ibc.hash ? `ibc/${balance[0].ibc.hash}` : balance[0].base_denom,
  }));
});
</script>
