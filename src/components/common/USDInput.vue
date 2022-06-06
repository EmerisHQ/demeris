<template>
  <AmountInput :model-value="usdValue" @update:model-value="onInput" />
</template>
<script setup lang="ts">
import BigNumber from 'bignumber.js';
import { nextTick, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';

import AmountInput from '@/components/ui/AmountInput.vue';
import { GlobalGetterTypes } from '@/store';

interface Props {
  denom: string;
  modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), { modelValue: '' });

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'update:price', value: any): void;
}>();

const store = useStore();
// Should not observe price changes
const price = ref(store.getters[GlobalGetterTypes.API.getPrice]({ denom: props.denom }));
const usdValue = ref('');
const previousInput = ref('');

const onInput = (value: string) => {
  setUsdValue(value);

  const bnValue = new BigNumber(value);
  const amount = bnValue.isFinite() ? bnValue.dividedBy(price.value).decimalPlaces(6).toString() : '';
  previousInput.value = amount;
  emit('update:modelValue', amount);
};

const setUsdValue = (value: string) => {
  usdValue.value = value;
  emit('update:price', value);
};

watch(
  props,
  () => {
    // Do not format values manually entered by the user
    if (props.modelValue === previousInput.value) {
      return;
    }

    const value = new BigNumber(props.modelValue);

    nextTick(() => {
      if (value.isFinite()) {
        setUsdValue(value.multipliedBy(price.value).toFixed(2));
        return;
      }

      setUsdValue('');
    });
  },
  { immediate: true },
);

const { denom } = toRefs(props);
watch(denom, (newDenom, oldDenom) => {
  if (newDenom !== oldDenom) {
    price.value = store.getters[GlobalGetterTypes.API.getPrice]({ denom: props.denom });
  }
});
</script>
