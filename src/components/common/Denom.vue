<template>
  <span>
    {{ display }}
  </span>
</template>
<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { getDisplayName } from '@/utils/actionHandler';
import { useStore } from '@/utils/useStore';

interface Props {
  name: string;
}

const props = defineProps<Props>();

const typedstore = useStore() as RootStoreTyped;
const propName = toRefs(props).name;
const display = ref('-');
const updateDenom = async (denomName) => {
  display.value = await getDisplayName(denomName, typedstore.getters[GlobalGetterTypes.API.getDexChain]);
};

watch(
  propName,
  (denomName) => {
    updateDenom(denomName);
  },
  { immediate: true },
);
</script>
