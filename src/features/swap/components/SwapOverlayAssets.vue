<template>
  <template v-if="swap.shownAssetMenu">
    <SwapOverlay>
      <template #header>
        <h2 class="mx-auto text-2 font-bold">
          <span v-if="swap.selectAssetType === 'input'">Pay with</span>
          <span v-if="swap.selectAssetType === 'output'">Receive</span>
        </h2>
        <Button variant="link" size="sm" @click="closeMenu">
          <Icon name="CloseIcon" :icon-size="1.5" />
        </Button>
      </template>

      <Search v-model:keyword="data.searchQuery" />
      <SwapMenu :search="data.searchQuery" :items="['uatom', 'uosmo']" class="mt-3" @select="selectDenom($event)">
        <template #symbol="{ item }">
          <CircleSymbol :display-status="false" :denom="item" />
        </template>

        <template #title="{ item }">
          <Ticker :name="item" />
        </template>

        <template #label="{ item }">
          <AmountDisplay
            v-if="swap.selectAssetType === 'input'"
            :amount="{ amount: totalDenomBalance(state.context, item), denom: item }"
          />
          <ChainName v-if="swap.selectAssetType === 'output'" name="cosmos-hub" />
        </template>

        <template #actions="{ item }">
          <div v-if="countDenomBalancesPerChain(item) > 1" class="flex items-center">
            <AssetChainsIndicator :balances="state.context.balances" :denom="item" class="mr-2" />
            <Icon name="CaretRightIcon" :icon-size="0.7" class="-mr-1" stroke="currentColor" />
          </div>
        </template>
      </SwapMenu>
    </SwapOverlay>

    <SwapOverlayAssetsChains
      v-if="data.shownChainMenu"
      :denom="data.selectedDenom"
      @select="selectChain"
      @close="closeMenu"
      @back="data.shownChainMenu = false"
    />
  </template>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

import AssetChainsIndicator from '@/components/assets/AssetChainsIndicator/AssetChainsIndicator.vue';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Search from '@/components/common/Search.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

import { denomBalancesPerChain, totalDenomBalance } from '../swapMachineHelpers';
import { useSwapStore } from '../swapStore';
import SwapMenu from './SwapMenu.vue';
import SwapOverlay from './SwapOverlay.vue';
import SwapOverlayAssetsChains from './SwapOverlayAssetsChains.vue';

const swap = useSwapStore();
const { state, send } = swap.useSwapMachine();

const initialData = {
  selectedDenom: undefined,
  selectedChain: undefined,
  searchQuery: '',
  shownChainMenu: false,
};
const data = reactive({ ...initialData });

const countDenomBalancesPerChain = (denom: string) => {
  if (swap.selectAssetType === 'output') {
    return 0;
  }
  return Object.values(denomBalancesPerChain(state.value.context, denom)).length;
};

const selectDenom = (denom: string) => {
  data.selectedDenom = denom;
  if (countDenomBalancesPerChain(denom) <= 1) {
    dispatchUpdate();
    return closeMenu();
  }
  data.shownChainMenu = true;
};

const selectChain = (chain: string) => {
  data.selectedChain = chain;
  data.shownChainMenu = false;
  dispatchUpdate();
  closeMenu();
};

const dispatchUpdate = () => {
  const coin = { denom: data.selectedDenom, chain: data.selectedChain };

  if (swap.selectAssetType === 'input') {
    send({ type: 'UPDATE_INPUT_COIN', value: coin });
  } else if (swap.selectAssetType === 'output') {
    send({ type: 'UPDATE_OUTPUT_COIN', value: coin });
  }
};

const closeMenu = () => {
  Object.assign(data, initialData);
  swap.closeAssetsMenu();
};
</script>
