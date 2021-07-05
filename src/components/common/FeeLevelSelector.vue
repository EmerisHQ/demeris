<template>
  <div class="fees s-minus" :class="isFeesOpen ? 'fees-detail-open' : ''" @click="toggle">
    <div>Fees (included)</div>
    <div class="fees-total">
      <span v-show="!isFeesOpen">
        ~{{ formatter.format(swapDollarFee + transactionCount * baseDollarFee * getFeeWeight(gasPriceLevel)) }}
      </span>
      <Icon v-show="!isFeesOpen" name="CaretDownIcon" :icon-size="1.6" :color="feeIconColor" />
      <Icon v-show="isFeesOpen" name="CaretUpIcon" :icon-size="1.6" :color="feeIconColor" />
    </div>
  </div>
  <div v-if="isFeesOpen" class="fees-detail">
    <div class="fees-detail__info s-minus">
      <div class="fees-detail__info-key">Transaction fee(x{{ transactionCount }})</div>
      <div class="fees-detail__info-value">
        {{ formatter.format(transactionCount * baseDollarFee * getFeeWeight(gasPriceLevel)) }}
      </div>
    </div>

    <div class="fees-detail__selector s-minus">
      <button
        class="fees-detail__selector-block"
        :class="gasPriceLevel === GasPriceLevel.LOW ? 'selected' : ''"
        @click="setGasPriceLevel(GasPriceLevel.LOW)"
      >
        <div class="fees-detail__selector-block-level">Slow</div>
        <div class="fees-detail__selector-block-value">
          {{ formatter.format(baseDollarFee * getFeeWeight(GasPriceLevel.LOW)) }}
        </div>
      </button>
      <button
        class="fees-detail__selector-block"
        :class="gasPriceLevel === GasPriceLevel.AVERAGE ? 'selected' : ''"
        @click="setGasPriceLevel(GasPriceLevel.AVERAGE)"
      >
        <div class="fees-detail__selector-block-level">Normal</div>
        <div class="fees-detail__selector-block-value">
          {{ formatter.format(baseDollarFee * getFeeWeight(GasPriceLevel.AVERAGE)) }}
        </div>
      </button>
      <button
        class="fees-detail__selector-block"
        :class="gasPriceLevel === GasPriceLevel.HIGH ? 'selected' : ''"
        @click="setGasPriceLevel(GasPriceLevel.HIGH)"
      >
        <div class="fees-detail__selector-block-level">Fast</div>
        <div class="fees-detail__selector-block-value">
          {{ formatter.format(baseDollarFee * getFeeWeight(GasPriceLevel.HIGH)) }}
        </div>
      </button>
    </div>

    <Alert
      v-if="gasPriceLevel === GasPriceLevel.LOW"
      status="warning"
      message="Your transaction may take longer to be processed."
    />

    <div v-if="swapDollarFee" class="fees-detail__info s-minus">
      <div class="fees-detail__info-key">Swap fee</div>
      <div class="fees-detail__info-value">{{ formatter.format(swapDollarFee) }}</div>
    </div>
    <div class="fees-detail__info s-minus">
      <div class="fees-detail__info-key">Estimated total fees</div>
      <div class="fees-detail__info-value">
        {{ formatter.format(swapDollarFee + transactionCount * baseDollarFee * getFeeWeight(gasPriceLevel)) }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from 'vue';

import Alert from '@/components/ui/Alert.vue';
import Icon from '@/components/ui/Icon.vue';
import { GasPriceLevel } from '@/types/actions';

export default defineComponent({
  name: 'FeeLevelSelector',
  components: {
    Alert,
    Icon,
  },
  props: {
    gasPriceLevel: {
      type: String as PropType<GasPriceLevel>,
      required: true,
    },
    baseDollarFee: {
      type: Number,
      required: true,
    },
    transactionCount: {
      type: Number,
      required: true,
    },
    swapDollarFee: { type: Number, required: false, default: 0 },
  },
  emits: ['update:gasPriceLevel'],
  setup(props, { emit }) {
    const data = reactive({
      isFeesOpen: false,
      setGasPriceLevel: (level: GasPriceLevel) => {
        emit('update:gasPriceLevel', level);
        localStorage.setItem('demeris-fee-level', level);
      },
      toggle: () => {
        data.isFeesOpen = !data.isFeesOpen;
      },
      getFeeWeight: (level: GasPriceLevel) => {
        if (level === GasPriceLevel.LOW) {
          return 1;
        } else if (level === GasPriceLevel.AVERAGE) {
          return 2;
        } else {
          return 3;
        }
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

    return { ...toRefs(data) };
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
        background: linear-gradient(100.01deg, #aae3f9 -9.61%, #fbcbb8 96.61%);
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
