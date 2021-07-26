<template>
  {{ ticker }}
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';

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
    onMounted(async () => {
      ticker.value = await getTicker(props.name, store.getters['demeris/getDexChain']);
    });
    watch(
      () => props.name,
      async (newName) => {
        ticker.value = await getTicker(newName, store.getters['demeris/getDexChain']);
      },
    );
    return { ticker };
  },
});
</script>
