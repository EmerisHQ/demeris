<template>
  <div>
    <p>Amount: <AmountDisplay :amount="walletBalances.poolCoin" /></p>
    <p>Amount USD: {{ toUSD(ownLiquidityPrice) }}</p>
    <p>Pool share: {{ parseFloat((100 * ownLiquidityPrice) / totalLiquidityPrice).toFixed(2) }}% of pool</p>
    <p>Token 1: <AmountDisplay :amount="walletBalances.coinA" /></p>
    <p>Token 2: <AmountDisplay :amount="walletBalances.coinB" /></p>
    <br />
    <hr />
    <br />
    {{ walletBalances.poolCoin }}
    <p>Display Name: <Denom :name="walletBalances.poolCoin.denom" /></p>
    <p>Ticker: <Ticker :name="walletBalances.poolCoin.denom" /></p>
    <p>Balance: <AmountDisplay :amount="walletBalances.poolCoin" /></p>
    <p>Balance USD: {{ toUSD(ownLiquidityPrice) }}</p>
    <p>Token 1: <Ticker :name="walletBalances.coinA.denom" /></p>
    <p>Token 2: <Ticker :name="walletBalances.coinB.denom" /></p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
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
  name: 'Pool',

  components: {
    AmountDisplay,
    Denom,
    Ticker,
  },

  setup() {
    const route = useRoute();
    const store = useStore();
    const denoms = ref([]);

    const toUSD = (value) => {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });
      return formatter.format(value);
    };
    const { balancesByDenom } = useAccount();
    const { formatPoolName, getReserveBaseDenoms } = usePools();

    const { pool, reserveBalances, pairName, calculateWithdrawBalances } = usePool(
      computed(() => route.params.id as string),
    );
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

    const updateTotalLiquidityPrice = async () => {
      if (!pool.value) {
        return;
      }

      const reserveDenoms = await getReserveBaseDenoms(pool.value);
      denoms.value = reserveDenoms;

      let total = 0;

      for (const [index, denom] of reserveDenoms.entries()) {
        const price = store.getters['demeris/getPrice']({ denom });
        const precision = store.getters['demeris/getDenomPrecision']({ name: denom }) || 6;

        total += (reserveBalances.value[index].amount / Math.pow(10, precision)) * price;
      }

      totalLiquidityPrice.value = total;
    };

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

    watch(reserveBalances, updateTotalLiquidityPrice);
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

<style lang="scss" scoped></style>
