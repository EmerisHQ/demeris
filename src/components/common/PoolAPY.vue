<template>
  <div class="inline-flex items-center" :class="{ trUp: poolAPY.change == '+', trDown: poolAPY.change == '-' }">
    {{ (poolAPY.apy * 100).toFixed(2) }}%
    <TrendingUpIcon v-if="poolAPY.change == '+' || poolAPY.change == '-'" :class="{ flip: poolAPY.change == '-' }" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch } from 'vue';

import usePool from '@/composables/usePool';
import { Pool } from '@/types/actions';

import TrendingUpIcon from '../common/Icons/TrendingUpIcon.vue';

export default defineComponent({
  name: 'PoolAPY',

  components: { TrendingUpIcon },

  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true,
    },
  },

  setup(props) {
    const { poolAPY } = usePool(props.pool.id);
    watch(
      () => poolAPY.value.change,
      (direction) => {
        if (direction == '+') {
          console.log('up');
        }
        if (direction == '-') {
          console.log('down');
        }
      },
    );
    return { poolAPY };
  },
});
</script>
<style lang="scss" scoped>
.flip {
  transform: scaleY(-1);
}
.trUp {
  color: var(--positive-text);
}
.trDown {
  color: var(--negative-text);
}
</style>
