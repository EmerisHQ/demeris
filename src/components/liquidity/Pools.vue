<template>
  <div class="pools grid gap-4">
    <Pool v-for="pool of availablePools" :key="pool.id" :pool="pool" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { Pool as PoolType } from '@/types/actions';

import Pool from './Pool.vue';

interface Props {
  pools: PoolType[];
  limit?: number;
}

const props = withDefaults(defineProps<Props>(), {
  limit: undefined,
});

const availablePools = computed(() => {
  return (props.pools as PoolType[]).slice(0, props.limit as number);
});
</script>

<style lang="scss" scoped>
.pools {
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
}
</style>
