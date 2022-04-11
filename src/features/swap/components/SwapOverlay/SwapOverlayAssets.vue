<template>
  <template v-if="swap.shownAssetMenu">
    <SwapOverlay @esc="closeMenu">
      <template #header>
        <h2 class="mx-auto text-2 font-bold">
          <span v-if="isInputView">Pay with</span>
          <span v-if="isOutputView">Receive</span>
        </h2>
        <Button variant="link" size="sm" @click="closeMenu">
          <Icon name="CloseIcon" :icon-size="1.5" />
        </Button>
      </template>

      <Search v-model:keyword="data.searchQuery" />
      <SwapMenu
        :search="data.searchQuery"
        :items="availableCoins"
        search-field="baseDenom"
        class="mt-3"
        @select="selectAsset($event)"
      >
        <template #symbol="{ item }">
          <CircleSymbol :display-status="false" :denom="item.denom" :chain-name="item.chain" />
        </template>

        <template #title="{ item }">
          <Ticker :name="item.denom" />
        </template>

        <template #label="{ item }">
          <AmountDisplay
            v-if="swap.selectAssetType === 'input'"
            :chain="item.chain"
            :amount="{ amount: item.totalBalance, denom: item.denom }"
          />
          <ChainName v-if="isOutputView" :name="item.chain" />
        </template>

        <template #actions="{ item }">
          <div v-if="getAvailableChains(item).length > 1" class="flex items-center">
            <AssetChainsIndicator :balances="state.context.balances" :denom="item.denom" class="mr-2" />
            <div class="text-[0.7rem]"><CaretRightIcon /></div>
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
import { computed, reactive } from 'vue';

import AssetChainsIndicator from '@/components/assets/AssetChainsIndicator/AssetChainsIndicator.vue';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import CaretRightIcon from '@/components/common/Icons/CaretRightIcon.vue';
import Search from '@/components/common/Search.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { getBaseDenomSync } from '@/utils/actionHandler';

import {
  denomBalancesPerChain,
  getAvailableAssets,
  getAvailableChainsByDenom,
  getDenomFromBaseDenom,
} from '../../swapHelpers';
import { useSwapStore } from '../../swapStore';
import SwapMenu from '../SwapMenu.vue';
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

const availableCoins = computed(() => getAvailableAssets(state.value.context));

const isInputView = computed(() => swap.selectAssetType === 'input');
const isOutputView = computed(() => swap.selectAssetType === 'output');

const getAvailableChains = (asset: any) => {
  if (isInputView.value) {
    return Object.keys(denomBalancesPerChain(state.value.context, asset.denom));
  }

  return getAvailableChainsByDenom(state.value.context, asset.baseDenom);
};

const selectAsset = (asset: any) => {
  data.selectedDenom = asset.denom;
  data.selectedChain = asset.chain;
  if (getAvailableChains(asset).length <= 1) {
    dispatchUpdate();
    return closeMenu();
  }
  data.shownChainMenu = true;
};

const selectChain = (chain: string) => {
  data.selectedDenom = getDenomFromBaseDenom(data.selectedDenom, chain);
  data.selectedChain = chain;
  data.shownChainMenu = false;
  dispatchUpdate();
  closeMenu();
};

const dispatchUpdate = () => {
  const coin = {
    denom: data.selectedDenom,
    chain: data.selectedChain,
    baseDenom: getBaseDenomSync(data.selectedDenom),
  };

  if (swap.selectAssetType === 'input') {
    send({ type: 'INPUT.CHANGE_COIN', value: coin });
  } else if (swap.selectAssetType === 'output') {
    send({ type: 'OUTPUT.CHANGE_COIN', value: coin });
  }
};

const closeMenu = () => {
  Object.assign(data, initialData);
  swap.closeAssetsMenu();
};
</script>
