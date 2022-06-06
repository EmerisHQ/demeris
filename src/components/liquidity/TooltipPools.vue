<template>
  <div class="tooltip-pools">
    <p class="mb-4">{{ $t('components.asset.pooledTooltip') }}</p>
    <TooltipPool v-for="pool of availablePools" :key="pool.id" :pool="pool" :denom="denom" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { Pool as PoolType } from '@/types/actions';

import TooltipPool from './TooltipPool.vue';

interface Props {
  pools: PoolType[];
  limit?: number;
  denom: string;
}

const props = withDefaults(defineProps<Props>(), {
  limit: undefined,
});

const availablePools = computed(() => {
  return (props.pools as PoolType[]).slice(0, props.limit as number);
});
</script>
