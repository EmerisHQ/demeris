<template>
  <SwapOverlay v-if="swapStore.shownSettings" @esc="swapStore.toggleSettings">
    <template #title> Settings </template>
    <template #actions>
      <Button variant="link" @click="swapStore.toggleSettings">Done</Button>
    </template>

    <div class="flex flex-col">
      <Collapse :is-open="isSlippageOpen" class="w-full border-b border-border" @update:is-open="toggleSlippage">
        <template #handler="{ isOpen, onClick }">
          <button class="w-full py-3 flex justify-between" @click="onClick">
            <span class="transition-all" :class="{ 'font-medium': isOpen }">Slippage tolerance</span>
            <div class="flex items-center">
              <span class="mr-3 font-medium transition-opacity duration-300" :class="{ 'opacity-0': isOpen }">
                {{ slippageValue }}%
              </span>
              <Icon
                :name="'CaretDownIcon'"
                :icon-size="1"
                class="transform transition-transform -ml-2"
                :class="{ 'rotate-180': isOpen }"
              />
            </div>
          </button>
        </template>
        <div class="pb-4">
          <SwapSettingsSlippage />
        </div>
      </Collapse>

      <Collapse :is-open="isExchangesOpen" class="w-full" @update:is-open="toggleExchanges">
        <template #handler="{ isOpen, onClick }">
          <button class="w-full border-b border-border py-3 flex justify-between" @click="onClick">
            <span class="transition-all" :class="{ 'font-medium': isOpen }">Exchanges</span>
            <div>
              <Icon
                :name="'CaretDownIcon'"
                :icon-size="1"
                class="transform transition-transform -ml-2"
                :class="{ 'rotate-180': isOpen }"
              />
            </div>
          </button>
        </template>
        <div class="pb-4">Exchanges content</div>
      </Collapse>
    </div>
  </SwapOverlay>
</template>

<script lang="ts" setup>
import { useToggle } from '@vueuse/core';
import { computed } from 'vue';

import Button from '@/components/ui/Button.vue';
import Collapse from '@/components/ui/Collapse.vue';
import Icon from '@/components/ui/Icon.vue';
import { useSwapStore } from '@/features/swap/state';
import { GlobalGetterTypes } from '@/store';
import { useStore } from '@/utils/useStore';

import SwapSettingsSlippage from '../SwapSettings/SwapSettingsSlippage.vue';
import SwapOverlay from './SwapOverlay.vue';

const swapStore = useSwapStore();
const globaStore = useStore();

const [isSlippageOpen, toggleSlippage] = useToggle(false);
const [isExchangesOpen, toggleExchanges] = useToggle(false);

const slippageValue = computed(() => globaStore.getters[GlobalGetterTypes.USER.getSlippagePerc] || 0.5);
</script>
