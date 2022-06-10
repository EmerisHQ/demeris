<template>
  <section v-if="osmosisDown" class="w-full rounded-xl h-fit bg-fg p-6 flex flex-col justify-between mb-5">
    <div>
      <h4 class="text-0 font-bold mb-2.5">Osmosis chain is halted</h4>
      <p class="text-muted -text-1 leading-normal">
        The Osmosis chain has been halted due to technical issues. The swap widget which is powered by the Osmosis DEX
        will be unavailable during this time. Your balances on the Osmosis chain might be inaccurate.
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';

const typedstore = useStore() as RootStoreTyped;
const osmosisDown = computed(() => {
  const chainStatus = typedstore.getters[GlobalGetterTypes.API.getChainStatus]({
    chain_name: 'osmosis',
  });
  return !chainStatus;
});
</script>
