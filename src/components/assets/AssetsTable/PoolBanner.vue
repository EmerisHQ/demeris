<template>
  <Alert v-if="pool" status="info" class="mt-4" size="md" :show-icon="false">
    <h5 class="font-bold text-text">What is <Denom :name="name" />?</h5>
    <p class="mt-3 text-muted -text-1 leading-copy">
      <Denom :name="name" /> (<Ticker :name="name" />) is a liquidity pool (LP) asset. LP assets represent shares of a
      particular liquidity pool.
    </p>
    <p class="mt-3">
      <a
        class="font-medium cursor-pointer text-link hover:text-link-hover active:opacity-70 transition"
        href="#"
        @click="openPoolPage"
      >View pool &rarr;</a>
    </p>
  </Alert>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';

import Denom from '@/components/common/Denom.vue';
import Ticker from '@/components/common/Ticker.vue';
import Alert from '@/components/ui/Alert.vue';
import { useAllStores } from '@/store';

export default defineComponent({
  name: 'PoolBanner',
  components: {
    Alert,
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

    const pool = computed(() => {
      return pools.value.find((pool) => pool.pool_coin_denom == props.name);
    });

    const openPoolPage = () => {
      router.push({ name: 'Pool', params: { id: pool.value.id } });
    };

    return {
      pool,
      openPoolPage,
    };
  },
});
</script>
<style lang="scss" scoped></style>
