<template>
  <AppLayout>
    <div class="wrapper">
      <div class="portfolio">
        <TotalPrice :balances="balances" />
      </div>
      <div>
        <LiquiditySwap />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';

import TotalPrice from '@/components/common/TotalPrice.vue';
import LiquiditySwap from '@/components/liquidity/Swap.vue';
import useAccount from '@/composables/useAccount';
import AppLayout from '@/layouts/AppLayout.vue';

export default {
  name: 'Portfolio',
  components: { AppLayout, LiquiditySwap, TotalPrice },
  setup() {
    const router = useRouter();
    const { balances } = useAccount();

    const openAssetPage = (asset: Record<string, string>) => {
      router.push({ name: 'Asset', params: { denom: asset.denom } });
    };

    return { balances, openAssetPage };
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  max-width: 1024px;
  margin: 0 auto;

  .portfolio {
    display: flex;
    flex: 1;
    width: 0;
    margin-right: 2rem;
  }
}
</style>
