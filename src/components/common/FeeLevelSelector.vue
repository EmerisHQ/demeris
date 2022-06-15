<template>
  <div
    v-if="steps"
    class="fees flex justify-between cursor-pointer pb-6 group"
    :class="isFeesOpen ? 'text-text font-bold' : 'text-muted hover:text-text'"
    @click="toggle"
  >
    <div>{{ $t('components.feeLevelSelector.feesIncl') }}</div>
    <div class="fees-total flex items-center">
      <span v-show="!isFeesOpen"> ~{{ totalFee }} </span>
      <Icon
        name="CaretDownIcon"
        :icon-size="1"
        class="text-inactive group-hover:text-current ml-1 transform transition-transform"
        :class="{ 'rotate-180 text-current': isFeesOpen }"
      />
    </div>
  </div>
  <div v-if="isFeesOpen" class="fees-detail pb-6 space-y-6">
    <div class="fees-detail__info flex items-center justify-between">
      <div class="fees-detail__info-key">{{ $t('components.feeLevelSelector.transactionFee', { txCount }) }}</div>
      <div class="fees-detail__info-value">
        <CurrencyDisplay :value="fees[gasPriceLevel] * txCount" prevent-zero />
      </div>
    </div>

    <div class="fees-detail__selector flex items-center justify-stretch space-x-3">
      <button
        class="fees-detail__selector-block w-full h-auto py-3 px-2 text-center rounded-lg border-none outline-none appearance-none"
        :class="
          gasPriceLevel === GasPriceLevel.Low
            ? 'bg-brand dark:theme-inverse text-text font-medium shadow-button'
            : 'bg-fg font-normal'
        "
        @click="gasPriceLevel = GasPriceLevel.Low"
      >
        <div class="fees-detail__selector-block-level">{{ $t('context.feeLevels.low') }}</div>
        <div class="fees-detail__selector-block-value font-normal -text-1 mt-0.5">
          <CurrencyDisplay :value="fees[GasPriceLevel.Low]" prevent-zero />
        </div>
      </button>
      <button
        class="fees-detail__selector-block w-full h-auto py-3 px-2 text-center rounded-lg border-none outline-none appearance-none"
        :class="
          gasPriceLevel === GasPriceLevel.Average
            ? 'bg-brand dark:theme-inverse text-text font-medium'
            : 'bg-fg font-normal'
        "
        @click="gasPriceLevel = GasPriceLevel.Average"
      >
        <div class="fees-detail__selector-block-level">{{ $t('context.feeLevels.average') }}</div>
        <div class="fees-detail__selector-block-value font-normal -text-1 mt-0.5">
          <CurrencyDisplay :value="fees[GasPriceLevel.Average]" prevent-zero />
        </div>
      </button>
      <button
        class="fees-detail__selector-block w-full h-auto py-3 px-2 text-center rounded-lg border-none outline-none appearance-none"
        :class="
          gasPriceLevel === GasPriceLevel.High
            ? 'bg-brand dark:theme-inverse text-text font-medium'
            : 'bg-fg font-normal'
        "
        @click="gasPriceLevel = GasPriceLevel.High"
      >
        <div class="fees-detail__selector-block-level">{{ $t('context.feeLevels.high') }}</div>
        <div class="fees-detail__selector-block-value font-normal -text-1 mt-0.5">
          <CurrencyDisplay :value="fees[GasPriceLevel.High]" prevent-zero />
        </div>
      </button>
    </div>

    <Alert
      v-if="gasPriceLevel === GasPriceLevel.Low"
      status="warning"
      :message="$t('components.feeLevelSelector.slowWarning')"
      class="mt-4"
    />

    <div v-if="swapTx" class="fees-detail__info s-minus flex items-center justify-between">
      <div class="fees-detail__info-key">{{ $t('components.feeLevelSelector.swapFee') }}</div>
      <div class="fees-detail__info-value">
        {{ swapFee }}
      </div>
    </div>

    <div class="fees-detail__info flex items-center justify-between">
      <div class="fees-detail__info-key">{{ $t('components.feeLevelSelector.estimate') }}</div>
      <div class="fees-detail__info-value font-bold">
        {{ totalFee }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/naming-convention */
import { EmerisFees } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';

import Alert from '@/components/ui/Alert.vue';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';
import { Step, SwapData } from '@/types/actions';
import { feeForSteps, getTicker } from '@/utils/actionHandler';

interface Props {
  steps: Step[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:fees', fees: any): void;
}>();

const store = useStore();
const typedstore = store as RootStoreTyped;
const lowFee = ref({});
const avgFee = ref({});
const highFee = ref({});
onMounted(async () => {
  lowFee.value = await feeForSteps(props.steps as Step[], EmerisFees.GasPriceLevel.Low);
  avgFee.value = await feeForSteps(props.steps as Step[], EmerisFees.GasPriceLevel.Average);
  highFee.value = await feeForSteps(props.steps as Step[], EmerisFees.GasPriceLevel.High);
});
watch(
  () => props.steps,
  async () => {
    lowFee.value = await feeForSteps(props.steps as Step[], EmerisFees.GasPriceLevel.Low);
    avgFee.value = await feeForSteps(props.steps as Step[], EmerisFees.GasPriceLevel.Average);
    highFee.value = await feeForSteps(props.steps as Step[], EmerisFees.GasPriceLevel.High);
  },
);
const txCount = computed(() => {
  let count = 0;
  for (let step of props.steps as Step[]) {
    count = count + step.transactions.length;
  }
  return count;
});
const lowFeeUSD = computed(() => {
  let value = 0;
  for (const chain_name in lowFee.value) {
    for (const denom in lowFee.value[chain_name]) {
      const precision =
        typedstore.getters[GlobalGetterTypes.API.getDenomPrecision]({
          name: denom,
        }) ?? 6;
      const price = typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom });
      value =
        value +
        new BigNumber(lowFee.value[chain_name][denom])
          .multipliedBy(price)
          .shiftedBy(-precision)
          .decimalPlaces(precision)
          .toNumber();
    }
  }
  return value;
});

const avgFeeUSD = computed(() => {
  let value = 0;
  for (const chain_name in avgFee.value) {
    for (const denom in avgFee.value[chain_name]) {
      const precision =
        typedstore.getters[GlobalGetterTypes.API.getDenomPrecision]({
          name: denom,
        }) ?? 6;
      const price = typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom });
      value =
        value +
        new BigNumber(avgFee.value[chain_name][denom])
          .multipliedBy(price)
          .shiftedBy(-precision)
          .decimalPlaces(precision)
          .toNumber();
    }
  }
  return value;
});
const highFeeUSD = computed(() => {
  let value = 0;
  for (const chain_name in highFee.value) {
    for (const denom in highFee.value[chain_name]) {
      const precision =
        typedstore.getters[GlobalGetterTypes.API.getDenomPrecision]({
          name: denom,
        }) ?? 6;
      const price = typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom });
      value =
        value +
        new BigNumber(highFee.value[chain_name][denom])
          .multipliedBy(price)
          .shiftedBy(-precision)
          .decimalPlaces(precision)
          .toNumber();
    }
  }
  return value;
});
const fees = computed(() => {
  const fees = {};
  fees[EmerisFees.GasPriceLevel.Low] = lowFeeUSD.value;
  fees[EmerisFees.GasPriceLevel.Average] = avgFeeUSD.value;
  fees[EmerisFees.GasPriceLevel.High] = highFeeUSD.value;
  return fees;
});

// get swap tx
const swapTx = computed(() => {
  return props.steps.find((step) => step.name === 'swap')?.transactions[0].data as SwapData;
});

//if swap tx is exist, check from/to coins denoms to identify pool coin
const hasPoolCoinToSwap = computed(() => {
  if (swapTx.value) {
    return swapTx.value.from.denom.startsWith('pool') || swapTx.value.to.denom.startsWith('pool');
  } else {
    return false;
  }
});

//if pool coin(s) exist, get display name.
const poolCoinDisplayDenoms = ref([]);
watch(
  () => props.steps,
  async () => {
    if (hasPoolCoinToSwap.value) {
      poolCoinDisplayDenoms.value[0] = await getTicker(
        swapTx.value.from.denom,
        typedstore.getters[GlobalGetterTypes.API.getDexChain],
      );
      poolCoinDisplayDenoms.value[1] = await getTicker(
        swapTx.value.to.denom,
        typedstore.getters[GlobalGetterTypes.API.getDexChain],
      );
    }
  },
  { immediate: true },
);

const poolCoinSwapFees = computed(() => {
  if (hasPoolCoinToSwap.value) {
    const swapFees = [];
    const swapFeeRate = parseFloat(store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate) / 2;
    const tx = swapTx.value;
    const precision =
      typedstore.getters[GlobalGetterTypes.API.getDenomPrecision]({
        name: tx.from.denom, //pool coin precision is same
      }) ?? 6;
    if (tx.from.denom.startsWith('pool')) {
      swapFees[0] = ((Number(tx.from.amount) * swapFeeRate) / Math.pow(10, precision)).toFixed(4);
    }
    if (tx.to.denom.startsWith('pool')) {
      swapFees[1] = ((Number(tx.to.amount) * swapFeeRate) / Math.pow(10, precision)).toFixed(4);
    }
    return swapFees;
  } else {
    return null;
  }
});

//if steps include swap tx
const swapDollarFee = computed(() => {
  if (swapTx.value) {
    let value = 0;
    const tx = swapTx.value;
    const swapFeeRate =
      parseFloat(typedstore.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate) / 2 ?? 0.0015;

    const fromPrecision = typedstore.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: tx.from.denom }) ?? 6;
    const toPrecision = typedstore.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: tx.to.denom }) ?? 6;
    const fromPrice = typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom: tx.from.denom });
    const toPrice = typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom: tx.to.denom });

    value =
      ((fromPrice * Number(tx.from.amount) * swapFeeRate) / Math.pow(10, fromPrecision) ?? 0) +
      ((toPrice * Number(tx.to.amount) * swapFeeRate) / Math.pow(10, toPrecision) ?? 0);
    return value;
  } else {
    return null;
  }
});

const swapFee = computed(() => {
  if (hasPoolCoinToSwap.value) {
    return `${swapDollarFee.value ? formatAmount(swapDollarFee.value) + ' +' : ''} ${
      poolCoinSwapFees.value[0] ? `${poolCoinSwapFees.value[0]} ${poolCoinDisplayDenoms.value[0]} + ` : ''
    } ${poolCoinSwapFees.value[1] ? `${poolCoinSwapFees.value[1]} ${poolCoinDisplayDenoms.value[1]}` : ''}`;
  } else {
    return formatAmount(swapDollarFee.value);
  }
});

const totalFee = computed(() => {
  if (hasPoolCoinToSwap.value) {
    return (
      formatAmount(swapDollarFee.value + fees.value[gasPriceLevel.value]) +
      `${poolCoinSwapFees.value[0] ? ` + ${poolCoinSwapFees.value[0]} ${poolCoinDisplayDenoms.value[0]}` : ''} ${
        poolCoinSwapFees.value[1] ? ` + ${poolCoinSwapFees.value[1]} ${poolCoinDisplayDenoms.value[1]}` : ''
      }`
    );
  } else {
    return formatAmount(swapDollarFee.value + fees.value[gasPriceLevel.value] * txCount.value);
  }
});

const gasPriceLevel = computed({
  get: () => typedstore.getters[GlobalGetterTypes.USER.getPreferredGasPriceLevel],
  set: (level) => {
    typedstore.dispatch(GlobalActionTypes.USER.SET_SESSION_DATA, { data: { gasPriceLevel: level } });
  },
});

const data = reactive({
  isFeesOpen: false,
  toggle: () => {
    data.isFeesOpen = !data.isFeesOpen;
  },
  gasPriceLevel,
  GasPriceLevel: EmerisFees.GasPriceLevel,
  feeIconColor: getComputedStyle(document.body).getPropertyValue('--inactive'),
});

const { isFeesOpen, toggle, GasPriceLevel } = toRefs(data);

watch([fees, props], () => {
  const feeMap = {
    [EmerisFees.GasPriceLevel.Low]: lowFee.value,
    [EmerisFees.GasPriceLevel.Average]: avgFee.value,
    [EmerisFees.GasPriceLevel.High]: highFee.value,
  };
  emit('update:fees', feeMap[gasPriceLevel.value]);
});

const formatAmount = (value: number | string) => {
  const bgValue = new BigNumber(value);
  let maximumFractionDigits = 2;

  // This will prevent formatting smaller values like 0.0001 to 0.00
  if (bgValue.decimalPlaces(2).isZero()) {
    maximumFractionDigits = bgValue.decimalPlaces();
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: maximumFractionDigits <= 17 ? maximumFractionDigits : 17,
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  }).format(bgValue.toNumber());
};
</script>
<style lang="scss" scoped></style>
