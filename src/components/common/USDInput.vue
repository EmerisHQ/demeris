<template>
  <AmountInput v-model="usdValue" />
</template>
<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';

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
    const price = computed(() => {
      return store.getters['demeris/getPrice']({ denom: props.denom });
    });

    const usdValue = ref('');

    const trueValue = computed(() => {
      return new BigNumber(usdValue.value).dividedBy(price.value).decimalPlaces(6).toString();
    });

    watch(usdValue, () => emit('update:price', usdValue.value));

    onMounted(() => {
      const value = new BigNumber(props.modelValue);

      if (value.isFinite()) {
        usdValue.value = new BigNumber(props.modelValue).multipliedBy(price.value).decimalPlaces(2).toString();
        return;
      }

      usdValue.value = '';
    });

    watch(trueValue, () => {
      emit('update:modelValue', new BigNumber(trueValue.value).isFinite() ? trueValue.value : '');
    });

    return { usdValue };
  },
});
</script>
