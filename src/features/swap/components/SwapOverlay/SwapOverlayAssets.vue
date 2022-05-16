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

      <template #subheader>
        <div class="px-6 pt-1 pb-3">
          <Search v-model:keyword="data.searchQuery" />
        </div>
      </template>

      <SwapMenu
        :search="data.searchQuery"
        :items="isOutputView ? availableCoinsWithMarketCap : availableCoins"
        search-field="baseDenom"
        @select="selectAsset($event)"
      >
        <template #symbol="{ item }">
          <CircleSymbol :display-status="true" :denom="item.denom" :chain-name="item.chain" />
        </template>

        <template #title="{ item }">
          <Ticker :name="item.denom" />
        </template>

        <template #label="{ item }">
          <AmountDisplay
            v-if="isInputView"
            :chain="item.chain"
            :amount="{ amount: item.totalBalance, denom: item.denom }"
          />
          <span v-if="isOutputView">{{ item.displayName }}</span>
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
import orderBy from 'lodash.orderby';
import { computed, reactive } from 'vue';

import AssetChainsIndicator from '@/components/assets/AssetChainsIndicator/AssetChainsIndicator.vue';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import CaretRightIcon from '@/components/common/Icons/CaretRightIcon.vue';
import Search from '@/components/common/Search.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import {
  getAvailableChainsByDenom,
  getAvailableInputAssets,
  getMarketCap,
  resolveBaseDenom,
} from '@/features/swap/logic';
import { useSwapActor, useSwapStore } from '@/features/swap/state';

import SwapMenu from '../SwapMenu.vue';
import SwapOverlay from './SwapOverlay.vue';
import SwapOverlayAssetsChains from './SwapOverlayAssetsChains.vue';

const swap = useSwapStore();
const { state, send } = useSwapActor();

const initialData = {
  selectedDenom: undefined,
  selectedChain: undefined,
  searchQuery: '',
  shownChainMenu: false,
};

const data = reactive({ ...initialData });

const availableCoins = computed(() => getAvailableInputAssets(state.value.context));
const availableCoinsWithMarketCap = computed(() => {
  let coins = availableCoins.value;
  coins
    .filter((coin) => coin.baseDenom !== state.value.context.inputCoin?.baseDenom)
    .map((coin) => {
      let marketCap = getMarketCap(coin.denom);
      if (marketCap) {
        coin.marketCap = marketCap;
      }
    });
  coins = orderBy(coins, [(x) => x.marketCap || '', 'name'], ['desc', 'asc']);
  return coins;
});
const isInputView = computed(() => swap.selectAssetType === 'input');
const isOutputView = computed(() => swap.selectAssetType === 'output');

const getAvailableChains = (asset: any) => {
  if (isOutputView.value) return [];

  return getAvailableChainsByDenom(state.value.context, asset.denom);
};

const selectAsset = (asset: any) => {
  data.selectedDenom = asset.denom;

  if (isOutputView.value) {
    dispatchUpdate();
    return closeMenu();
  }

  const availableChainsWithBalances = getAvailableChains(asset);

  if (availableChainsWithBalances.length <= 1) {
    data.selectedChain = availableChainsWithBalances.length === 1 ? availableChainsWithBalances[0] : asset.chain;
    dispatchUpdate();
    return closeMenu();
  }

  data.selectedChain = asset.chain;
  data.shownChainMenu = true;
};

const selectChain = (value: any) => {
  data.selectedDenom = value.denom;
  data.selectedChain = value.chain;
  data.shownChainMenu = false;
  dispatchUpdate();
  closeMenu();
};

const dispatchUpdate = () => {
  const coin = {
    denom: data.selectedDenom,
    chain: data.selectedChain,
    baseDenom: resolveBaseDenom(data.selectedDenom, { context: state.value.context }),
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
