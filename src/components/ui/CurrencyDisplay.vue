<template>
  <template v-if="!hasValue && showDash">
    <span>-</span>
  </template>
  <i18n-n
    v-else-if="!hasValue && !showDash"
    tag="span"
    :value="0"
    :format="{ key: 'currency', maximumFractionDigits }"
    :i18n="i18n"
  >
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
  <i18n-n v-else tag="span" :value="inputValue" :format="{ key: 'currency', maximumFractionDigits }" :i18n="i18n">
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
import { useI18n } from 'vue-i18n';

export default defineComponent({
  props: {
    value: {
      type: [String, Number, BigNumber],
      required: false,
      default: '',
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
    const maximumFractionDigits = ref(2);
    const inputValue = computed(() => Number(props.value));
    const hasValue = computed(() => !isNaN(inputValue.value) && isFinite(inputValue.value) && inputValue.value > 0);
    const i18n = useI18n({ useScope: 'global' });
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

    return { hasValue, maximumFractionDigits, inputValue, i18n };
  },
});
</script>
