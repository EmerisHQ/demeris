<template>
  <div class="asset-chains-indicator flex items-center space-x-4 w-full">
    <div class="asset-chains-indicator__list flex w-1/2 justify-end -space-x-3">
      <span
        v-for="indicator of indicators"
        :key="indicator"
        class="asset-chains-indicator__list__item rounded-full border-2 w-8 h-8 border-blue-300"
      />
      <span
        v-if="hasMoreIndicators"
        class="rounded-full w-9 h-9 flex items-center justify-center bg-gray-100 text-gray-400 font-medium text-xl select-none"
      >
        +
      </span>
    </div>

    <div class="asset-chains-indicator__count">
      <span>{{ chainsCount }}<template v-if="hasMoreChains">+</template> </span>
      chains
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import { Chain } from '@/types/api';

export default defineComponent({
  props: {
    chains: {
      type: Array as PropType<Chain[]>,
      required: true,
    },
    maxIndicators: {
      type: Number,
      required: false,
      default: 3,
    },
    maxChainsCount: {
      type: Number,
      required: false,
      default: 9,
    },
  },
  setup(props: { maxChainsCount: number; maxIndicators: number; chains: Chain[] }) {
    const chainsCount = computed(() => Math.min(props.maxChainsCount, props.chains.length));
    const hasMoreChains = computed(() => props.chains.length > chainsCount.value);

    // TODO: Get indicator gradient color based in the chain name
    const indicators = computed(() => props.chains.slice(0, props.maxIndicators));
    const hasMoreIndicators = computed(() => props.chains.length > indicators.value.length);

    return { chainsCount, hasMoreChains, indicators, hasMoreIndicators };
  },
});
</script>
