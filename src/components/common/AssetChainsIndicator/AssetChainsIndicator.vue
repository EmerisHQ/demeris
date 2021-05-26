<template>
  <tippy>
    <div class="asset-chains-indicator flex items-center space-x-5 w-full">
      <div class="asset-chains-indicator__list flex w-1/2 justify-end -space-x-3">
        <span
          v-for="indicator of indicators"
          :key="indicator"
          class="asset-chains-indicator__list__item rounded-full border-2 w-12 h-12 border-blue-300"
        />
        <span
          v-if="hasMoreIndicators"
          class="
            asset-chains-indicator__list__more
            rounded-full
            w-12
            h-12
            flex
            items-center
            justify-center
            bg-gray-100
            text-gray-400 text-lg
            select-none
          "
        >
          +
        </span>
      </div>

      <div class="asset-chains-indicator__count">
        <span>{{ chainsCount }}<template v-if="hasMoreChains">+</template> </span>
        chains
      </div>
    </div>

    <template #content>
      <p v-for="balance of filteredBalances" :key="balance.on_chain">
        {{ `${balance.amount} on ${balance.on_chain}` }}
      </p>
    </template>
  </tippy>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import { Balances } from '@/types/api';

export default defineComponent({
  props: {
    balances: {
      type: Object as PropType<Balances>,
      required: true,
    },
    denom: {
      type: String,
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
  setup(props: { maxChainsCount: number; maxIndicators: number; balances: Balances; denom: string }) {
    const filteredBalances = computed(() => {
      return props.balances
        .filter((item) => item.base_denom === props.denom)
        .sort((a, b) => (b.amount > a.amount ? 1 : -1));
    });

    const chainsCount = computed(() => {
      return Math.min(props.maxChainsCount, filteredBalances.value.length);
    });

    const hasMoreChains = computed(() => {
      return filteredBalances.value.length > chainsCount.value;
    });

    // TODO: Get indicator gradient color based in the chain name
    const indicators = computed(() => {
      return filteredBalances.value.slice(0, props.maxIndicators);
    });

    const hasMoreIndicators = computed(() => {
      return filteredBalances.value.length > indicators.value.length;
    });

    return { chainsCount, hasMoreChains, indicators, hasMoreIndicators, filteredBalances };
  },
});
</script>

<style scoped>
.asset-chains-indicator__list__item {
  filter: drop-shadow(0px 4px 8px rgba(159, 240, 236, 0.21));
}
.asset-chains-indicator__list__more {
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.12));
}
</style>
