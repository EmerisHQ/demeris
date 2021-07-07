<template>
  <div v-if="chainsCount > 1" class="asset-chains-indicator">
    <tippy class="asset-chains-indicator__wrapper">
      <div v-if="showIndicators" class="asset-chains-indicator__list">
        <CircleSymbol
          v-for="indicator of indicators"
          :key="indicator.on_chain"
          variant="chain"
          size="sm"
          :chain-name="indicator.on_chain"
          class="asset-chains-indicator__list__item"
        />
      </div>

      <div class="asset-chains-indicator__count">
        <span>{{ chainsCount }}<template v-if="hasMoreChains">+</template> </span>
        chains
      </div>

      <template #content>
        <p v-for="balance of filteredBalances" :key="balance.on_chain">
          {{ `${formatPrecision(balance.amount)} on ${getChainName(balance.on_chain)}` }}
        </p>
      </template>
    </tippy>
  </div>
</template>

<script lang="ts">
import { parseCoins } from '@cosmjs/launchpad';
import { computed, defineComponent, PropType } from 'vue';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import { useStore } from '@/store';
import { Balances } from '@/types/api';

export default defineComponent({
  name: 'AssetChainsIndicator',
  components: {
    CircleSymbol,
  },
  props: {
    balances: {
      type: Object as PropType<Balances>,
      required: true,
    },
    denom: {
      type: String,
      required: true,
    },
    showIndicators: {
      type: Boolean,
      default: true,
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
  setup(props) {
    const store = useStore();
    const filteredBalances = computed(() => {
      return (props.balances as Balances)
        .filter((item) => item.base_denom === props.denom)
        .sort((a, b) => (+parseCoins(b.amount)[0].amount > +parseCoins(a.amount)[0].amount ? 1 : -1));
    });
    const formatPrecision = (amount: string) => {
      return (
        parseInt(parseCoins(amount)[0].amount) /
        Math.pow(
          10,
          store.getters['demeris/getDenomPrecision']({
            name: props.denom,
          }),
        )
      );
    };
    const getChainName = (chain_name) => {
      return store.getters['demeris/getDisplayChain']({
        name: chain_name,
      });
    };
    const chainsCount = computed(() => {
      return Math.min(props.maxChainsCount as number, filteredBalances.value.length);
    });

    const hasMoreChains = computed(() => {
      return filteredBalances.value.length > chainsCount.value;
    });

    // TODO: Get indicator gradient color based in the chain name
    const indicators = computed(() => {
      return filteredBalances.value.slice(0, props.maxIndicators as number);
    });

    const hasMoreIndicators = computed(() => {
      return filteredBalances.value.length > indicators.value.length;
    });

    return {
      chainsCount,
      hasMoreChains,
      indicators,
      hasMoreIndicators,
      filteredBalances,
      formatPrecision,
      getChainName,
    };
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
    display: flex;
    justify-content: flex-end;
    width: 50%;
    margin-right: 0.8rem;

    &__item {
      &:not(:first-child) {
        margin-left: -1.6rem;
      }
    }
  }

  &__count {
    white-space: nowrap;
  }
}
</style>
