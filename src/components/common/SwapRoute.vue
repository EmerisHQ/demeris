<template>
  <!-- <div class="ml-6 mt-6"> -->
  <!-- <div class="text-2 font-bold">Swap Route</div> -->
  <div class="text-muted">X transc across Y chains</div>
  <div class="timeline-container flex flex-col timeline-block pl-2 my-6">
    <div v-for="item in items" :key="item" class="flex flex-col">
      <span class="flex items-center">
        <span class="flex items-center -ml-6 rounded-full bg-surface">
          <CircleSymbol class="relative" variant="chain" :chain-name="item.chain" :glow="false" size="md" />
          <CircleSymbol :style="{ position: 'absolute' }" class="ml-1" :denom="item.denom" :glow="true" size="sm" />
        </span>
        <span class="ml-4"
          ><span class="denom"><Denom :name="item.denom" /> </span>
          <span class="text-muted">&middot; <ChainName :name="item.chain" /></span
        ></span>
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
  <!-- </div> -->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  name: 'SwapRoute',
  components: {
    CircleSymbol,
    Icon,
    Denom,
    ChainName,
  },
  props: {},
  setup() {
    // TODO:
    // it would be better to do these after steps/abstract steps output from dagg api are final and clear
    // 1. Convert output of the aggregation API to a form usable by this component
    // 2. Add X transaction over Y chains logic
    // 3. add conditional right arrow logic (swap vs transfer icon)
    const items = ref([
      { denom: 'uatom', chain: 'cosmos-hub', subItems: ['Transfer x', 'Swap Y'] },
      { denom: 'uiris', chain: 'irischain', subItems: ['Transfer x', 'Swap Y'] },
      { denom: 'uatom', chain: 'osmosis', subItems: ['Transfer x', 'Swap Y'] },
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
.denom {
  font-weight: 600;
}
</style>
