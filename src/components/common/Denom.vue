<template>
  {{ displayDenom }}
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';

import { getDisplayName } from '@/utils/actionHandler';
//import { useStore } from '@/store';
export default defineComponent({
  name: 'Denom',
  props: {
    name: { type: String, required: true },
  },
  setup(props) {
    //const store = useStore();
    const displayDenom = ref('-');
    onMounted(async () => {
      displayDenom.value = await getDisplayName(props.name, 'cosmos-hub');
    });
    watch(
      () => props.name,
      async (newName, oldName) => {
        displayDenom.value = await getDisplayName(newName, 'cosmos-hub');
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
