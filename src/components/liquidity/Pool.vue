<template>
  <router-link :to="{ name: 'Pool', params: { id: pool.id } }" class="pool" :style="cardStyle">
    <div class="pool__main">
      <div class="pool__main__token-pair">
        <CircleSymbol :denom="denoms[0]" class="pool__main__token-pair__token token-a" />
        <CircleSymbol :denom="denoms[1]" class="pool__main__token-pair__token token-b" />
      </div>
      <div class="pool__main__info">
        <p class="pool__main__info__name">{{ pairName }}</p>
        <span v-if="hasPrices" class="pool__main__info__total">{{ toUSD(totalLiquidityPrice) }}</span>
      </div>
    </div>

    <div class="pool__footer">
      <p class="pool__footer__label">{{ $t('context.pools.equity') }}</p>
      <span class="pool__footer__value"><OwnLiquidityPrice :pool="pool" show-share /></span>
    </div>
  </router-link>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue';
import { useStore } from 'vuex';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import OwnLiquidityPrice from '@/components/common/OwnLiquidityPrice.vue';
import useAccount from '@/composables/useAccount';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import symbolsData from '@/data/symbols';
import { Pool } from '@/types/actions';
import { VerifyTrace } from '@/types/api';
import { parseCoins } from '@/utils/basic';
import { isNative } from '@/utils/basic';

const defaultColors = {
  primary: '#E1E1E1',
  secondary: '#F4F4F4',
  tertiary: '#F9F9F9',
};

const findSymbolColors = (symbol: string) => {
  return symbolsData[symbol]?.colors || defaultColors;
};

export default defineComponent({
  name: 'Pool',

  components: { CircleSymbol, OwnLiquidityPrice },

  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true,
    },
  },

  setup(props) {
    const newPool = JSON.parse(JSON.stringify(props.pool as Pool));
    const store = useStore();
    const pairName = ref('-/-');
    const truedenoms = ref((newPool as Pool).reserve_coin_denoms);
    const denoms = ref((newPool as Pool).reserve_coin_denoms);

    const hasPrices = computed(() => {
      let baseDenoms = denoms.value;
      if (!baseDenoms.length) {
        baseDenoms = props.pool.reserve_coin_denoms;
      }

      const priceA = store.getters['demeris/getPrice']({ denom: baseDenoms[0] });
      const priceB = store.getters['demeris/getPrice']({ denom: baseDenoms[1] });

      if (!priceA || !priceB) {
        return false;
      }

      return true;
    });

    watch(
      () => truedenoms.value,
      async (newDenoms) => {
        if (isNative(newDenoms[0])) {
          denoms.value[0] = newDenoms[0];
        } else {
          try {
            const verifyTrace =
              store.getters['demeris/getVerifyTrace']({
                chain_name: store.getters['demeris/getDexChain'],
                hash: newDenoms[0].split('/')[1],
              }) ??
              (await store.dispatch(
                'demeris/GET_VERIFY_TRACE',
                {
                  subscribe: false,
                  params: {
                    chain_name: store.getters['demeris/getDexChain'],
                    hash: newDenoms[0].split('/')[1],
                  },
                },
                { root: true },
              ));
            denoms.value[0] = verifyTrace.base_denom;
          } catch (e) {
            denoms.value[0] = newDenoms[0];
          }
        }
        if (isNative(newDenoms[1])) {
          denoms.value[1] = newDenoms[1];
        } else {
          try {
            const verifyTrace =
              store.getters['demeris/getVerifyTrace']({
                chain_name: store.getters['demeris/getDexChain'],
                hash: newDenoms[1].split('/')[1],
              }) ??
              (await store.dispatch(
                'demeris/GET_VERIFY_TRACE',
                {
                  subscribe: false,
                  params: {
                    chain_name: store.getters['demeris/getDexChain'],
                    hash: newDenoms[1].split('/')[1],
                  },
                },
                { root: true },
              ));
            denoms.value[1] = verifyTrace.base_denom;
          } catch (e) {
            denoms.value[1] = newDenoms[1];
          }
        }
      },
      { immediate: true },
    );
    const { formatPoolName } = usePools();

    onMounted(async () => {
      pairName.value = await formatPoolName(props.pool as Pool);
    });

    const cardStyle = computed(() => {
      const colorA = findSymbolColors(denoms.value[0]).primary;
      const colorB = findSymbolColors(denoms.value[1]).primary;

      const background = `
				linear-gradient(165.72deg, rgba(247, 248, 248, 0.9) 0%, #F8F8F7 39.71%),
      	linear-gradient(67.04deg, ${colorA} 44.06%, ${colorB} 74.33%)`;

      return {
        background,
      };
    });

    const { pool, reserveBalances, calculateWithdrawBalances } = usePool((props.pool as Pool).id);

    const toUSD = (value) => {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });
      return formatter.format(Number.isNaN(value) ? 0 : value);
    };
    const { balancesByDenom } = useAccount();
    const { getReserveBaseDenoms } = usePools();

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
    return { hasPrices, cardStyle, denoms, truedenoms, pairName, totalLiquidityPrice, ownLiquidityPrice, toUSD };
  },
});
</script>

<style lang="scss" scoped>
.pool {
  display: flex;
  flex-direction: column;
  border-radius: 1.6rem;
  padding: 2.4rem;
  font-size: 1.6rem;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &__token-pair {
      display: inline-flex;
      align-items: center;

      &__token {
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 9999px;
        z-index: 0;

        &.token-a {
          z-index: 1;
        }

        & + & {
          margin-left: -0.6rem;
        }
      }
    }

    &__info {
      width: 100%;
      margin-top: 1.6rem;
      &__name {
        width: 100%;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &__total {
        color: var(--muted);
        font-size: 1.2rem;
      }
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;

    &__label {
      color: var(--muted);
      margin-bottom: 0.2rem;
      font-weight: 400;
    }
    &__value {
      font-weight: 600;
      text-transform: uppercase;
    }
  }
}
</style>
