<template>
  <router-link
    :to="{ name: 'Pool', params: { id: pool.id } }"
    class="pool-card relative flex transition transform hover:-translate-y-px focus:-translate-y-px shadow-card hover:shadow-panel rounded-2xl active:transform-none active:opacity-70 focus-visible:ring-2 focus:ring-tertiary focus:ring-opacity-50 cursor-pointer"
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
        <CurrencyDisplay :value="totalLiquidityPrice" />
      </div>
      <OwnLiquidityPrice :pool="pool" class="block font-medium text-1 mt-auto" />
    </div>
  </router-link>
</template>

<script setup lang="ts">
/* eslint-disable max-lines-per-function */
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import OwnLiquidityPrice from '@/components/common/OwnLiquidityPrice.vue';
import usePool from '@/composables/usePool';
import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';
import { Pool } from '@/types/actions';
import { isNative } from '@/utils/basic';

import CurrencyDisplay from '../ui/CurrencyDisplay.vue';

interface Props {
  pool: Pool;
}

const props = defineProps<Props>();

const newPool = JSON.parse(JSON.stringify(props.pool as Pool));
const typedstore = useStore() as RootStoreTyped;

const { pairName, totalLiquidityPrice } = usePool((props.pool as Pool).id);
const truedenoms = ref((newPool as Pool).reserve_coin_denoms);
const denoms = ref((newPool as Pool).reserve_coin_denoms);

const hasPrices = computed(() => {
  let baseDenoms = denoms.value;
  if (!baseDenoms.length) {
    baseDenoms = props.pool.reserve_coin_denoms;
  }

  const priceA = typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom: baseDenoms[0] });
  const priceB = typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom: baseDenoms[1] });

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
          typedstore.getters[GlobalGetterTypes.API.getVerifyTrace]({
            chain_name: typedstore.getters[GlobalGetterTypes.API.getDexChain],
            hash: newDenoms[0].split('/')[1],
          }) ??
          (await typedstore.dispatch(
            GlobalActionTypes.API.GET_VERIFY_TRACE,
            {
              subscribe: false,
              params: {
                chain_name: typedstore.getters[GlobalGetterTypes.API.getDexChain],
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
          typedstore.getters[GlobalGetterTypes.API.getVerifyTrace]({
            chain_name: typedstore.getters[GlobalGetterTypes.API.getDexChain],
            hash: newDenoms[1].split('/')[1],
          }) ??
          (await typedstore.dispatch(
            GlobalActionTypes.API.GET_VERIFY_TRACE,
            {
              subscribe: false,
              params: {
                chain_name: typedstore.getters[GlobalGetterTypes.API.getDexChain],
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
</script>
