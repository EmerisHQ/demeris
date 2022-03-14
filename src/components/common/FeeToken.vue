<template>
  <div class="flex flex-col justify-center">
    <CircleSymbol :style="{ position: 'absolute' }" class="ml-0" :denom="denom" :glow="false" size="sm" />
    <div class="ml-8">
      <div class="font-medium">Fee token required</div>
      <div class="text-muted theme-inverse">{{ amount }} {{ denom?.toUpperCase() }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CircleSymbol from '@/components/common/CircleSymbol.vue';

// eslint-disable-next-line
const props = defineProps({
  denom: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});
</script>
<style lang="scss" scoped></style>
