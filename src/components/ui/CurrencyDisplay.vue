<template>
  <i18n-n tag="span" :value="value" format="currency">
    <template #currency="slotProps">
      <span>{{ slotProps.currency }}</span>
    </template>
    <template #integer="slotProps">
      <span>{{ slotProps.integer }}</span>
    </template>
    <template #decimal="slotProps">
      <span :class="{ 'text-0 sm:text-1 lg:text-2': smallDecimals }">{{ slotProps.decimal }}</span>
    </template>
    <template #fraction="slotProps">
      <span :class="{ 'text-0 sm:text-1 lg:text-2': smallDecimals }">{{ slotProps.fraction }}</span>
    </template>
  </i18n-n>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    smallDecimals: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
