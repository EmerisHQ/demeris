<template>
  {{ ticker }}
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';

import { useStore } from '@/store';
import { getTicker } from '@/utils/actionHandler';

export default defineComponent({
  name: 'Ticker',
  props: {
    name: { type: String, required: true },
  },
  setup(props) {
    const store = useStore();
    const ticker = ref('-');

    const verifiedDenoms = computed(() => {
      return store.getters['demeris/getVerifiedDenoms'];
    });

    const updateTicker = async () => {
      ticker.value = await getTicker(props.name, store.getters['demeris/getDexChain']);
    };

    watch(() => props.name, updateTicker, { immediate: true });
    watch(verifiedDenoms, updateTicker);

    return { ticker };
  },
});
</script>
