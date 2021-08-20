<template>
  <router-link :to="{ name: 'Pool', params: { id: pool.id } }" class="cursor-pointer">
    <div>
      <TooltipPoolAmount :pool="pool" :denom="denom" />
      on <Ticker :name="pool.pool_coin_denom" />
    </div>
  </router-link>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { useStore } from 'vuex';

import Ticker from '@/components/common/Ticker.vue';
import TooltipPoolAmount from '@/components/liquidity/TooltipPoolAmount.vue';
import usePool from '@/composables/usePool';
import { Pool } from '@/types/actions';
import { isNative } from '@/utils/basic';

export default defineComponent({
  name: 'TooltipPool',

  components: { TooltipPoolAmount, Ticker },

  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true,
    },
    denom: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const newPool = JSON.parse(JSON.stringify(props.pool as Pool));
    const store = useStore();

    const { pairName, totalLiquidityPrice } = usePool((props.pool as Pool).id);
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

    return { hasPrices, denoms, truedenoms, pairName, totalLiquidityPrice };
  },
});
</script>
