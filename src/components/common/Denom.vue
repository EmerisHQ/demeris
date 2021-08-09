<template>
  {{ displayDenom }}
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';

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

    const verifiedDenoms = computed(() => {
      return store.getters['demeris/getVerifiedDenoms'];
    });

    const updateName = async () => {
      displayDenom.value = await getDisplayName(props.name, store.getters['demeris/getDexChain']);
    };

    watch(() => props.name, updateName, { immediate: true });
    watch(verifiedDenoms, updateName);

    return { displayDenom };
  },
});
</script>
