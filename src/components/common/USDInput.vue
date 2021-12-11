<template>
  <AmountInput :model-value="usdValue" @update:model-value="onInput" />
</template>
<script lang="ts">
import BigNumber from 'bignumber.js';
import { defineComponent, nextTick, ref, toRefs, watch } from 'vue';

import AmountInput from '@/components/ui/AmountInput.vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'USDInput',
  components: {
    AmountInput,
  },
  props: {
    denom: { type: String, required: true },
    modelValue: { type: String, default: '' },
  },
  emits: ['update:modelValue', 'update:price'],
  setup(props, { emit }) {
    const store = useStore();
    // Should not observe price changes
    const price = ref(store.getters['demerisAPI/getPrice']({ denom: props.denom }));
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
        price.value = store.getters['demerisAPI/getPrice']({ denom: props.denom });
      }
    });

    return { usdValue, onInput };
  },
});
</script>
