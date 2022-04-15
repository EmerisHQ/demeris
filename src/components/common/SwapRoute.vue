<template>
  <div class="ml-6 mt-6">
    <div class="timeline-container flex flex-col timeline-block pl-2 my-6">
      <div v-for="item in routeProcessed" :key="item" class="flex flex-col">
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
          <span class="ml-4">
            <span class="denom">
              <Denom :name="item.denom" />
            </span>
            <span class="text-muted">
              &middot;
              <ChainName :name="item.chain" />
            </span>
          </span>
        </span>
        <div v-if="item && item.transactions && !!item.transactions.length" class="my-6">
          <template v-for="subItem in item?.transactions" :key="subItem">
            <div class="sub-item flex items-center">
              <span class="sub-item-icon rounded-full -ml-6 bg-surface">
                <Icon v-if="subItem.includes('Swap')" class="relative" name="DaggSwapLRIcon" :icon-size="1" />
                <Icon v-else class="relative" name="DaggArrowRightIcon" :icon-size="1" />
              </span>
              <span class="ml-4">{{ subItem }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRaw } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { useStore } from 'vuex';

import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalActionTypes, GlobalGetterTypes } from '@/store';
import { getBaseDenom } from '@/utils/actionHandler';
import { capitalizeFirstLetter, getChainFromDex } from '@/utils/basic';

const props = defineProps({
  quote: {
    type: Object,
    required: true,
  },
});

const store = useStore();
const routeProcessed = ref(null);
// const numberOftransactions = computed(() => {
//   for(let ) //subitems length sum
// })

// const chains = computed(() => {
//   //diff chains per item.. set
// })

// TODO:
// 2. Add X transaction over Y chains logic

const getChainName = (chain_name) => {
  return store.getters[GlobalGetterTypes.API.getDisplayChain]({
    name: chain_name,
  });
};

const getChainNameByBaseDenom = (denom) => {
  return store.getters[GlobalGetterTypes.API.getChainNameByBaseDenom]({
    denom: denom,
  });
};

const getVerifyTrace = async (chainName, hash) => {
  return toRaw(
    (await store.getters[GlobalGetterTypes.API.getVerifyTrace]({
      chain_name: chainName,
      hash: hash,
    })) ??
      (await store.dispatch(
        GlobalActionTypes.API.GET_VERIFY_TRACE,
        {
          subscribe: false,
          params: {
            chain_name: chainName,
            hash: hash,
          },
        },
        { root: true },
      )),
  );
};

/**
 * The following function transforms the API response into the following form:

  const items = ref([
    { denom: 'uatom', chain: 'cosmos-hub', transactions: ['Transfer x', 'Swap Y'] },
    { denom: 'uatom', chain: 'osmosis', transactions: ['Transfer x', 'Swap Y'] },
    { denom: 'lastcoin', chain: 'lastchain' },
  ]);

 * Proceed at your own risk.
 */

const route = async () => {
  const items = [];
  let carryOverChain = null;
  // let lastPoolChain = null;
  let steps = props.quote.steps;
  for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
    let item = { transactions: [] };
    if (steps[stepIndex].type === 'ibc') {
      let verifyTraceFrom = await getVerifyTrace(
        getChainFromDex(steps[stepIndex].protocol),
        steps[stepIndex].data.from.denom.split('/')[1],
      );
      // let verifyTraceTo = await getVerifyTrace(
      //   getChainFromDex(steps[stepIndex].protocol),
      //   steps[stepIndex].data.to.denom.split('/')[1],
      // );
      if (items && items.length && stepIndex !== steps.length - 1) {
        // items[items.length - 1].chain = steps[stepIndex].data.from.denom.includes('/')
        //   ? verifyTraceFrom.trace[0].counterparty_name
        //   : getChainNameByBaseDenom(steps[stepIndex].data.from.denom);

        // items[items.length - 1]?.transactions?.push(
        //   `Transfer to ${
        //     steps[stepIndex].data.from.denom.includes('/')
        //       ? getChainName(verifyTraceFrom.trace[0].counterparty_name)
        //       : getChainName(getChainNameByBaseDenom(steps[stepIndex].data.from.denom))
        //   }`,
        // );
        // if (lastPoolChain !== getChainFromDex(steps[stepIndex].protocol)) {
        //   items[items.length - 1].chain = getChainFromDex(steps[stepIndex].protocol);
        //   items[items.length - 1]?.transactions?.push(
        //     `Transfer to ${getChainName(getChainFromDex(steps[stepIndex].protocol))}`,
        //   );
        // } else {
        // }
        //  compare protocol, counterparty for to and from..
        //   both ibc - get chainin. from ibc - counterparty. to ibc - dexchain. no ibc - to chainfromdenom
        if (steps[stepIndex].data.from.denom.includes('/') && steps[stepIndex].data.to.denom.includes('/')) {
          //handle case
          // carryOverChain = getChainFromDex(steps[stepIndex].protocol);
        } else if (steps[stepIndex].data.from.denom.includes('/')) {
          // items[items.length - 1].chain = verifyTraceFrom?.trace[0]?.counterparty_name;
          carryOverChain = verifyTraceFrom?.trace[0]?.counterparty_name;
          items[items.length - 1]?.transactions?.push(
            `Transfer to ${getChainName(verifyTraceFrom?.trace[0]?.counterparty_name)}`,
          );
        } else if (steps[stepIndex].data.to.denom.includes('/')) {
          carryOverChain = getChainFromDex(steps[stepIndex].protocol);
          // items[items.length - 1].chain = getChainFromDex(steps[stepIndex].protocol);
          items[items.length - 1]?.transactions?.push(
            `Transfer to ${getChainName(getChainFromDex(steps[stepIndex].protocol))}`,
          );
        } else {
          carryOverChain = getChainFromDex(getChainNameByBaseDenom(steps[stepIndex].data.to.denom));
          // items[items.length - 1].chain = getChainNameByBaseDenom(steps[stepIndex].data.to.denom);
          items[items.length - 1]?.transactions?.push(
            `Transfer to ${getChainName(getChainNameByBaseDenom(steps[stepIndex].data.to.denom))}`,
          );
        }
      }
    } else if (steps[stepIndex].type === 'pool') {
      (item as any).denom = await getBaseDenom(
        steps[stepIndex].data.from.denom,
        getChainFromDex(steps[stepIndex].protocol),
      );
      (item as any).chain = getChainFromDex(steps[stepIndex].protocol);
      // lastPoolChain = item.chain;
      (item as any).transactions.push(`Swap on ${capitalizeFirstLetter(steps[stepIndex].protocol)}`);
      if (carryOverChain) {
        // (item as any).transactions.unshift(`Transfer to ${getChainName(carryOverChain)}`);
        (item as any).chain = carryOverChain;
        carryOverChain = null;
      }
      items.push(item);
    } else {
      console.log(`new type : ${steps[stepIndex].type}`);
    }
  }
  if (steps[steps.length - 1].type === 'pool') {
    items.push({
      chain: getChainFromDex(steps[steps.length - 1].protocol),
      denom: await getBaseDenom(
        steps[steps.length - 1].data.to.denom,
        getChainFromDex(steps[steps.length - 1].protocol),
      ),
    });
  }
  if (steps[steps.length - 1].type === 'ibc') {
    items[items.length - 1]?.transactions?.push(
      `Transfer to ${getChainName(getChainNameByBaseDenom(steps[steps.length - 1].data.to.denom))}`,
    );
    items.push({
      chain: getChainNameByBaseDenom(steps[steps.length - 1].data.to.denom),
      denom: await getBaseDenom(
        steps[steps.length - 1].data.to.denom,
        getChainFromDex(steps[steps.length - 1].protocol),
      ),
    });
  }
  if (steps[0].type === 'ibc') {
    items[0].chain = getChainNameByBaseDenom(steps[0].data.from.denom); //use chainIn. handle input ibc case
    if (items[0].chain !== getChainFromDex(steps[0].protocol)) {
      items[0]?.transactions?.unshift(`Transfer to ${getChainName(getChainFromDex(steps[0].protocol))}`);
    }
  }
  console.log(items);
  return items;
};

onMounted(async () => {
  routeProcessed.value = await route();
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
