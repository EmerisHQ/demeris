<template>
  <!-- add min height and background card. check why card is not there -->
  <!-- <div class="p-6">
    <div class="text-2 font-bold">Quotes</div>
    <div class="text-0 text-muted">Fees included</div>
  </div> -->
  <div v-if="!isVisualizeRouteVisible" class="pb-3">
    <TitleWithGoback
      :title="'Price'"
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
  <div v-else>
    <TitleWithGoback
      :title="'Swap route'"
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
import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
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
