<template>
  <!-- <div class="ml-6 mt-6"> -->
  <!-- <div class="text-2 font-bold">Swap Route</div> -->
  <!-- <div class="text-muted">X transc across Y chains</div> -->
  <div class="timeline-container flex flex-col timeline-block pl-2 my-6">
    <div v-for="item in route" :key="item" class="flex flex-col">
      <span class="flex items-center">
        <span class="flex items-center -ml-6 rounded-full bg-surface">
          <CircleSymbol
            class="relative"
            variant="chain"
            :display-status="false"
            :chain-name="item.chain"
            :glow="false"
            size="md"
          />
          <CircleSymbol
            :style="{ position: 'absolute' }"
            class="ml-1"
            :display-status="false"
            :denom="item.denom"
            :glow="true"
            size="sm"
          />
        </span>
        <span class="ml-4"
          ><span class="denom"><Denom :name="item.denom" /> </span>
          <span class="text-muted"> &middot; <ChainName :name="item.chain" /></span
        ></span>
      </span>
      <div v-if="item && item.transactions && !!item.transactions.length" class="my-6">
        <template v-for="subItem in item?.transactions" :key="subItem">
          <div class="sub-item flex items-center">
            <span class="sub-item-icon rounded-full -ml-6 bg-surface">
              <Icon v-if="subItem.includes('Swap')" class="relative" name="DaggSwapLRIcon" :icon-size="1" />
              <Icon v-else class="relative" name="DaggArrowRightIcon" :icon-size="1" />
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
import { computed, defineComponent } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import Icon from '@/components/ui/Icon.vue';
import { capitalizeFirstLetter } from '@/utils/basic';

export default defineComponent({
  name: 'SwapRoute',
  components: {
    CircleSymbol,
    Icon,
    Denom,
    ChainName,
  },
  props: {
    quote: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    // const numberOftransactions = computed(() => {
    //   for(let ) //subitems length sum
    // })

    // const chains = computed(() => {
    //   //diff chains per item.. set
    // })
    // TODO:
    // it would be better to do these after steps/abstract steps output from dagg api are final and clear
    // 1. Convert output of the aggregation API to a form usable by this component
    // 2. Add X transaction over Y chains logic
    // 3. add conditional right arrow logic (swap vs transfer icon) (Done)
    // Create type for items if applicable
    // const items = ref([
    //   { denom: 'uatom', chain: 'cosmos-hub', subItems: ['Transfer x', 'Swap Y'] },
    //   { denom: 'uiris', chain: 'irischain', subItems: ['Transfer x', 'Swap Y'] },
    //   { denom: 'uatom', chain: 'osmosis', subItems: ['Transfer x', 'Swap Y'] },
    //   { denom: 'lastcoin', chain: 'lastchain' },
    // ]);

    const route = computed(() => {
      const items = [];
      let carryOver = null;
      let lastType = null;
      let steps = props.quote.route.steps;
      for (let stepIndex = steps.length - 1; stepIndex >= 0; stepIndex--) {
        let item = { transactions: [] };
        if (lastType !== steps[stepIndex].type && carryOver) {
          (item as any).transactions.push(carryOver);
        }
        if (steps[stepIndex].type === 'pool') {
          lastType = 'pool';
          stepIndex === steps.length - 1
            ? (carryOver = `Swap on ${capitalizeFirstLetter(steps[stepIndex].protocol)}`)
            : (item as any).transactions.unshift(`Swap on ${capitalizeFirstLetter(steps[stepIndex].protocol)}`);
          (item as any).denom = steps[stepIndex].data.to.base_denom;
          (item as any).chain = 'osmosis'; //chain how. change this.
        } else if (steps[stepIndex].type === 'ibc') {
          lastType = 'ibc';
          stepIndex === steps.length - 1
            ? (carryOver = `Transfer to Osmosis`)
            : (item as any).transactions.unshift(`Transfer to Osmosis`); //remove hardcoding
          (item as any).denom = steps[stepIndex].data.to.base_denom;
          (item as any).chain = 'osmosis'; //chain how
        } else {
          console.log(`which type? :P : ${steps[stepIndex].type}`);
        }
        items.unshift(item);
      }

      return items;
    });
    return { route };
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
