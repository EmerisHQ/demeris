<template>
  <router-link :to="{ name: 'Pool', params: { id: pool.id } }" class="pool">
    <div class="pool__main">
      <div class="pool__main__total-equity">{{ toUSD(totalLiquidityPrice) }}</div>
      <div class="pool__main__token-pair">
        <span class="pool__main__token-pair__token token-a" />
        <span class="pool__main__token-pair__token token-b" />
      </div>

      <div class="pool__main__trending">
        <!--<span class="pool__main__trending__icon">
          <TrendingUpIcon />
        </span>
        <span class="pool__main__trending__value"> 18% </span>
        //-->
      </div>
    </div>

    <div class="pool__footer">
      <p class="pool__footer__pair">{{ pairName }}</p>
      <span class="pool__footer__price">{{ toUSD(ownLiquidityPrice) }}</span>
    </div>
  </router-link>
</template>

<script lang="ts">
import { parseCoins } from '@cosmjs/amino';
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { useStore } from 'vuex';

import useAccount from '@/composables/useAccount';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import { Pool } from '@/types/actions';
import { VerifyTrace } from '@/types/api';
import { isNative } from '@/utils/basic';

//import TrendingUpIcon from '../common/Icons/TrendingUpIcon.vue';

export default defineComponent({
  name: 'Pool',

  //components: { TrendingUpIcon },

  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true,
    },
  },

  setup(props) {
    const { pool, reserveBalances, pairName, calculateWithdrawBalances } = usePool((props.pool as Pool).id);

    const store = useStore();
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
    const { poolsByDenom, getReserveBaseDenoms } = usePools();

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

    const relatedPools = computed(() => {
      return [
        ...poolsByDenom(pool.value.reserve_coin_denoms[0]),
        ...poolsByDenom(pool.value.reserve_coin_denoms[1]),
      ].filter((item) => item.id !== pool.value.id);
    });

    const updateTotalLiquidityPrice = async () => {
      if (!pool.value) {
        return;
      }

      const reserveDenoms = await getReserveBaseDenoms(pool.value);

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
    return { pairName, totalLiquidityPrice, ownLiquidityPrice, toUSD };
  },
});
</script>

<style lang="scss" scoped>
.pool {
  display: flex;
  flex-direction: column;
  border-radius: 1.6rem;
  padding: 2.4rem;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.08);
  font-size: 1.6rem;

  &__main {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    &__token-pair {
      display: inline-flex;
      align-items: center;

      &__token {
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 9999px;

        &.token-a {
          background-color: #f7f7f7;
        }

        &.token-b {
          margin-left: -0.8rem;
          background-color: #e5e5e5;
        }
      }
    }

    &__trending {
      display: inline-flex;
      font-weight: 600;
      color: rgb(6, 126, 61);

      &__icon {
        width: 1.6rem;
        height: 1.6rem;
      }

      &__value {
        margin-left: 0.2rem;
      }
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;

    &__pair {
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 0.2rem;
    }
  }
}
</style>
