<template>
  <div class="pools">
    <Pool v-for="pool of pools" :key="pool.id" :pool="pool" class="pools__pool" />
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

<style lang="scss" scoped>
.pools {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 22rem));
  gap: 1.6rem;

  &__pool {
    height: 22.4rem;
  }
}
</style>
