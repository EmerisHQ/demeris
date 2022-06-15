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
  <i18n-n
    v-else
    tag="span"
    :value="Number(inputValue.toFixed(15))"
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
</template>

<script lang="ts" setup>
import BigNumber from 'bignumber.js';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  value?: any; // Using any because BigNumber is not compatible with typescript, before it was [String, Number, BigNumber]
  smallDecimals?: boolean;
  showDash?: boolean;
  preventZero?: boolean;
  precision?: number;
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  smallDecimals: false,
  showDash: false,
  preventZero: false,
  precision: 6,
});

const maximumFractionDigits = ref(2);

const inputValue = computed(() => new BigNumber(props.value));
const hasValue = computed(
  () => !inputValue.value.isNaN() && inputValue.value.isFinite() && inputValue.value.isGreaterThan(0),
);
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
</script>
