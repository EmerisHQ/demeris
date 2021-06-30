<template>
  <AppLayout>
    <PoolsTable :pools="pools" />
  </AppLayout>
</template>

<script lang="ts">
import PoolsTable from '@/components/liquidity/PoolsTable.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { useAllStores } from '@/store';

export default {
  name: 'Pools',
  components: { AppLayout, PoolsTable },

  setup() {
    const stores = useAllStores();
    const pools = stores.getters['tendermint.liquidity.v1beta1/getLiquidityPools']();
    return {
      pools: pools.pools,
    };
  },
};
</script>

<style lang="scss" scoped></style>
