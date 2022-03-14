<template>
  <div class="p-4 group hover:bg-text hover:text-inverse rounded-xl cursor-pointer">
    <div v-if="isBestPrice" class="text-positive">Best price</div>
    <div class="flex">
      {{ quote.dex?.charAt(0)?.toUpperCase() + quote.dex?.slice(1) }}
      <span class="ml-auto">{{ quote.amount }} {{ ticker }}</span>
    </div>
    <div class="flex text-muted group-hover:text-inverse group-hover:opacity-70">
      <span v-if="quote.fee && quote.fee.amount" class="flex flex-row -text-1 items-center">
        <Icon name="ExclamationThinIcon" class="text-warning pr-2" :icon-size="1" />Fee token required</span
      >
      <span v-else class="hover:opacity-70"
        >{{ quote.numberOfTransactions }} {{ quote.numberOfTransactions == 1 ? 'transaction' : 'transactions' }}</span
      >
      <span class="ml-auto">~${{ quote.usdAmount }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, PropType } from '@vue/runtime-core';

import Icon from '@/components/ui/Icon.vue';
import { GlobalDemerisGetterTypes } from '@/store';
import { apistore } from '@/store/setup';
import { PriceQuote, VerifiedDenoms } from '@/types/api';

const verifiedDenoms: VerifiedDenoms = apistore.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms] || [];
const denomConfig = verifiedDenoms.find((item) => item.name === props.quote.denom);

const ticker = computed(() => (denomConfig && denomConfig.ticker ? denomConfig.ticker : props.quote.denom));

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
