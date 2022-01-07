<template>
  <CurrencyDisplay :value="totalLiquidityPrice" show-dash />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import usePool from '@/composables/usePool';
import { Pool } from '@/types/actions';

//import TrendingUpIcon from '../common/Icons/TrendingUpIcon.vue';

export default defineComponent({
  components: { CurrencyDisplay },

  //components: { TrendingUpIcon },

  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true,
    },
  },

  setup(props) {
    const { totalLiquidityPrice } = usePool(props.pool.id);

    return { totalLiquidityPrice };
  },
});
</script>
