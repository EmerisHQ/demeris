<template>
  <div v-if="steps" class="fees -text-1" :class="isFeesOpen ? 'fees-detail-open' : ''" @click="toggle">
    <div>{{ $t('components.feeLevelSelector.feesIncl') }}</div>
    <div class="fees-total">
      <span v-show="!isFeesOpen"> ~{{ formatter.format(swapDollarFee + fees[gasPriceLevel]) }} </span>
      <Icon v-show="!isFeesOpen" name="CaretDownIcon" :icon-size="1" :color="feeIconColor" />
      <Icon v-show="isFeesOpen" name="CaretUpIcon" :icon-size="1" :color="feeIconColor" />
    </div>
  </div>
  <div v-if="isFeesOpen" class="fees-detail">
    <div class="fees-detail__info -text-1">
      <div class="fees-detail__info-key">{{ $t('components.feeLevelSelector.transactionFee', { txCount }) }}</div>
      <div class="fees-detail__info-value">
        {{ formatter.format(fees[gasPriceLevel]) }}
      </div>
    </div>

    <div class="fees-detail__selector -text-1">
      <button
        class="fees-detail__selector-block"
        :class="gasPriceLevel === GasPriceLevel.LOW ? 'bg-brand dark:theme-inverse text-text font-medium' : ''"
        @click="setGasPriceLevel(GasPriceLevel.LOW)"
      >
        <div class="fees-detail__selector-block-level">{{ $t('context.feeLevels.low') }}</div>
        <div class="fees-detail__selector-block-value font-normal">
          {{ formatter.format(fees[GasPriceLevel.LOW]) }}
        </div>
      </button>
      <button
        class="fees-detail__selector-block"
        :class="gasPriceLevel === GasPriceLevel.AVERAGE ? 'bg-brand dark:theme-inverse text-text font-medium' : ''"
        @click="setGasPriceLevel(GasPriceLevel.AVERAGE)"
      >
        <div class="fees-detail__selector-block-level">{{ $t('context.feeLevels.average') }}</div>
        <div class="fees-detail__selector-block-value font-normal">
          {{ formatter.format(fees[GasPriceLevel.AVERAGE]) }}
        </div>
      </button>
      <button
        class="fees-detail__selector-block"
        :class="gasPriceLevel === GasPriceLevel.HIGH ? 'bg-brand dark:theme-inverse text-text font-medium' : ''"
        @click="setGasPriceLevel(GasPriceLevel.HIGH)"
      >
        <div class="fees-detail__selector-block-level">{{ $t('context.feeLevels.high') }}</div>
        <div class="fees-detail__selector-block-value font-normal">
          {{ formatter.format(fees[GasPriceLevel.HIGH]) }}
        </div>
      </button>
    </div>

    <Alert
      v-if="gasPriceLevel === GasPriceLevel.LOW"
      status="warning"
      :message="$t('components.feeLevelSelector.slowWarning')"
    />

    <div v-if="swapDollarFee" class="fees-detail__info -text-1">
      <div class="fees-detail__info-key">{{ $t('components.feeLevelSelector.swapFee') }}</div>
      <div class="fees-detail__info-value">{{ formatter.format(swapDollarFee) }}</div>
    </div>
    <div class="fees-detail__info -text-1">
      <div class="fees-detail__info-key">{{ $t('components.feeLevelSelector.estimate') }}</div>
      <div class="fees-detail__info-value">
        {{ formatter.format(swapDollarFee + fees[gasPriceLevel]) }}
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
import { feeForSteps } from '@/utils/actionHandler';

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
    const swapDollarFee = computed(() => {
      if (props.steps[0]?.name === 'swap') {
        let value = 0;
        const tx = props.steps[0]?.transactions[0].data as SwapData;

        const fromPrecision =
          store.getters['demeris/getDenomPrecision']({
            name: tx.from.denom,
          }) ?? '6';
        const fromPrice = store.getters['demeris/getPrice']({ denom: tx.from.denom });
        const toPrecision =
          store.getters['demeris/getDenomPrecision']({
            name: tx.to.denom,
          }) ?? '6';
        const toPrice = store.getters['demeris/getPrice']({ denom: tx.to.denom });
        const swapFeeRate = parseFloat(store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate);
        value =
          (fromPrice * Number(tx.from.amount) * swapFeeRate) / Math.pow(10, parseInt(fromPrecision)) +
          (toPrice * Number(tx.to.amount) * swapFeeRate) / Math.pow(10, parseInt(toPrecision));

        return value;
      } else {
        return null;
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

    return { ...toRefs(data), txCount, fees, swapDollarFee };
  },
});
</script>
<style lang="scss" scoped>
.fees {
  display: flex;
  padding: 0 1.5rem 0;
  cursor: pointer;
  justify-content: space-between;
  color: var(--muted);

  &-total {
    display: flex;
    align-items: center;
  }

  &-detail {
    padding: 0 1.5rem;
    color: var(--text);

    &__info {
      display: flex;
      align-items: center;
      justify-content: space-between;

      margin: 1rem 0;

      &:last-child {
        margin-bottom: 0;
        .fees-detail__info-value {
          font-weight: bold;
        }
      }

      &:first-child {
        margin-top: 0;
      }
    }

    &__selector {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-block {
        width: 5.25rem;
        height: 3rem;
        color: var(--text);

        background-color: var(--fg);

        border-radius: 8px;

        outline: none;
      }

      .selected {
        background: linear-gradient(102.36deg, #64dbfc -2.26%, #30ffdf 34.48%, #fffe39 92.77%);
      }
    }
  }
}

.alert--warning {
  margin-top: 1rem;
}

.fees-detail-open {
  font-weight: bold;
  padding-bottom: 1.5rem;
  color: var(--text);

  .icon {
    color: var(--text) !important;
  }
}
</style>
