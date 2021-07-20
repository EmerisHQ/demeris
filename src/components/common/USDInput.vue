<template>
  <input v-model="usdValue" />
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';

import { useStore } from '@/store';
export default defineComponent({
  name: 'USDInput',
  props: {
    denom: { type: String, required: true },
    modelValue: { type: Number, default: 0 },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const store = useStore();
    const price = computed(() => {
      return store.getters['demeris/getPrice']({ denom: props.denom });
    });
    const usdValue = ref(props.modelValue * parseFloat(price.value));

    const trueValue = computed(() => {
      return usdValue.value / parseFloat(price.value);
    });
    watch(
      () => trueValue.value,
      (newVal, oldVal) => {
        if (newVal != oldVal) {
          emit('update:modelValue', trueValue.value);
        }
      },
    );

    return { usdValue };
  },
});
</script>
