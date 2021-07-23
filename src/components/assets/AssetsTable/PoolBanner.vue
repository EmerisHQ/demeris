<template>
  <div v-if="validPool && walletBalances && walletBalances.poolCoin" class="elevation-panel" @click="openPoolPage">
    <p class="title-1-bold">What is <Ticker :name="walletBalances.poolCoin.denom" />?</p>
    <p>
      <Denom :name="walletBalances.poolCoin.denom" /> is a liquidity pool asset. LP assets represents shares of a
      particular liquidity pool.
    </p>
    <ArrowRightIcon />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';

import Denom from '@/components/common/Denom.vue';
import ArrowRightIcon from '@/components/common/Icons/ArrowRightIcon.vue';
import Ticker from '@/components/common/Ticker.vue';
import usePool from '@/composables/usePool';
import { useAllStores } from '@/store';

export default defineComponent({
  name: 'PoolBanner',
  components: {
    ArrowRightIcon,
    Denom,
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

    const validPool = computed(() => {
      if (pools.value) {
        return pools.value.find((pool) => pool.pool_coin_denom == props.name);
      }
      return false;
    });
    console.log('validPool', validPool.value);

    const { pool, reserveBalances } = usePool(validPool.value.id);

    const walletBalances = computed(() => {
      if (!pool.value || !reserveBalances.value?.length) {
        return;
      }

      const poolCoin = {
        denom: pool.value.pool_coin_denom,
      };

      return {
        poolCoin,
      };
    });

    const openPoolPage = () => {
      router.push({ name: 'Pool', params: { id: validPool.value.id } });
    };

    return {
      validPool,
      walletBalances,
      openPoolPage,
    };
  },
});
</script>
<style lang="scss" scoped>
.elevation-panel {
  position: relative;
  z-index: 100;
  cursor: pointer;
  margin-top: 2.4rem;
  padding: 2.4rem;
  width: 32rem;
  .title-1-bold {
    margin-bottom: 1.6rem;
  }
  svg {
    float: right;
  }
}
</style>
