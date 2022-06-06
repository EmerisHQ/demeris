<template>
  <router-link :to="{ name: 'Pool', params: { id: pool.id } }" class="cursor-pointer">
    <div><TooltipPoolAmount :pool="pool" :denom="denom" />&nbsp;<Ticker :name="denom" /> in {{ pairName }} Pool</div>
  </router-link>
</template>

<script setup lang="ts">
/* eslint-disable max-lines-per-function */
import { ref, watch } from 'vue';
import { useStore } from 'vuex';

import Ticker from '@/components/common/Ticker.vue';
import TooltipPoolAmount from '@/components/liquidity/TooltipPoolAmount.vue';
import usePool from '@/composables/usePool';
import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';
import { Pool } from '@/types/actions';
import { isNative } from '@/utils/basic';

interface Props {
  pool: Pool;
  denom: string;
}

const props = defineProps<Props>();

const newPool = JSON.parse(JSON.stringify(props.pool as Pool));
const typedstore = useStore() as RootStoreTyped;

const { pairName } = usePool((props.pool as Pool).id);
const truedenoms = ref((newPool as Pool).reserve_coin_denoms);
const denoms = ref((newPool as Pool).reserve_coin_denoms);

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
