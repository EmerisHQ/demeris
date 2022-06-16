<template>
  <div
    v-if="!isVisualizeRouteVisible"
    class="relative w-full z-10 overflow-hidden bg-surface shadow-panel rounded-2xl pb-3"
  >
    <TitleSubTitleWithClose
      title="Quotes"
      sub-title="Fees included"
      class="py-6 pl-6"
      :func="
        () => {
          isVisualizeRouteVisible = false;
          emit('goback');
        }
      "
    />
    <div v-for="(quote, index) in routesTransformedToQuotes" :key="quote.toString()" class="mx-2">
      <tippy delay="0" :interactive="false" :arrow="false">
        <QuotesListItem
          :quote="quote"
          :index="index"
          :is-best-price="index === 0"
          :is-selected-quote="selectedQuoteIndex === index"
          @click="selectQuote(index)"
          @visualizeRoute="visualizeRoute({ quote, index })"
        />
        <template v-if="quote && quote.fee" #content>
          <FeeToken :denom="quote.fee?.denom" :amount="quote.fee?.amount" />
        </template>
      </tippy>
    </div>
  </div>
  <div v-else class="relative w-full z-10 overflow-hidden bg-surface shadow-panel rounded-2xl">
    <TitleSubTitleWithClose
      class="ml-6 mt-6"
      title="Swap route"
      sub-title="TODO"
      :func="
        () => {
          isVisualizeRouteVisible = false;
          emit('goback');
        }
      "
    />
    <SwapRoute :quote="routes[visualizeRouteIndex]" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import FeeToken from '@/components/common/FeeToken.vue';
import TitleSubTitleWithClose from '@/components/common/headers/TitleSubTitleWithClose.vue';
import QuotesListItem from '@/components/common/QuotesListItem.vue';
import SwapRoute from '@/components/common/SwapRoute.vue';
import usePrice from '@/composables/usePrice';
import { GlobalGetterTypes } from '@/store';

interface Props {
  routes: any[];
  selectedQuoteIndex: number;
  typeChanged?: string;
}

const props = defineProps<Props>();

const store = useStore();
const { getDisplayPrice } = usePrice();

const selectedQuoteIndex = ref(props.selectedQuoteIndex || 0);
const isVisualizeRouteVisible = ref(false);
const visualizeRouteIndex = ref(0);

const selectQuote = (index) => {
  selectedQuoteIndex.value = index;
  emit('selectedQuoteIndex', index);
};

const visualizeRoute = ({ index }) => {
  isVisualizeRouteVisible.value = true;
  visualizeRouteIndex.value = index;
};

const routesTransformedToQuotes = computed(() => {
  const quotesArr = [] as any;
  for (const route of props.routes) {
    const routeObj = {} as any;
    const numberOfSteps = (route as any).steps.length;
    routeObj.dex = (route as any).steps[0].protocol; //can steps have diff protocols? incorprate if yes
    routeObj.amount = (
      (route as any).steps[numberOfSteps - 1].data.to.amount /
      (10 **
        store.getters[GlobalGetterTypes.API.getDenomPrecision]({
          name: (route as any).steps[numberOfSteps - 1].data.to.denom,
        }) || 6)
    ).toFixed(4);
    routeObj.denom = (route as any).steps[numberOfSteps - 1].data.to.denom;
    routeObj.numberOfTransactions = numberOfSteps;
    routeObj.usdAmount = getDisplayPrice((route as any).steps[numberOfSteps - 1].data.to.denom, routeObj.amount).value;
    //fee token when?
    if (props?.typeChanged === 'Receive') {
      routeObj.amount = (
        (route as any).steps[0].data.from.amount /
        (10 **
          store.getters[GlobalGetterTypes.API.getDenomPrecision]({
            name: (route as any).steps[0].data.from.denom,
          }) || 6)
      ).toFixed(4);
      routeObj.denom = (route as any).steps[0].data.from.denom;
      routeObj.usdAmount = getDisplayPrice((route as any).steps[0].data.from.denom, routeObj.amount).value;
    }
    quotesArr.push(routeObj);
  }
  return quotesArr;
});

const emit = defineEmits(['goback', 'selectedQuoteIndex']);
</script>
