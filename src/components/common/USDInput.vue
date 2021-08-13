<template>
  <AmountInput v-model="usdValue" />
</template>
<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, nextTick, ref, toRefs, watch } from 'vue';

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
    const price = ref(store.getters['demeris/getPrice']({ denom: props.denom }));

    const usdValue = ref('');

    const trueValue = computed(() => {
      return new BigNumber(usdValue.value).dividedBy(price.value).decimalPlaces(6).toString();
    });

    watch(usdValue, () => emit('update:price', usdValue.value));

    watch(
      props,
      () => {
        const value = new BigNumber(props.modelValue);

        nextTick(() => {
          if (value.isFinite()) {
            usdValue.value = new BigNumber(props.modelValue).multipliedBy(price.value).toFixed(2);
            return;
          }

          usdValue.value = '';
        });
      },
      { immediate: true },
    );

    watch(trueValue, () => {
      emit('update:modelValue', new BigNumber(trueValue.value).isFinite() ? trueValue.value : '');
    });

    const { denom } = toRefs(props);
    watch(denom, (newDenom, oldDenom) => {
      if (newDenom !== oldDenom) {
        price.value = store.getters['demeris/getPrice']({ denom: props.denom });
      }
    });

    return { usdValue };
  },
});
</script>
