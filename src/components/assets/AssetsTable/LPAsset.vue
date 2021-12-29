<template>
  <div v-if="validPool && walletBalances && walletBalances.poolCoin">
    <p class="-text-1 font-normal text-muted">
      LP <Ticker :name="walletBalances.coinA.denom" /> &middot; <Ticker :name="walletBalances.coinB.denom" />
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';

import Ticker from '@/components/common/Ticker.vue';
import useAccount from '@/composables/useAccount';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import { GlobalDemerisActionTypes, GlobalDemerisGetterTypes, TypedAPIStore } from '@/store';
import { VerifyTrace } from '@/types/api';
import { parseCoins } from '@/utils/basic';
import { isNative } from '@/utils/basic';

export default defineComponent({
  name: 'LPAsset',
  components: {
    Ticker,
  },
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const apistore = useStore() as TypedAPIStore;

    const { balancesByDenom } = useAccount();
    const { pools } = usePools();
    const validPool = computed(() => {
      return pools.value.find((pool) => pool.pool_coin_denom == props.name);
    });

    const { pool, reserveBalances, getPoolWithdrawBalances } = usePool(computed(() => validPool.value?.id));

    const ownLiquidityPrice = ref();
    const walletBalances = computed(() => {
      if (!pool.value || !reserveBalances.value?.length) {
        return;
      }

      const poolCoinBalances = balancesByDenom(pool.value.pool_coin_denom);

      const poolCoin = {
        denom: pool.value.pool_coin_denom,
        amount: poolCoinBalances.reduce((acc, item) => acc + +parseCoins(item.amount)[0].amount, 0),
      };
      const withdrawBalances = getPoolWithdrawBalances(poolCoin.amount);

      return {
        coinA: withdrawBalances[0],
        coinB: withdrawBalances[1],
        poolCoin,
      };
    });

    const updateOwnLiquidityPrice = async () => {
      const store = useStore();
      if (!pool.value) {
        return;
      }

      let total = 0;

      let denom;

      if (isNative(walletBalances.value.coinA.denom)) {
        denom = walletBalances.value.coinA.denom;
      } else {
        const verifyTrace =
          store.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({
            chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
            hash: walletBalances.value.coinA.denom.split('/')[1],
          }) ??
          (await store.dispatch(
            GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
            {
              subscribe: false,
              params: {
                chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
                hash: walletBalances.value.coinA.denom.split('/')[1],
              },
            },
            { root: true },
          ));
        denom = (verifyTrace as VerifyTrace).base_denom;
      }
      if (store.getters[GlobalDemerisGetterTypes.API.getPrice]({ denom: denom })) {
        total =
          total +
          (parseInt('' + walletBalances.value.coinA.amount) *
            store.getters[GlobalDemerisGetterTypes.API.getPrice]({ denom: denom })) /
            Math.pow(
              10,
              parseInt(
                store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
                  name: denom,
                }),
              ),
            );
      }

      if (isNative(walletBalances.value.coinB.denom)) {
        denom = walletBalances.value.coinB.denom;
      } else {
        const verifyTrace =
          store.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({
            chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
            hash: walletBalances.value.coinB.denom.split('/')[1],
          }) ??
          (await store.dispatch(
            GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
            {
              subscribe: false,
              params: {
                chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
                hash: walletBalances.value.coinB.denom.split('/')[1],
              },
            },
            { root: true },
          ));
        denom = (verifyTrace as VerifyTrace).base_denom;
      }
      if (store.getters[GlobalDemerisGetterTypes.API.getPrice]({ denom: denom })) {
        total =
          total +
          (parseInt('' + walletBalances.value.coinB.amount) *
            store.getters[GlobalDemerisGetterTypes.API.getPrice]({ denom: denom })) /
            Math.pow(
              10,
              parseInt(
                store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
                  name: denom,
                }),
              ),
            );
      }

      ownLiquidityPrice.value = total;
    };

    watch(walletBalances, updateOwnLiquidityPrice);

    return {
      validPool,
      pool,
      reserveBalances,
      walletBalances,
      ownLiquidityPrice,
    };
  },
});
</script>
<style lang="scss" scoped></style>
