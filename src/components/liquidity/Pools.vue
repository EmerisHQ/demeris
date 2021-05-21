<template>
  <div class="pools">
    <Pool v-for="pool of pools" :key="pool.id" :pool="pool" class="h-56" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Pool as PoolType } from '@/types/actions';

import Pool from './Pool.vue';

export default defineComponent({
  name: 'Pools',

  components: {
    Pool,
  },

  props: {
    pools: {
      type: Array as PropType<PoolType[]>,
      required: true,
    },
  },
});
</script>

<style scoped>
.pools {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 13rem));
  gap: 1rem;
}
</style>
