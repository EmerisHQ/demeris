<template>
  <div class="asset-chains-indicator">
    <tippy class="asset-chains-indicator__wrapper">
      <div class="asset-chains-indicator__list">
        <span v-for="indicator of indicators" :key="indicator" class="asset-chains-indicator__list__item" />
      </div>

      <div class="asset-chains-indicator__count">
        <span>{{ chainsCount }}<template v-if="hasMoreChains">+</template> </span>
        chains
      </div>

      <template #content>
        <p v-for="balance of filteredBalances" :key="balance.on_chain">
          {{ `${balance.amount} on ${balance.on_chain}` }}
        </p>
      </template>
    </tippy>
  </div>
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
        .filter(item => item.base_denom === props.denom)
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

<style lang="scss" scoped>
.asset-chains-indicator {
  display: flex;

  &__wrapper {
    display: inline-flex;
    align-items: center;
  }

  &__list {
    // flex w-1/2 justify-end -space-x-5
    display: flex;
    justify-content: flex-end;
    width: 50%;

    &__item {
      width: 2.4rem;
      height: 2.4rem;
      background: white;
      border-radius: 2.4rem;
      border: 2px solid #9ffeed;

      //  border-2 w-8 h-8 border-blue-300 bg-white

      &:not(:first-child) {
        margin-left: -1.6rem;
      }
    }
  }

  &__count {
    margin-left: 0.8rem;
    white-space: nowrap;
  }
}
</style>
