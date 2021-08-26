<template>
  <div class="pools grid gap-4">
    <template v-if="isLoadingPools">
      <div
        v-for="index of skeletonRows"
        :key="index"
        class="rounded-2xl bg-inactive animate-pulse w-full flex flex-col p-6 h-40"
      >
        <div class="flex-1">
          <div class="flex items-center justify-between gap-x-3">
            <span class="h-5 w-28 bg-bg rounded" />
            <div class="flex items-center -space-x-0.5">
              <span class="rounded-full w-5 h-5 bg-bg" />
              <span class="rounded-full w-5 h-5 bg-bg" />
            </div>
          </div>
          <span class="mt-0.5 h-4 w-16 bg-bg rounded inline-block" />
        </div>

        <div class="mt-auto h-7 w-32 bg-bg rounded" />
      </div>
    </template>

    <template v-else>
      <Pool v-for="pool of availablePools" :key="pool.id" :pool="pool" />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { useStore } from 'vuex';

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
    const store = useStore();

    const isLoadingPools = computed(() => {
      const state = store.state.demeris.sync;
      return state.session !== 'synced';
    });

    const skeletonRows = computed(() => {
      return Array.from({ length: props.limit || 6 }, (_, i) => i);
    });

    const availablePools = computed(() => {
      return (props.pools as PoolType[]).slice(0, props.limit as number);
    });

    return {
      isLoadingPools,
      skeletonRows,
      availablePools,
    };
  },
});
</script>

<style lang="scss" scoped>
.pools {
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
}
</style>
