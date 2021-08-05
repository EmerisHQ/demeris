<template>
  <div v-if="steps" class="fees s-minus" :class="isFeesOpen ? 'fees-detail-open' : ''" @click="toggle">
    <div>{{ $t('components.feeLevelSelector.feesIncl') }}</div>
    <div class="fees-total">
      <span v-show="!isFeesOpen">
        ~{{
          isFromPoolCoin || isToPoolCoin
            ? formatter.format(swapDollarFee + fees[gasPriceLevel]) +
              `${poolCoinSwapFees[0] ? ` + ${poolCoinSwapFees[0]} ${poolCoinDisplayDenoms[0]}` : ''} ${
                poolCoinSwapFees[1] ? ` + ${poolCoinSwapFees[1]} ${poolCoinDisplayDenoms[1]}` : ''
              }`
            : formatter.format(swapDollarFee + fees[gasPriceLevel])
        }}
      </span>
      <Icon v-show="!isFeesOpen" name="CaretDownIcon" :icon-size="1.6" :color="feeIconColor" />
      <Icon v-show="isFeesOpen" name="CaretUpIcon" :icon-size="1.6" :color="feeIconColor" />
    </div>
  </div>
  <div v-if="isFeesOpen" class="fees-detail">
    <div class="fees-detail__info s-minus">
      <div class="fees-detail__info-key">{{ $t('components.feeLevelSelector.transactionFee', { txCount }) }}</div>
      <div class="fees-detail__info-value">
        {{ formatter.format(fees[gasPriceLevel]) }}
      </div>
    </div>

    <div class="fees-detail__selector s-minus">
      <button
        class="fees-detail__selector-block"
        :class="gasPriceLevel === GasPriceLevel.LOW ? 'selected' : ''"
        @click="setGasPriceLevel(GasPriceLevel.LOW)"
      >
        <div class="fees-detail__selector-block-level">{{ $t('context.feeLevels.low') }}</div>
        <div class="fees-detail__selector-block-value">
          {{ formatter.format(fees[GasPriceLevel.LOW]) }}
        </div>
      </button>
      <button
        class="fees-detail__selector-block"
        :class="gasPriceLevel === GasPriceLevel.AVERAGE ? 'selected' : ''"
        @click="setGasPriceLevel(GasPriceLevel.AVERAGE)"
      >
        <div class="fees-detail__selector-block-level">{{ $t('context.feeLevels.average') }}</div>
        <div class="fees-detail__selector-block-value">
          {{ formatter.format(fees[GasPriceLevel.AVERAGE]) }}
        </div>
      </button>
      <button
        class="fees-detail__selector-block"
        :class="gasPriceLevel === GasPriceLevel.HIGH ? 'selected' : ''"
        @click="setGasPriceLevel(GasPriceLevel.HIGH)"
      >
        <div class="fees-detail__selector-block-level">{{ $t('context.feeLevels.high') }}</div>
        <div class="fees-detail__selector-block-value">
          {{ formatter.format(fees[GasPriceLevel.HIGH]) }}
        </div>
      </button>
    </div>

    <Alert
      v-if="gasPriceLevel === GasPriceLevel.LOW"
      status="warning"
      :message="$t('components.feeLevelSelector.slowWarning')"
    />

    <div v-if="swapDollarFee || poolCoinSwapFees" class="fees-detail__info s-minus">
      <div class="fees-detail__info-key">{{ $t('components.feeLevelSelector.swapFee') }}</div>
      <div class="fees-detail__info-value">
        {{
          isToPoolCoin || isFromPoolCoin
            ? `${swapDollarFee ? formatter.format(swapDollarFee) + ' +' : ''} ${
              poolCoinSwapFees[0] ? `${poolCoinSwapFees[0]} ${poolCoinDisplayDenoms[0]} + ` : ''
            } ${poolCoinSwapFees[1] ? `${poolCoinSwapFees[1]} ${poolCoinDisplayDenoms[1]}` : ''}`
            : formatter.format(swapDollarFee)
        }}
      </div>
    </div>
    <div class="fees-detail__info s-minus">
      <div class="fees-detail__info-key">{{ $t('components.feeLevelSelector.estimate') }}</div>
      <div class="fees-detail__info-value">
        {{
          isToPoolCoin || isFromPoolCoin
            ? `${formatter.format(swapDollarFee + fees[gasPriceLevel])} ${
              poolCoinSwapFees[0] ? `+ ${poolCoinSwapFees[0]} ${poolCoinDisplayDenoms[0]}` : ''
            } ${poolCoinSwapFees[1] ? `+ ${poolCoinSwapFees[1]} ${poolCoinDisplayDenoms[1]}` : ''}`
            : formatter.format(swapDollarFee + fees[gasPriceLevel])
        }}
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

    const isFromPoolCoin = computed(() => {
      const tx = props.steps[0]?.transactions[0].data as SwapData;
      return tx.from.denom.startsWith('pool');
    });

    const isToPoolCoin = computed(() => {
      const tx = props.steps[0]?.transactions[0].data as SwapData;
      return tx.to.denom.startsWith('pool');
    });

    const poolCoinDisplayDenoms = ref([]);
    watch(
      () => props.steps,
      async () => {
        const tx = props.steps[0]?.transactions[0].data as SwapData;
        poolCoinDisplayDenoms.value[0] = await getDisplayName(tx.from.denom, store.getters['demeris/getDexChain']);
        poolCoinDisplayDenoms.value[1] = await getDisplayName(tx.to.denom, store.getters['demeris/getDexChain']);
      },
      { immediate: true },
    );

    const poolCoinSwapFees = computed(() => {
      if (isToPoolCoin.value || isFromPoolCoin.value) {
        const swapFees = [];
        const swapFeeRate =
          parseFloat(store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate) / 2;
        const tx = props.steps[0]?.transactions[0].data as SwapData;
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
          ((fromPrice * Number(tx.from.amount) * swapFeeRate) / Math.pow(10, parseInt(fromPrecision)) ?? 0) +
          ((toPrice * Number(tx.to.amount) * swapFeeRate) / Math.pow(10, parseInt(toPrecision)) ?? 0);

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

    return {
      ...toRefs(data),
      txCount,
      fees,
      swapDollarFee,
      isFromPoolCoin,
      isToPoolCoin,
      poolCoinSwapFees,
      poolCoinDisplayDenoms,
    };
  },
});
</script>
<style lang="scss" scoped>
.fees {
  display: flex;
  padding: 0 2.4rem 0;
  cursor: pointer;
  justify-content: space-between;
  color: var(--muted);

  &-total {
    display: flex;
    align-items: center;
  }

  &-detail {
    padding: 0 2.4rem;
    color: var(--text);

    &__info {
      display: flex;
      align-items: center;
      justify-content: space-between;

      margin: 1.6rem 0;

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
        width: 8.3rem;
        height: 4.9rem;
        color: var(--text);

        background-color: var(--fg-trans);

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
  margin-top: 1.6rem;
}

.fees-detail-open {
  font-weight: bold;
  padding-bottom: 2.4rem;
  color: var(--text);

  .icon {
    color: var(--text) !important;
  }
}
</style>
