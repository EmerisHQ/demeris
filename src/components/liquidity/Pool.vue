<template>
  <div class="pool flex flex-col rounded-xl p-12 shadow">
    <div class="pool__main flex-1 flex items-start justify-between">
      <div class="pool__main__token-pair -space-x-4 inline-flex items-center">
        <span class="h-16 w-16 rounded-full bg-gray-200" />
        <span class="h-16 w-16 rounded-full bg-gray-300" />
      </div>

      <div class="pool__trending inline-flex space-x-1 text-green-700 font-bold">
        <span class="pool__trending__icon">
          <TrendingUpIcon class="w-8 h-8" />
        </span>
        <span class="pool__trending__value">
          18%
        </span>
      </div>
    </div>

    <div class="pool__footer flex flex-col space-y-1">
      <p class="pool__pair font-bold uppercase">{{ pairName }}</p>
      <span class="pool__price">$1,544.05</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import { Pool } from '@/types/actions';

import TrendingUpIcon from '../common/Icons/TrendingUpIcon.vue';

export default defineComponent({
  name: 'Pool',

  components: { TrendingUpIcon },

  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true,
    },
  },

  setup(props) {
    const pairName = computed(() => {
      return (props.pool as Pool).reserveCoinDenoms.join(' / ');
    });

    return { pairName };
  },
});
</script>
