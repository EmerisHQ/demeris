<template>
  <!-- add min height and background card. check why card is not there -->
  <!-- <div class="swap-widget bg-surface dark:bg-fg rounded-2xl p-6">
    <div class="text-2 font-bold">Quotes</div>
    <div class="text-0 text-muted">Fees included</div>
  </div> -->
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
    <div v-for="(quote, index) in quotes" :key="quote.toString()" class="mx-2">
      <tippy delay="0" :interactive="false" :arrow="false">
        <QuotesListItem
          :quote="quote"
          :index="index"
          :is-best-price="index === 0 ? true : false"
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
    <SwapRoute :quote="quotes[visualizeRouteIndex]" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from '@vue/reactivity';

import FeeToken from '@/components/common/FeeToken.vue';
import TitleSubTitleWithClose from '@/components/common/headers/TitleSubTitleWithClose.vue';
import QuotesListItem from '@/components/common/QuotesListItem.vue';
import SwapRoute from '@/components/common/SwapRoute.vue';

// eslint-disable-next-line
const props = defineProps({
  quotes: {
    type: Array,
    required: true,
  },
});

const selectedQuoteIndex = ref(0);
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

const emit = defineEmits(['goback', 'selectedQuoteIndex']);
</script>
