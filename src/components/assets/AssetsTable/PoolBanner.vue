<template>
  <div v-if="pool" class="pool-banner bg-surface dark:bg-fg rounded-2xl shadow-panel">
    <div class="py-6 px-6">
      <p class="font-bold">About <Ticker :name="name" /></p>
    </div>
    <div class="pb-6 px-6">
      <p class="pb-6">
        <Ticker :name="name" /> is a Gravity DEX liquidity pool token. This token represents a share of the
        <strong>{{ pairName }}</strong> liquidity pool.
      </p>
      <Button name="View pool" @click="openPoolPage" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';

import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import usePool from '@/composables/usePool';
import { useAllStores } from '@/store';

export default defineComponent({
  name: 'PoolBanner',
  components: {
    Button,
    Ticker,
  },
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const router = useRouter();
    const stores = useAllStores();

    const pools = computed(() => {
      let liquidityPools = stores.getters['tendermint.liquidity.v1beta1/getLiquidityPools']();
      return liquidityPools.pools;
    });

    const pool = computed(() => {
      return pools.value.find((pool) => pool.pool_coin_denom == props.name);
    });

    const { pairName } = usePool(computed(() => pool.value.id as string));

    const openPoolPage = () => {
      router.push({ name: 'Pool', params: { id: pool.value.id } });
    };

    return {
      pool,
      pairName,
      openPoolPage,
    };
  },
});
</script>
<style lang="scss" scoped>
.pool-banner {
  position: relative;
  z-index: 10;
  margin-top: 2rem;
  min-width: 20rem;
  svg {
    float: right;
  }
}
</style>
