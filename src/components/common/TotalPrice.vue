<template>
  <div class="total-price">
    <CurrencyDisplay :value="displayPrice" :small-decimals="smallDecimals" />
  </div>
</template>

<script setup lang="ts">
import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import { useTotalPortfolioBalance } from '@/composables/useTotalPortfolioBalance';

interface Props {
  smallDecimals?: boolean;
}
withDefaults(defineProps<Props>(), { smallDecimals: false });
const displayPrice = useTotalPortfolioBalance();
</script>

<style lang="scss" scoped></style>
