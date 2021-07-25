<template>
  <div class="pools">
    <Pool v-for="pool of availablePools" :key="pool.id" :pool="pool" class="pools__pool" />
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
  display: grid;
  grid-template-columns: repeat(3, minmax(11.25rem, 13.125rem));
  gap: 1rem;

  &__pool {
    height: 15rem;
  }
}
</style>
