<template>
  <Swap :key="userCorrelationId" :default-denom="defaultDenom" :can-start="!!userCorrelationId" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { GlobalGetterTypes } from '@/store';
import { useStore } from '@/utils/useStore';

import Swap from './components/Swap.vue';

interface Props {
  defaultDenom?: string;
}

defineProps<Props>();
const globalStore = useStore();

// Force remount component when user switch wallet to avoid unexpected behavior
const userCorrelationId = computed(() => globalStore.getters[GlobalGetterTypes.USER.getCorrelationId]);
</script>
