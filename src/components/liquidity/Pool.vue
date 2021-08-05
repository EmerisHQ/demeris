<template>
  <router-link
    :to="{ name: 'Pool', params: { id: pool.id } }"
    class="
      pool-card
      relative
      flex
      transition
      transform
      hover:-translate-y-px
      focus:-translate-y-px
      shadow-card
      hover:shadow-panel
      rounded-2xl
      active:transform-none active:opacity-70
      focus-visible:ring-2
      focus:ring-tertiary focus:ring-opacity-50
      cursor-pointer
    "
  >
    <div
      class="flex-1 relative z-10 flex flex-col items-between justify-stretch rounded-2xl p-6 text-0 bg-surface h-40"
    >
      <div class="flex gap-x-3">
        <h4 class="font-medium flex-1">{{ pairName }}</h4>
        <div class="flex -space-x-0.5 mt-0.5">
          <CircleSymbol :denom="denoms[0]" size="xs" :glow="false" class="z-10" />
          <CircleSymbol :denom="denoms[1]" size="xs" :glow="false" />
        </div>
      </div>
      <div v-if="hasPrices" class="mt-0.5 text-muted -text-1">
        {{ toUSD(totalLiquidityPrice) }}
      </div>
      <OwnLiquidityPrice :pool="pool" class="block font-medium text-1 mt-auto" />
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

    const totalLiquidityPrice = ref(0);

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
    return { hasPrices, denoms, truedenoms, pairName, totalLiquidityPrice, ownLiquidityPrice, toUSD };
  },
});
</script>

<style lang="scss" scoped>
.pool-card {
  // &:before {
  //   content: '';
  //   position: absolute;
  //   z-index: 0;
  //   @apply inset-0;
  //   @apply rounded-2xl;
  //   @apply shadow-card;
  //   @apply transition-shadow;
  // }

  // not working for some reason?
  // &:hover:before,
  // &:focus:before {
  //   --tw-shadow: 18px ​52px 128px -10px rgba(0, 0, 0, 0.1);
  // }
}
</style>
