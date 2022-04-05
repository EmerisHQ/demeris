<template>
  <div class="total-price">
    <CurrencyDisplay :value="displayPrice" :small-decimals="smallDecimals" />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';

import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import { useTotalPortfolioBalance } from '@/composables/useTotalPortfolioBalance';

export default defineComponent({
  components: { CurrencyDisplay },
  props: {
    smallDecimals: {
      type: Boolean as PropType<true | false>,
      default: false,
    },
  },
  setup() {
    return { displayPrice: useTotalPortfolioBalance() };
  },
});
</script>
<style lang="scss" scoped></style>
