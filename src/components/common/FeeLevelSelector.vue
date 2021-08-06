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
        {{ formatter.format(fees[gasPriceLevel] * txCount) }}
      </div>
    </div>

    <div class="fees-detail__selector flex items-center justify-stretch space-x-3">
      <button
        class="
          fees-detail__selector-block
          w-full
          h-auto
          py-3
          px-2
          text-center
          rounded-lg
          border-none
          outline-none
          appearance-none
        "
        :class="
          gasPriceLevel === GasPriceLevel.LOW
            ? 'bg-brand dark:theme-inverse text-text font-medium shadow-button'
            : 'bg-fg font-normal'
        "
        @click="setGasPriceLevel(GasPriceLevel.LOW)"
      >
        <div class="fees-detail__selector-block-level">{{ $t('context.feeLevels.low') }}</div>
        <div class="fees-detail__selector-block-value font-normal -text-1 mt-0.5">
          {{ formatter.format(fees[GasPriceLevel.LOW]) }}
        </div>
      </button>
      <button
        class="
          fees-detail__selector-block
          w-full
          h-auto
          py-3
          px-2
          text-center
          rounded-lg
          border-none
          outline-none
          appearance-none
        "
        :class="
          gasPriceLevel === GasPriceLevel.AVERAGE
            ? 'bg-brand dark:theme-inverse text-text font-medium'
            : 'bg-fg font-normal'
        "
        @click="setGasPriceLevel(GasPriceLevel.AVERAGE)"
      >
        <div class="fees-detail__selector-block-level">{{ $t('context.feeLevels.average') }}</div>
        <div class="fees-detail__selector-block-value font-normal -text-1 mt-0.5">
          {{ formatter.format(fees[GasPriceLevel.AVERAGE]) }}
        </div>
      </button>
      <button
        class="
          fees-detail__selector-block
          w-full
          h-auto
          py-3
          px-2
          text-center
          rounded-lg
          border-none
          outline-none
          appearance-none
        "
        :class="
          gasPriceLevel === GasPriceLevel.HIGH
            ? 'bg-brand dark:theme-inverse text-text font-medium'
            : 'bg-fg font-normal'
        "
        @click="setGasPriceLevel(GasPriceLevel.HIGH)"
      >
        <div class="fees-detail__selector-block-level">{{ $t('context.feeLevels.high') }}</div>
        <div class="fees-detail__selector-block-value font-normal -text-1 mt-0.5">
          {{ formatter.format(fees[GasPriceLevel.HIGH]) }}
        </div>
      </button>
    </div>

    <Alert
      v-if="gasPriceLevel === GasPriceLevel.LOW"
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
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';

import Alert from '@/components/ui/Alert.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { GasPriceLevel, Step, SwapData } from '@/types/actions';
import { feeForSteps, getDisplayName } from '@/utils/actionHandler';

export default defineComponent({
  name: 'FeeLevelSelector',
  components: {
    Alert,
    Icon,
  },
  props: {
    steps: {
      type: Array as PropType<Step[]>,
      required: true,
    },
    gasPriceLevel: {
      type: String as PropType<GasPriceLevel>,
      required: true,
    },
  },
  emits: ['update:gasPriceLevel', 'update:fees'],
  setup(props, { emit }) {
    const lowFee = ref({});
    const avgFee = ref({});
    const highFee = ref({});
    onMounted(async () => {
      lowFee.value = await feeForSteps(props.steps as Step[], GasPriceLevel.LOW);
      avgFee.value = await feeForSteps(props.steps as Step[], GasPriceLevel.AVERAGE);
      highFee.value = await feeForSteps(props.steps as Step[], GasPriceLevel.HIGH);
    });
    watch(
      () => props.steps,
      async () => {
        lowFee.value = await feeForSteps(props.steps as Step[], GasPriceLevel.LOW);
        avgFee.value = await feeForSteps(props.steps as Step[], GasPriceLevel.AVERAGE);
        highFee.value = await feeForSteps(props.steps as Step[], GasPriceLevel.HIGH);
      },
    );
    const store = useStore();
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
            store.getters['demeris/getDenomPrecision']({
              name: denom,
            }) ?? '6';
          const price = store.getters['demeris/getPrice']({ denom });
          value = value + (price * parseInt(lowFee.value[chain_name][denom])) / Math.pow(10, parseInt(precision));
        }
      }
      return value;
    });

    const avgFeeUSD = computed(() => {
      let value = 0;
      for (const chain_name in avgFee.value) {
        for (const denom in avgFee.value[chain_name]) {
          const precision =
            store.getters['demeris/getDenomPrecision']({
              name: denom,
            }) ?? '6';
          const price = store.getters['demeris/getPrice']({ denom });
          value = value + (price * parseInt(avgFee.value[chain_name][denom])) / Math.pow(10, parseInt(precision));
        }
      }
      return value;
    });
    const highFeeUSD = computed(() => {
      let value = 0;
      for (const chain_name in highFee.value) {
        for (const denom in highFee.value[chain_name]) {
          const precision =
            store.getters['demeris/getDenomPrecision']({
              name: denom,
            }) ?? '6';
          const price = store.getters['demeris/getPrice']({ denom });
          value = value + (price * parseInt(highFee.value[chain_name][denom])) / Math.pow(10, parseInt(precision));
        }
      }
      return value;
    });
    const fees = computed(() => {
      const fees = {};
      fees[GasPriceLevel.LOW] = lowFeeUSD.value;
      fees[GasPriceLevel.AVERAGE] = avgFeeUSD.value;
      fees[GasPriceLevel.HIGH] = highFeeUSD.value;

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
          poolCoinDisplayDenoms.value[0] = await getDisplayName(
            swapTx.value.from.denom,
            store.getters['demeris/getDexChain'],
          );
          poolCoinDisplayDenoms.value[1] = await getDisplayName(
            swapTx.value.to.denom,
            store.getters['demeris/getDexChain'],
          );
        }
      },
      { immediate: true },
    );

    const poolCoinSwapFees = computed(() => {
      if (hasPoolCoinToSwap.value) {
        const swapFees = [];
        const swapFeeRate =
          parseFloat(store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate) / 2;
        const tx = swapTx.value;
        const precision =
          store.getters['demeris/getDenomPrecision']({
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
          parseFloat(store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate) / 2 ?? 0.0015;

        const fromPrecision = store.getters['demeris/getDenomPrecision']({ name: tx.from.denom }) ?? '6';
        const toPrecision = store.getters['demeris/getDenomPrecision']({ name: tx.to.denom }) ?? '6';
        const fromPrice = store.getters['demeris/getPrice']({ denom: tx.from.denom });
        const toPrice = store.getters['demeris/getPrice']({ denom: tx.to.denom });

        value =
          ((fromPrice * Number(tx.from.amount) * swapFeeRate) / Math.pow(10, parseInt(fromPrecision)) ?? 0) +
          ((toPrice * Number(tx.to.amount) * swapFeeRate) / Math.pow(10, parseInt(toPrecision)) ?? 0);
        return value;
      } else {
        return null;
      }
    });

    const swapFee = computed(() => {
      if (hasPoolCoinToSwap.value) {
        return `${swapDollarFee.value ? data.formatter.format(swapDollarFee.value) + ' +' : ''} ${
          poolCoinSwapFees.value[0] ? `${poolCoinSwapFees.value[0]} ${poolCoinDisplayDenoms.value[0]} + ` : ''
        } ${poolCoinSwapFees.value[1] ? `${poolCoinSwapFees.value[1]} ${poolCoinDisplayDenoms.value[1]}` : ''}`;
      } else {
        return data.formatter.format(swapDollarFee.value);
      }
    });

    const totalFee = computed(() => {
      if (hasPoolCoinToSwap.value) {
        return (
          data.formatter.format(swapDollarFee.value + fees.value[props.gasPriceLevel]) +
          `${poolCoinSwapFees.value[0] ? ` + ${poolCoinSwapFees.value[0]} ${poolCoinDisplayDenoms.value[0]}` : ''} ${
            poolCoinSwapFees.value[1] ? ` + ${poolCoinSwapFees.value[1]} ${poolCoinDisplayDenoms.value[1]}` : ''
          }`
        );
      } else {
        return data.formatter.format(swapDollarFee.value + fees.value[props.gasPriceLevel] * txCount.value);
      }
    });

    const data = reactive({
      isFeesOpen: false,
      setGasPriceLevel: (level: GasPriceLevel) => {
        emit('update:gasPriceLevel', level);
        store.dispatch(GlobalDemerisActionTypes.SET_SESSION_DATA, { data: { gasPriceLevel: level } });
      },
      toggle: () => {
        data.isFeesOpen = !data.isFeesOpen;
      },
      GasPriceLevel,
      formatter: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      }),
      feeIconColor: getComputedStyle(document.body).getPropertyValue('--inactive'),
    });

    watch([fees, props], () => {
      const feeMap = {
        [GasPriceLevel.LOW]: lowFee.value,
        [GasPriceLevel.AVERAGE]: avgFee.value,
        [GasPriceLevel.HIGH]: highFee.value,
      };
      emit('update:fees', feeMap[props.gasPriceLevel]);
    });

    return {
      ...toRefs(data),
      txCount,
      fees,
      swapFee,
      totalFee,
      swapTx,
      swapDollarFee,
      hasPoolCoinToSwap,
      poolCoinSwapFees,
      poolCoinDisplayDenoms,
    };
  },
});
</script>
<style lang="scss" scoped></style>
