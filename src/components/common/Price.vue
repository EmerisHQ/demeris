<template>
  <div>
    <CurrencyDisplay :value="displayPrice" :show-dash="showDash" />
    <div v-if="showPriceDiff" class="text-0 font-normal" :class="priceDiffColor">
      {{ $t('pages.asset.priceDiff', priceDiffObject) }}
    </div>
    <span v-if="label" class="ml-1.5 lowercase">
      {{ label }}
    </span>
  </div>
</template>
<script lang="ts">
/* eslint-disable max-lines-per-function */
import { EmerisBase } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { computed, defineComponent, nextTick, PropType, ref, watch } from 'vue';
import { useStore } from 'vuex';

import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import useTheme from '@/composables/useTheme';
import { GlobalGetterTypes } from '@/store';
import { getBaseDenom } from '@/utils/actionHandler';

export default defineComponent({
  name: 'Price',
  components: {
    CurrencyDisplay,
  },
  props: {
    amount: {
      type: Object as PropType<EmerisBase.Amount>,
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
    label: {
      type: String,
      default: null,
    },
  },
  emits: ['displayPrice'],
  setup(props, { emit }) {
    const store = useStore();
    const denom = ref(props.amount.denom);
    const isLoaded = ref(false);
    const theme = useTheme();
    const price = ref();

    const priceObserver = computed(() => {
      return store.getters[GlobalGetterTypes.API.getPrice]({ denom: denom.value });
    });

    const displayPrice = computed(() => {
      const precision =
        store.getters[GlobalGetterTypes.API.getDenomPrecision]({
          name: denom.value,
        }) ?? '6';
      let realAmount = new BigNumber(0);

      if (props.amount.amount && props.amount.amount != '0') {
        realAmount = price.value
          ? new BigNumber(price.value)
              .multipliedBy(new BigNumber(props.amount.amount))
              .dividedBy(10 ** parseInt(precision))
          : new BigNumber(0);
      } else if (!props.showZero) {
        realAmount = price.value ?? new BigNumber(0);
      }

      return realAmount.toFixed(parseInt(precision));
    });

    watch(
      () => displayPrice.value,
      async (value) => {
        emit('displayPrice', parseFloat(value));
      },
      { immediate: true },
    );

    /*
     There are 2 reasons to update the price. Either amount changed or price changed.
     If amount changes, ALWAYS recalculate.
     If price changed, only recalculate if autoUpdate=true or on initial load.
     If the autoUpdate prop is changed, if it is changed to false, do nothing, if changed to true, recalculate
    */

    watch(
      () => props.amount,
      async (value) => {
        denom.value = await getBaseDenom(value.denom);
        price.value = priceObserver.value;
      },
      { immediate: true },
    );
    watch(
      () => priceObserver.value,
      (newPrice) => {
        if (props.autoUpdate || !isLoaded.value) {
          price.value = newPrice;
          isLoaded.value = true;
        }
      },
    );
    watch(
      () => props.autoUpdate,
      (autoUpdate) => {
        if (autoUpdate) {
          nextTick(() => {
            price.value = priceObserver.value;
          });
        }
      },
    );

    const showPriceDiff = computed(() => {
      return props.priceDiffObject && props.priceDiffObject.rawDiff;
    });

    const priceDiffIndicator = computed(() => {
      return props.priceDiffObject.indicator;
    });

    const priceDiffColor = computed(() => {
      if (priceDiffIndicator.value === 'gain') {
        return 'text-positive-text';
      } else if (priceDiffIndicator.value === 'loss') {
        return 'text-negative-text';
      } else {
        return 'text-muted';
      }
    });

    return { theme, displayPrice, showPriceDiff, priceDiffIndicator, priceDiffColor };
  },
});
</script>
