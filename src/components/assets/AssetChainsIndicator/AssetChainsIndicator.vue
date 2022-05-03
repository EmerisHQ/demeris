<template>
  <tippy v-if="chainsCount > 1" class="block w-8 h-8 relative">
    <CircleSymbol variant="chain" :chain-name="indicators[0].on_chain" :glow="false" />
    <div class="absolute inset-0.5 -text-1 font-normal z-10 flex items-center justify-center">
      <span>{{ chainsCount }}<template v-if="hasMoreChains">+</template></span>
    </div>

    <template #content>
      <p v-for="balance of filteredBalances" :key="balance.on_chain">
        {{
          $t('context.assets.onchain', {
            amount: formatPrecision(balance.amount),
            chain: getChainName(balance.on_chain),
          })
        }}
      </p>
    </template>
  </tippy>
</template>

<script lang="ts">
import { EmerisAPI } from '@emeris/types';
import { computed, defineComponent, PropType, toRefs, unref } from 'vue';
import { useStore } from 'vuex';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { parseCoins } from '@/utils/basic';

export default defineComponent({
  name: 'AssetChainsIndicator',
  components: {
    CircleSymbol,
  },
  props: {
    balances: {
      type: Array as PropType<EmerisAPI.Balances>,
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
  setup(props) {
    const store = useStore() as RootStoreTyped;
    const propsRef = toRefs(props);

    const filteredBalances = computed(() => {
      return (
        unref(propsRef.balances)
          ?.filter((item) => item.base_denom === props.denom)
          .sort((a, b) => (+parseCoins(b.amount)[0].amount > +parseCoins(a.amount)[0].amount ? 1 : -1)) ?? []
      );
    });
    const formatPrecision = (amount: string) => {
      return (
        parseInt(parseCoins(amount)[0].amount) /
        Math.pow(
          10,
          store.getters[GlobalGetterTypes.API.getDenomPrecision]({
            name: props.denom,
          }),
        )
      );
    };
    const getChainName = (chain_name) => {
      return store.getters[GlobalGetterTypes.API.getDisplayChain]({
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

<style lang="scss" scoped></style>
