<template>
  <div class="flex flex-col justify-center">
    <CircleSymbol :style="{ position: 'absolute' }" class="ml-0" :denom="denom" :glow="false" size="sm" />
    <div class="ml-8">
      <div class="font-medium">Fee token required</div>
      <div class="text-muted theme-inverse dark:theme-inverse">{{ amount }} {{ ticker }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from '@vue/reactivity';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import { GlobalDemerisGetterTypes } from '@/store';
import { apistore } from '@/store/setup';
import { VerifiedDenoms } from '@/types/api';

// eslint-disable-next-line
const props = defineProps({
  denom: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});
const verifiedDenoms: VerifiedDenoms = apistore.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms] || [];
const denomConfig = verifiedDenoms.find((item) => item.name === props.denom);

const ticker = computed(() => (denomConfig && denomConfig.ticker ? denomConfig.ticker : props.denom));
</script>
<style lang="scss" scoped></style>
