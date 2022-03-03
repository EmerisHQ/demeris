<template>
  <span>{{ displayValue }} {{ ticker }}</span>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue'
import { useStore } from 'vuex'

import { GlobalDemerisGetterTypes } from '@/store'
import { Amount } from '@/types/base'
import { getBaseDenom, getTicker } from '@/utils/actionHandler'
export default defineComponent({
  name: 'AmountDisplay',
  props: {
    amount: { type: Object as PropType<Amount>, required: true },
    chain: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    const store = useStore()
    const baseDenom = ref(props.amount?.denom)

    const ticker = ref('-')

    const displayValue = computed(() => {
      const precision = store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({ name: baseDenom.value }) ?? 6
      return parseInt((props.amount as Amount).amount) / Math.pow(10, parseInt(precision))
    })

    watch(
      () => props.amount,
      async () => {
        if ((props.amount as Amount).denom !== undefined) {
          ticker.value = await getTicker(
            (props.amount as Amount).denom,
            props.chain || store.getters[GlobalDemerisGetterTypes.API.getDexChain],
          )
          baseDenom.value = await getBaseDenom(props.amount.denom)
        }
      },
      { immediate: true },
    )

    return { ticker, displayValue }
  },
})
</script>
