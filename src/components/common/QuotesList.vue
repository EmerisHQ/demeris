<template>
  <div class="p-6">
    <div class="text-2 font-bold">Quotes</div>
    <div class="text-0 text-muted">Fees included</div>
  </div>
  <!-- list -->
  <div class="pb-3">
    <div v-for="(quote, index) in quotes" :key="quote.toString()" class="mx-2">
      <!-- list item -->
      <tippy delay="0" :interactive="true" :arrow="false">
        <QuotesListItem
          :quote="quote"
          :is-best-price="index === 0 ? true : false"
          :class="index === quotes.length - 1 ? 'last:pb-4' : ''"
        />
        <template v-if="index === 0" #content>
          <div>sdsd</div>
        </template>
      </tippy>
    </div>
  </div>
</template>

<script lang="ts" setup>
import QuotesListItem from '@/components/common/QuotesListItem.vue';
// eslint-disable-next-line
const props = defineProps({
  quotes: {
    type: Array,
    required: true,
  },
});
</script>
<style lang="scss" scoped></style>
