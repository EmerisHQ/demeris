<template>
  <span :title="`${displayValue}`">{{ displayValueTrunc }} {{ ticker }}</span>
</template>
<script lang="ts" setup>
import { EmerisBase } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { computed, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';

import { GlobalGetterTypes } from '@/store';
import { getBaseDenomSync, getTicker } from '@/utils/actionHandler';

BigNumber.config({ EXPONENTIAL_AT: [-20, 20] });

const store = useStore();

interface Props {
  amount: EmerisBase.Amount;
  chain?: string;
  truncBigBalance?: boolean;
}

const props = defineProps<Props>();
const propsRef = toRefs(props);

const baseDenom = computed(() => {
  return propsRef.amount.value.denom ? getBaseDenomSync(propsRef.amount.value.denom) : '-';
});
const precision = computed(() => {
  return store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: baseDenom.value }) ?? 6;
});
const ticker = ref('-');

const displayValue = computed(() => {
  return new BigNumber(propsRef.amount.value.amount ?? 0).dividedBy(10 ** parseInt(precision.value));
});

const displayValueTrunc = computed(() => {
  const bigBalance = displayValue.value.toFixed(0).split('').length > 2;
  return bigBalance && props.truncBigBalance ? displayValue.value.toFixed(2) : displayValue.value.precision(6);
});

watch(
  () => props.amount,
  async () => {
    if (props.amount.denom !== undefined) {
      ticker.value = await getTicker(
        props.amount.denom,
        props.chain || store.getters[GlobalGetterTypes.API.getDexChain],
      );
    }
  },
  { immediate: true },
);
</script>
