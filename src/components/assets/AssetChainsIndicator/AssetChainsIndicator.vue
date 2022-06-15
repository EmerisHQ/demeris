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

<script setup lang="ts">
import { EmerisAPI } from '@emeris/types';
import { computed, toRefs, unref } from 'vue';
import { useStore } from 'vuex';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { parseCoins } from '@/utils/basic';

interface Props {
  balances: EmerisAPI.Balances;
  denom: string;
  maxIndicators?: number;
  maxChainsCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxIndicators: 3,
  maxChainsCount: 9,
});

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
</script>

<style lang="scss" scoped></style>
