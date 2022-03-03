<template>
  <div>
    <CurrencyDisplay :value="displayPrice" :show-dash="showDash" />
    <div v-if="showPriceDiff" class="-text-1 font-normal" :class="priceDiffColor">
      {{ $t('pages.asset.priceDiff', priceDiffObject) }}
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, nextTick, PropType, ref, watch } from 'vue'
import { useStore } from 'vuex'

import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue'
import useTheme from '@/composables/useTheme'
import { GlobalDemerisGetterTypes } from '@/store'
import { Amount } from '@/types/base'
import { getBaseDenom } from '@/utils/actionHandler'

export default defineComponent({
  name: 'Price',
  components: {
    CurrencyDisplay,
  },
  props: {
    amount: {
      type: Object as PropType<Amount>,
      required: true,
    },
    showZero: {
      type: Boolean,
      default: false,
    },
    showDash: {
      type: Boolean,
      default: true,
    },
    autoUpdate: {
      type: Boolean,
      default: true,
    },
    priceDiffObject: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const store = useStore()
    const denom = ref((props.amount as Amount).denom)
    const isLoaded = ref(false)
    const theme = useTheme()
    const price = ref()

    const priceObserver = computed(() => {
      return store.getters[GlobalDemerisGetterTypes.API.getPrice]({ denom: denom.value })
    })

    const displayPrice = computed(() => {
      const precision =
        store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
          name: denom.value,
        }) ?? '6'
      let value

      if ((props.amount as Amount).amount) {
        value = price.value
          ? (price.value * parseInt((props.amount as Amount).amount)) / Math.pow(10, parseInt(precision))
          : 0
      } else if (!props.showZero) {
        value = price.value
      } else {
        value = 0
      }

      return value
    })

    /*
     There are 2 reasons to update the price. Either amount changed or price changed.
     If amount changes, ALWAYS recalculate.
     If price changed, only recalculate if autoUpdate=true or on initial load.
     If the autoUpdate prop is changed, if it is changed to false, do nothing, if changed to true, recalculate
    */

    watch(
      () => props.amount as Amount,
      async (value) => {
        denom.value = await getBaseDenom((value as Amount).denom)
        price.value = priceObserver.value
      },
      { immediate: true },
    )
    watch(
      () => priceObserver.value,
      (newPrice) => {
        if (props.autoUpdate || !isLoaded.value) {
          price.value = newPrice
          isLoaded.value = true
        }
      },
    )
    watch(
      () => props.autoUpdate,
      (autoUpdate) => {
        if (autoUpdate) {
          nextTick(() => {
            price.value = priceObserver.value
          })
        }
      },
    )

    const showPriceDiff = computed(() => {
      return props.priceDiffObject && props.priceDiffObject.rawDiff
    })

    const priceDiffIndicator = computed(() => {
      return props.priceDiffObject.indicator
    })

    const priceDiffColor = computed(() => {
      if (priceDiffIndicator.value === 'gain' && theme.value === 'light') {
        return 'color-gain-light'
      } else if (priceDiffIndicator.value === 'gain' && theme.value === 'system') {
        return 'color-gain-system'
      } else if (priceDiffIndicator.value === 'gain' && theme.value === 'dark') {
        return 'color-gain-dark'
      } else if (priceDiffIndicator.value === 'loss' && theme.value === 'light') {
        return 'color-loss-light'
      } else if (priceDiffIndicator.value === 'loss' && theme.value === 'system') {
        return 'color-loss-system'
      } else {
        return 'color-loss-dark'
      }
    })

    return { theme, displayPrice, showPriceDiff, priceDiffIndicator, priceDiffColor }
  },
})
</script>

<style scoped>
.color-gain-light {
  color: #008223;
}
.color-gain-dark {
  color: #89ff9b;
}
.color-gain-system {
  color: #008223;
}
.color-gain-system {
  color: #008223;
}
.color-loss-light {
  color: #d80228;
}
.color-loss-dark {
  color: #ff6072;
}
.color-loss-system {
  color: #d80228;
}
.color-loss-system {
  color: #d80228;
}
</style>
