<template>
  <div class="p-4 group hover:bg-text hover:text-inverse rounded-xl cursor-pointer">
    <div v-if="isBestPrice" class="text-positive">Best price</div>
    <div class="flex">
      {{ quote.dex?.charAt(0)?.toUpperCase() + quote.dex?.slice(1) }}
      <span class="ml-auto">{{ quote.amount }} {{ quote.denom?.toUpperCase() }}</span>
    </div>
    <div class="flex text-muted group-hover:text-inverse group-hover:opacity-70">
      <span class="hover:opacity-90"
        >{{ quote.numberOfTransactions }} {{ quote.numberOfTransactions == 1 ? 'transaction' : 'transactions' }}</span
      >
      <span class="ml-auto">~${{ quote.usdAmount }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PropType } from '@vue/runtime-core';

import { PriceQuote } from '@/types/api';

// eslint-disable-next-line
const props = defineProps({
  quote: {
    type: Object as PropType<PriceQuote>,
    required: true,
  },
  isBestPrice: {
    type: Boolean,
  },
});
</script>
<style lang="scss" scoped></style>
