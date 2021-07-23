<template>
  <div>
    <p>Display Name: <Denom :name="walletBalances.poolCoin.denom" /></p>
    <p>LP <Ticker :name="walletBalances.coinA.denom" /> &middot; <Ticker :name="walletBalances.coinB.denom" /></p>
    <p>Ticker: <Ticker :name="walletBalances.poolCoin.denom" /></p>
    <p>Balance: <AmountDisplay :amount="walletBalances.poolCoin" /></p>
    <p>Balance USD: {{ toUSD(ownLiquidityPrice) }}</p>
    {{ walletBalances.poolCoin }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import Denom from '@/components/common/Denom.vue';
import Ticker from '@/components/common/Ticker.vue';
import useAccount from '@/composables/useAccount';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import { VerifyTrace } from '@/types/api';
import { parseCoins } from '@/utils/basic';
import { isNative } from '@/utils/basic';

export default defineComponent({
  name: 'LPAsset',
  components: {
    AmountDisplay,
    Denom,
    Ticker,
  },
  props: {
    poolId: {
      type: String,
      default: '1',
    },
  },
  setup(props) {
    const store = useStore();

    const toUSD = (value) => {
      let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      return formatter.format(value);
    };
    const { balancesByDenom } = useAccount();
    const { formatPoolName } = usePools();

    const { pool, reserveBalances, pairName, calculateWithdrawBalances } = usePool(props.poolId);
    const totalLiquidityPrice = ref();

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
      const withdrawBalances = calculateWithdrawBalances(poolCoin.amount);

      return {
        coinA: withdrawBalances[0],
        coinB: withdrawBalances[1],
        poolCoin,
      };
    });

    const updateOwnLiquidityPrice = async () => {
      if (!pool.value) {
        return;
      }

      let total = 0;

      let denom;

      if (isNative(walletBalances.value.coinA.denom)) {
        denom = walletBalances.value.coinA.denom;
      } else {
        const verifyTrace =
          store.getters['demeris/getVerifyTrace']({
            chain_name: store.getters['demeris/getDexChain'],
            hash: walletBalances.value.coinA.denom.split('/')[1],
          }) ??
          (await store.dispatch(
            'demeris/GET_VERIFY_TRACE',
            {
              subscribe: false,
              params: {
                chain_name: store.getters['demeris/getDexChain'],
                hash: walletBalances.value.coinA.denom.split('/')[1],
              },
            },
            { root: true },
          ));
        denom = (verifyTrace as VerifyTrace).base_denom;
      }
      if (store.getters['demeris/getPrice']({ denom: denom })) {
        total =
          total +
          (parseInt('' + walletBalances.value.coinA.amount) * store.getters['demeris/getPrice']({ denom: denom })) /
            Math.pow(
              10,
              parseInt(
                store.getters['demeris/getDenomPrecision']({
                  name: denom,
                }),
              ),
            );
      }

      if (isNative(walletBalances.value.coinB.denom)) {
        denom = walletBalances.value.coinB.denom;
      } else {
        const verifyTrace =
          store.getters['demeris/getVerifyTrace']({
            chain_name: store.getters['demeris/getDexChain'],
            hash: walletBalances.value.coinB.denom.split('/')[1],
          }) ??
          (await store.dispatch(
            'demeris/GET_VERIFY_TRACE',
            {
              subscribe: false,
              params: {
                chain_name: store.getters['demeris/getDexChain'],
                hash: walletBalances.value.coinB.denom.split('/')[1],
              },
            },
            { root: true },
          ));
        denom = (verifyTrace as VerifyTrace).base_denom;
      }
      if (store.getters['demeris/getPrice']({ denom: denom })) {
        total =
          total +
          (parseInt('' + walletBalances.value.coinB.amount) * store.getters['demeris/getPrice']({ denom: denom })) /
            Math.pow(
              10,
              parseInt(
                store.getters['demeris/getDenomPrecision']({
                  name: denom,
                }),
              ),
            );
      }

      ownLiquidityPrice.value = total;
    };

    watch(walletBalances, updateOwnLiquidityPrice);

    return {
      pool,
      pairName,
      reserveBalances,
      walletBalances,
      totalLiquidityPrice,
      formatPoolName,
      ownLiquidityPrice,
      toUSD,
    };
  },
});
</script>
