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
  },
  setup(props) {
    const store = useStore();
    const denom = ref((props.amount as Amount).denom);

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
      const price = store.getters['demeris/getPrice']({ denom: denom.value });
      if ((props.amount as Amount).amount) {
        value = price
          ? formatter
              .format((price * parseInt((props.amount as Amount).amount)) / Math.pow(10, parseInt(precision)))
              .split('.')
          : parseInt((props.amount as Amount).amount) / Math.pow(10, parseInt(precision));
      } else {
        value = price ? formatter.format(price).split('.') : '-';
      }

      return value;
    });

    watch(
      () => props.amount as Amount,
      async (value) => {
        denom.value = await getBaseDenom((value as Amount).denom);
      },
      { immediate: true },
    );

    return { displayPrice };
  },
});
</script>
