<template>
  <AppLayout>
    <div class="pools__header">
      <h1 class="pools__title text-4 font-bold mb-8">Pools</h1>
    </div>

    <PoolsTable :pools="pools" />
  </AppLayout>
</template>

<script lang="ts">
import { computed } from '@vue/runtime-core';

import PoolsTable from '@/components/liquidity/PoolsTable.vue';
import usePools from '@/composables/usePools';
import AppLayout from '@/layouts/AppLayout.vue';
import { useAllStores } from '@/store';

export default {
  name: 'Pools',
  components: { AppLayout, PoolsTable },

  setup() {
    const stores = useAllStores();
    const { pools } = usePools();
    return {
      pools,
    };
  },
};
</script>

<style lang="scss" scoped></style>
