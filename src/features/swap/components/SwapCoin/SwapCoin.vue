<template>
  <div class="flex flex-col space-y-2">
    <div class="flex justify-between items-center">
      <p class="font-bold -text-1"><slot name="label" /></p>
      <slot v-if="denom" name="header" />
    </div>
    <div class="flex items-center space-x-3">
      <div>
        <template v-if="isLoadingCoin">
          <CircleSymbol size="sm" />
        </template>
        <CircleSymbol v-else :denom="denom ? getBaseDenomSync(denom) : ''" size="sm" :display-status="false" />
      </div>

      <button class="flex flex-col" @click="emit('select')">
        <div class="flex items-center">
          <template v-if="isLoadingCoin">
            <SkeletonLoader height="16px" width="48px" />
          </template>
          <template v-else>
            <span class="text-0 font-medium whitespace-nowrap">
              <Ticker v-if="denom" :name="getBaseDenomSync(denom)" />
              <span v-else>Select asset</span>
            </span>
            <Icon name="SmallDownIcon" :icon-size="1" class="ml-1" />
          </template>
        </div>

        <template v-if="isLoadingCoin || isLoadingChain">
          <SkeletonLoader height="12px" width="96px" class="mt-0.5" />
        </template>
        <span v-else-if="chain" class="text-muted -text-1 whitespace-nowrap">
          <ChainName :name="chain" />
        </span>
      </button>

      <div v-if="denom" class="flex-1 flex flex-col items-end space-y-0.5">
        <SkeletonLoader v-if="isLoadingAmount" height="20px" width="82px" />
        <template v-else>
          <AmountInput
            v-model="value"
            class="bg-transparent text-right w-full text-text font-bold text-1 placeholder-inactive appearance-none border-none outline-none"
          />
          <span class="text-muted -text-1">
            <Price :amount="amountToUnit({ denom, amount: value })" show-zero />
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import Price from '@/components/common/Price.vue';
import Ticker from '@/components/common/Ticker.vue';
import AmountInput from '@/components/ui/AmountInput.vue';
import Icon from '@/components/ui/Icon.vue';
import { getBaseDenomSync } from '@/utils/actionHandler';

import { amountToUnit } from '../../swapHelpers';
import { useSwapStore } from '../../swapStore';

interface Props {
  chain?: string;
  denom?: string;
  input?: string;
  isLoadingAmount?: boolean;
  isLoadingChain?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['select', 'update:input']);

const swap = useSwapStore();
const { state } = swap.useSwapMachine();

const isLoadingCoin = computed(() => state.value.matches('booting'));

const value = computed<string>({
  get() {
    return props.input;
  },
  set(value) {
    emit('update:input', value);
  },
});
</script>
