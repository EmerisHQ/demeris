<template>
  <router-link :to="{ name: 'Pool', params: { id: pool.id } }" class="cursor-pointer">
    <div><TooltipPoolAmount :pool="pool" :denom="denom" />&nbsp;<Ticker :name="denom" /> in {{ pairName }} Pool</div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { useStore } from 'vuex'

import Ticker from '@/components/common/Ticker.vue'
import TooltipPoolAmount from '@/components/liquidity/TooltipPoolAmount.vue'
import usePool from '@/composables/usePool'
import { GlobalDemerisActionTypes, GlobalDemerisGetterTypes, TypedAPIStore } from '@/store'
import { Pool } from '@/types/actions'
import { isNative } from '@/utils/basic'

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
    const newPool = JSON.parse(JSON.stringify(props.pool as Pool))
    const apistore = useStore() as TypedAPIStore

    const { pairName } = usePool((props.pool as Pool).id)
    const truedenoms = ref((newPool as Pool).reserve_coin_denoms)
    const denoms = ref((newPool as Pool).reserve_coin_denoms)

    watch(
      () => truedenoms.value,
      async (newDenoms) => {
        if (isNative(newDenoms[0])) {
          denoms.value[0] = newDenoms[0]
        } else {
          try {
            const verifyTrace =
              apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({
                chain_name: apistore.getters[GlobalDemerisGetterTypes.API.getDexChain],
                hash: newDenoms[0].split('/')[1],
              }) ??
              (await apistore.dispatch(
                GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
                {
                  subscribe: false,
                  params: {
                    chain_name: apistore.getters[GlobalDemerisGetterTypes.API.getDexChain],
                    hash: newDenoms[0].split('/')[1],
                  },
                },
                { root: true },
              ))
            denoms.value[0] = verifyTrace.base_denom
          } catch (e) {
            denoms.value[0] = newDenoms[0]
          }
        }
        if (isNative(newDenoms[1])) {
          denoms.value[1] = newDenoms[1]
        } else {
          try {
            const verifyTrace =
              apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({
                chain_name: apistore.getters[GlobalDemerisGetterTypes.API.getDexChain],
                hash: newDenoms[1].split('/')[1],
              }) ??
              (await apistore.dispatch(
                GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
                {
                  subscribe: false,
                  params: {
                    chain_name: apistore.getters[GlobalDemerisGetterTypes.API.getDexChain],
                    hash: newDenoms[1].split('/')[1],
                  },
                },
                { root: true },
              ))
            denoms.value[1] = verifyTrace.base_denom
          } catch (e) {
            denoms.value[1] = newDenoms[1]
          }
        }
      },
      { immediate: true },
    )

    return { denoms, truedenoms, pairName }
  },
})
</script>
