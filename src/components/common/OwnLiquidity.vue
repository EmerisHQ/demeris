<template>Price {{ ownLiquidity }}</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { useStore } from 'vuex';

import useAccount from '@/composables/useAccount';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import { Pool } from '@/types/actions';
import { VerifyTrace } from '@/types/api';
import { parseCoins } from '@/utils/basic';
import { isNative } from '@/utils/basic';

//import TrendingUpIcon from '../common/Icons/TrendingUpIcon.vue';

export default defineComponent({
  name: 'OwnLiquidity',

  //components: { TrendingUpIcon },

  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true,
    },
  },

  setup(props) {
    const { pool, reserveBalances, calculateWithdrawBalances } = usePool((props.pool as Pool).id);

    const store = useStore();

    const { balancesByDenom } = useAccount();
    const { getReserveBaseDenoms } = usePools();

    const ownLiquidity = ref();
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

      ownLiquidity.value = total;
    };

    watch(walletBalances, updateOwnLiquidityPrice);
    return { ownLiquidity };
  },
});
</script>
