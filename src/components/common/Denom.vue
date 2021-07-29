<template>
  {{ displayDenom }}
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';

import { useStore } from '@/store';
import { getDisplayName } from '@/utils/actionHandler';

export default defineComponent({
  name: 'Denom',
  props: {
    name: { type: String, required: true },
  },
  setup(props) {
    const store = useStore();
    const displayDenom = ref('-');
    onMounted(async () => {
      displayDenom.value = await getDisplayName(props.name, store.getters['demeris/getDexChain']);
    });
    watch(
      () => props.name,
      async (newName) => {
        displayDenom.value = await getDisplayName(newName, store.getters['demeris/getDexChain']);
      },
    );
    /*
    const displayDenom = computed(() => {
      const displayName = store.getters['demeris/getDisplayDenom']({ name: props.name });
      return displayName || (props.name as string); // Leave as is if we don't have display name
    });
    */
    return { displayDenom };
  },
});
</script>
