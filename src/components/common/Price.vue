<template>
  {{ displayPrice }}
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';

import { useStore } from '@/store';
export default defineComponent({
  name: 'Price',
  props: {
    amount: { type: String, required: true },
    denom: { type: String, required: true },
  },
  setup(props) {
    const store = useStore();

    const displayPrice = computed(() =>
      store.getters['demeris/getDisplayDenom']({ name: props.name, chain_name: props.chainName }),
    );
    return { displayPrice };
  },
});
</script>
