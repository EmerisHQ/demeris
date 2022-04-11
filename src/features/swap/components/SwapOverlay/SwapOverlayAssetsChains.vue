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
        <CircleSymbol :display-status="false" variant="chain" :chain-name="item" />
      </template>

      <template #title="{ item }">
        <ChainName :name="item" />
      </template>

      <template #label="{ item }">
        <AmountDisplay
          :amount="{ amount: totalDenomBalance(state.context, denom, item), denom: denom }"
          :chain="item"
        />
      </template>
    </SwapMenu>
  </SwapOverlay>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

import { getAvailableChainsByDenom, totalDenomBalance } from '../../swapHelpers';
import { useSwapStore } from '../../swapStore';
import SwapMenu from '../SwapMenu.vue';
import SwapOverlay from './SwapOverlay.vue';

const props = defineProps(['denom']);
const emit = defineEmits(['back', 'close', 'select']);

const swap = useSwapStore();
const { state } = swap.useSwapMachine();

const chains = computed(() => getAvailableChainsByDenom(state.value.context, props.denom));
</script>
