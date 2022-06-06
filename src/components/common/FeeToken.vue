<template>
  <div class="flex flex-col justify-center">
    <CircleSymbol class="absolute ml-0" :denom="denom" :glow="false" size="sm" />
    <div class="ml-8">
      <div class="font-medium">Fee token required</div>
      <div class="text-muted theme-inverse dark:theme-inverse">{{ amount }} {{ ticker }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';

const typedstore = useStore() as RootStoreTyped;

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
const verifiedDenoms = typedstore.getters[GlobalGetterTypes.API.getVerifiedDenoms] || [];
const denomConfig = verifiedDenoms.find((item) => item.name === props.denom);

const ticker = computed(() => (denomConfig && denomConfig.ticker ? denomConfig.ticker : props.denom));
</script>
