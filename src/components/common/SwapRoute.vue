<template>
  <div class="ml-6 mt-6">
    <div class="text-2 font-bold">Swap Route</div>
    <div class="text-muted">X transc across Y chains</div>
    <div class="timeline-container flex flex-col timeline-block pl-2 my-6">
      <div v-for="item in items" :key="item" class="flex flex-col">
        <span class="flex items-center">
          <span class="flex items-center -ml-6 rounded-full bg-surface">
            <CircleSymbol class="relative" variant="chain" :chain-name="'cosmos-hub'" :glow="false" size="md" />
            <CircleSymbol :style="{ position: 'absolute' }" class="ml-1" :denom="'uatom'" :glow="true" size="sm" />
          </span>
          <span class="ml-4">{{ item.denom }} &middot; {{ item.chain }} </span>
        </span>
        <div v-if="item && item.subItems && !!item.subItems.length" class="my-6">
          <template v-for="subItem in item?.subItems" :key="subItem">
            <div class="sub-item flex items-center">
              <span class="sub-item-icon rounded-full -ml-6 bg-surface">
                <Icon class="relative" name="DaggSwapLRIcon" :icon-size="1" />
                <!-- DaggArrowRightIcon -->
              </span>
              <span class="ml-4">
                {{ subItem }}
              </span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  name: 'SwapRoute',
  components: {
    CircleSymbol,
    Icon,
  },
  props: {},
  setup() {
    const items = ref([
      { denom: 'atom', chain: 'somcahin', subItems: ['Transfer x', 'Swap Y'] },
      { denom: 'iris', chain: 'irischain', subItems: ['Transfer x', 'Swap Y'] },
      { denom: 'osmo', chain: 'osmo', subItems: ['Transfer x', 'Swap Y'] },
      { denom: 'lastcoin', chain: 'lastchain' },
    ]);
    return { items };
  },
});
</script>
<style lang="scss" scoped>
.timeline-container {
  border-left: 2px solid var(--border);
  margin-left: 1rem;
}
.sub-item:not(:first-child) {
  margin-top: 0.5rem;
}
.sub-item-icon {
  border: 2px solid var(--border);
  display: flex;
  height: 2rem;
  width: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
