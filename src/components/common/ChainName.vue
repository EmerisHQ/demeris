<template>
  {{ displayChain }}
</template>
<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useStore } from 'vuex';

import { GlobalGetterTypes } from '@/store';

interface Props {
  name: string;
}

const props = defineProps<Props>();

const store = useStore();
const name = toRefs(props).name;
const displayChain = computed(() => {
  const displayName = store.getters[GlobalGetterTypes.API.getDisplayChain]({ name: name.value });
  return displayName || name.value;
});
</script>
