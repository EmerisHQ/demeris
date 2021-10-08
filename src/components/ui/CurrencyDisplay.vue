<template>
  <template v-if="!hasValue && showDash">
    <span>-</span>
  </template>

  <i18n-n v-else tag="span" :value="value" :format="{ key: 'currency', maximumFractionDigits }">
    <template #currency="slotProps">
      <span>{{ slotProps.currency }}</span>
    </template>
    <template #integer="slotProps">
      <span>{{ slotProps.integer }}</span>
    </template>
    <template #decimal="slotProps">
      <span key="decimal" :class="[{ 'text-0 sm:text-1 lg:text-2': smallDecimals }]">
        {{ slotProps.decimal }}
      </span>
    </template>
    <template #fraction="slotProps">
      <span key="fraction" :class="[{ 'text-0 sm:text-1 lg:text-2': smallDecimals }]">
        {{ slotProps.fraction }}
      </span>
    </template>
  </i18n-n>
</template>

<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, ref, watch } from 'vue';

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
    showDash: {
      type: Boolean,
      default: false,
    },
    preventZero: {
      type: Boolean,
      default: false,
    },
    precision: {
      type: Number,
      default: 6,
    },
  },
  setup(props) {
    const hasValue = computed(() => !!props.value);
    const maximumFractionDigits = ref(2);

    watch(
      () => [props.value, props.precision],
      () => {
        const bgValue = new BigNumber(props.value);

        // This will prevent formatting smaller values like 0.0001 to 0.00
        if (bgValue.decimalPlaces(2).isZero()) {
          maximumFractionDigits.value = props.precision;
        } else {
          maximumFractionDigits.value = 2;
        }
      },
      { immediate: true },
    );

    return { hasValue, maximumFractionDigits };
  },
});
</script>
