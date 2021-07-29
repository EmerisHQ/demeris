<template>
  <div>
    <template v-if="Array.isArray(displayPrice)">
      {{ displayPrice[0] }}<span>.{{ displayPrice[1] }}</span>
    </template>
    <template v-else>
      {{ displayPrice }}
    </template>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';

import { useStore } from '@/store';
import { Amount } from '@/types/base';
import { getBaseDenom } from '@/utils/actionHandler';

export default defineComponent({
  name: 'Price',
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
      return store.getters['demeris/getPrice']({ denom: denom.value });
    });

    const displayPrice = computed(() => {
      const precision =
        store.getters['demeris/getDenomPrecision']({
          name: denom.value,
        }) ?? '6';
      let value;
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });

      if ((props.amount as Amount).amount) {
        value = price.value
          ? formatter
              .format((price.value * parseInt((props.amount as Amount).amount)) / Math.pow(10, parseInt(precision)))
              .split('.')
          : parseInt((props.amount as Amount).amount) / Math.pow(10, parseInt(precision));
      } else if (!props.showZero) {
        value = price.value ? formatter.format(price.value).split('.') : '-';
      } else {
        value = formatter.format(0);
      }

      return value;
    });

    watch(
      () => props.amount as Amount,
      async (value) => {
        denom.value = await getBaseDenom((value as Amount).denom);
        if (!isLoaded.value) {
          price.value = priceObserver.value;
        }
        isLoaded.value = true;
      },
      { immediate: true },
    );

    watch(
      () => [props.autoUpdate, priceObserver, props.amount],
      ([autoUpdate]) => {
        if (autoUpdate) {
          price.value = priceObserver.value;
        }
      },
    );

    return { displayPrice };
  },
});
</script>
