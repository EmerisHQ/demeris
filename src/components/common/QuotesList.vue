<template>
  <!-- add min height and background card. check why card is not there -->
  <!-- <div class="p-6">
    <div class="text-2 font-bold">Quotes</div>
    <div class="text-0 text-muted">Fees included</div>
  </div> -->
  <TitleWithGoback :title="'Price'" :func="() => emit('goback')" />
  <div class="pb-3">
    <div v-for="(quote, index) in quotes" :key="quote.toString()" class="mx-2">
      <tippy delay="0" :interactive="false" :arrow="false">
        <QuotesListItem :quote="quote" :is-best-price="index === 0 ? true : false" />
        <template v-if="quote && quote.fee" #content>
          <FeeToken :denom="quote.fee?.denom" :amount="quote.fee?.amount" />
        </template>
      </tippy>
    </div>
  </div>
</template>

<script lang="ts" setup>
import FeeToken from '@/components/common/FeeToken.vue';
import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import QuotesListItem from '@/components/common/QuotesListItem.vue';
// eslint-disable-next-line
const props = defineProps({
  quotes: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['goback']);
</script>
