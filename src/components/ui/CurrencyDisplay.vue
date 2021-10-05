<template>
  <template v-if="!hasValue && showDash">
    <span>-</span>
  </template>

  <i18n-n v-else tag="span" :value="inputValue" format="currency">
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
import { computed, defineComponent } from 'vue';

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
  },
  setup(props) {
    const hasValue = computed(() => !!props.value);

    const inputValue = computed(() => {
      if (!props.preventZero) {
        return props.value;
      }

      const bgValue = new BigNumber(props.value);

      let decimalPlaces = 2;
      const maxDecimalPlaces = 8;

      // This will prevent formatting smaller values like 0.0001 to 0.00
      while (bgValue.decimalPlaces(decimalPlaces).isZero()) {
        decimalPlaces++;
        if (decimalPlaces === maxDecimalPlaces) {
          break;
        }
      }

      return bgValue.decimalPlaces(decimalPlaces).toNumber();
    });

    return { hasValue, inputValue };
  },
});
</script>
