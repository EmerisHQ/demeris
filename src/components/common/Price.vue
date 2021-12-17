<template>
  <div>
    <CurrencyDisplay :value="displayPrice" show-dash />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, nextTick, PropType, ref, watch } from 'vue';
import { useStore } from 'vuex';

import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import { Amount } from '@/types/base';
import { getBaseDenom } from '@/utils/actionHandler';

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
    autoUpdate: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const store = useStore();
    const denom = ref((props.amount as Amount).denom);
    const isLoaded = ref(false);

    const price = ref();

    const priceObserver = computed(() => {
      return store.getters['demerisAPI/getPrice']({ denom: denom.value });
    });

    const displayPrice = computed(() => {
      const precision =
        store.getters['demerisAPI/getDenomPrecision']({
          name: denom.value,
        }) ?? '6';
      let value;

      if ((props.amount as Amount).amount) {
        value = price.value
          ? (price.value * parseInt((props.amount as Amount).amount)) / Math.pow(10, parseInt(precision))
          : 0;
      } else if (!props.showZero) {
        value = price.value;
      } else {
        value = 0;
      }

      return value;
    });

    /*
     There are 2 reasons to update the price. Either amount changed or price changed.
     If amount changes, ALWAYS recalculate.
     If price changed, only recalculate if autoUpdate=true or on initial load.
     If the autoUpdate prop is changed, if it is changed to false, do nothing, if changed to true, recalculate
    */

    watch(
      () => props.amount as Amount,
      async (value) => {
        denom.value = await getBaseDenom((value as Amount).denom);
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

    return { displayPrice };
  },
});
</script>
