<template>
  <SwapOverlay v-if="swap.shownSettings" @esc="swap.toggleSettings">
    <template #title> Settings </template>
    <template #actions>
      <Button variant="link" @click="swap.toggleSettings">Done</Button>
    </template>

    <div class="flex flex-col">
      <Collapse :is-open="isSlippageOpen" class="w-full border-b border-border" @update:is-open="toggleSlippage">
        <template #handler="{ isOpen, onClick }">
          <button class="w-full py-3 flex justify-between" @click="onClick">
            <span class="transition-all" :class="{ 'font-medium': isOpen }">Slippage tolerance</span>
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
        <div class="pb-4">Slippage content</div>
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

import Button from '@/components/ui/Button.vue';
import Collapse from '@/components/ui/Collapse.vue';
import Icon from '@/components/ui/Icon.vue';

import { useSwapStore } from '../swapStore';
import SwapOverlay from './SwapOverlay.vue';

const swap = useSwapStore();

const [isSlippageOpen, toggleSlippage] = useToggle(false);
const [isExchangesOpen, toggleExchanges] = useToggle(false);
</script>
