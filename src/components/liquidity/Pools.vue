<template>
  <div class="pools grid gap-4">
    <Pool v-for="pool of availablePools" :key="pool.id" :pool="pool" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

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
    limit: {
      type: Number,
      default: undefined,
    },
  },

  setup(props) {
    const availablePools = computed(() => {
      return (props.pools as PoolType[]).slice(0, props.limit as number);
    });

    return {
      availablePools,
    };
  },
});
</script>

<style lang="scss" scoped>
.pools {
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
}
</style>
