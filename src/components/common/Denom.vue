<template>
  {{ displayDenom }}
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';

import { useStore } from '@/store';
export default defineComponent({
  name: 'Denom',
  props: {
    name: { type: String, required: true },
  },
  setup(props) {
    const store = useStore();

    const displayDenom = computed(() => {
      const displayName = store.getters['demeris/getDisplayDenom']({ name: props.name });
      return displayName || (props.name as string).substr(1).toUpperCase();
    });
    return { displayDenom };
  },
});
</script>
