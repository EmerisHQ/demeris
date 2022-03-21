<template>
  <div class="p-4 group rounded-xl cursor-pointer" :class="[isSelectedQuote ? 'text-inverse bg-text' : '']">
    <div v-if="isBestPrice" class="text-positive">Best price</div>
    <div class="flex capitalize">
      {{ quote.dex }}
      <span class="ml-auto">{{ quote.amount }} {{ ticker }}</span>
    </div>
    <div class="flex text-muted" :class="[isSelectedQuote ? 'text-inverse opacity-70' : '']">
      <span v-if="quote.fee && quote.fee.amount" class="flex flex-row -text-1 items-center">
        <Icon name="ExclamationThinIcon" class="text-warning pr-2" :icon-size="1" />Fee token required</span
      >
      <span v-else class="hover:opacity-70" @click="visualizeRoute"
        >{{ quote.numberOfTransactions }} {{ quote.numberOfTransactions == 1 ? 'transaction' : 'transactions' }}</span
      >
      <span class="ml-auto">~{{ quote.usdAmount }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { EmerisBase } from '@emeris/types';
import { computed, PropType } from 'vue';
import { useStore } from 'vuex';

import Icon from '@/components/ui/Icon.vue';
import { GlobalGetterTypes } from '@/store';

const typedstore = useStore();

const verifiedDenoms = typedstore.getters[GlobalGetterTypes.API.getVerifiedDenoms] || [];
const denomConfig = verifiedDenoms.find((item) => item.name === props.quote.denom);

const ticker = computed(() => (denomConfig && denomConfig.ticker ? denomConfig.ticker : props.quote.denom));

// eslint-disable-next-line
const props = defineProps({
  quote: {
    type: Object as PropType<EmerisBase.PriceQuote>,
    required: true,
  },
  isBestPrice: {
    type: Boolean,
  },
  isSelectedQuote: {
    type: Boolean,
  },
  index: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['visualizeRoute']);

const visualizeRoute = (e) => {
  emit('visualizeRoute', { quote: props.quote, index: props.index });
  e.preventDefault();
};
</script>
