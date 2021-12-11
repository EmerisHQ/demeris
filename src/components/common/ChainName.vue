<template>
  {{ displayChain }}
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';

import { useStore } from '@/store';
export default defineComponent({
  name: 'ChainName',
  props: {
    name: { type: String, required: true },
  },
  setup(props) {
    const store = useStore();

    const displayChain = computed(() => {
      const displayName = store.getters['demerisAPI/getDisplayChain']({ name: props.name });
      return displayName || props.name;
    });
    return { displayChain };
  },
});
</script>
