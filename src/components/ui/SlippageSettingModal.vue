<template>
  <div class="slippage-modal elevation-panel">
    <TitleWithGoback
      :title="'Price'"
      :func="
        () => {
          emitHandler('goback');
        }
      "
    />
    <div class="setting">
      <div class="s-minus w-medium">{{ $t('components.slippageSettingsModal.title') }}</div>
      <div class="setting__sections">
        <button
          class="setting__sections-block"
          :class="slippage === 0.1 && !isCustomSelected ? 'selected' : ''"
          @click="setSlippage(0.1)"
        >
          0.1%
        </button>
        <button
          class="setting__sections-block"
          :class="slippage === 0.5 && !isCustomSelected ? 'selected' : ''"
          @click="setSlippage(0.5)"
        >
          0.5%
        </button>
        <button
          class="setting__sections-block"
          :class="slippage === 1 && !isCustomSelected ? 'selected' : ''"
          @click="setSlippage(1)"
        >
          1%
        </button>
        <button
          v-if="allowCustomSlippage"
          class="setting__sections-block"
          :class="[isCustomSelected ? 'selected custom-selected' : '', Number(slippage) < 0 ? 'custom-error' : '']"
        >
          <div class="custom-slippage">
            <input
              ref="customSlippageInput"
              :value="customSlippage"
              type="number"
              placeholder="Custom"
              @input="setCustomSlippage"
            />
            <span v-if="isCustomSelected" class="custom-slippage__percent">%</span>
          </div>
        </button>
      </div>
    </div>

    <div v-if="alertStatus" class="alert-wrapper">
      <Alert :status="alertStatus" :message="alertText" />
    </div>

    <div class="details">
      <div class="details__row">
        <div class="details__row-left s-minus w-medium">
          {{ $t('components.slippageSettingsModal.limitPrice') }}
          <tippy :max-width="192">
            <HintIcon />
            <template #content> {{ $t('components.slippageSettingsModal.disclaimer') }} </template>
          </tippy>
        </div>
        <div class="details__row-right s-minus w-normal">
          {{ limitPriceText }}
        </div>
      </div>
      <div class="details__row">
        <div class="details__row-left s-minus w-medium">
          <div>{{ $t('components.slippageSettingsModal.minReceivedLbl') }}</div>
          <tippy :max-width="192">
            <HintIcon />
            <template #content>{{ $t('components.slippageSettingsModal.minReceivedLblHint') }} </template>
          </tippy>
        </div>
        <div class="details__row-right s-minus w-normal">{{ minReceivedText }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref, toRefs, watch } from 'vue';

import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import HintIcon from '@/components/common/Icons/HintIcon.vue';
import Alert from '@/components/ui/Alert.vue';
import { store } from '@/store';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { getDisplayName } from '@/utils/actionHandler';

type SwapData = {
  pay: { denom: string; amount: number };
  receive: { denom: string; amount: number };
};

export default defineComponent({
  name: 'SlippageSettingModal',
  components: {
    TitleWithGoback,
    HintIcon,
    Alert,
  },

  props: {
    swapData: {
      type: Object as PropType<SwapData>,
      required: false,
      default: () => {
        return {
          pay: { denom: '', amount: 0 },
          receive: { denom: '', amount: 0 },
        };
      },
    },
  },
  emits: ['goback'],
  setup(props: { swapData: SwapData }, { emit }) {
    const state = reactive({
      trueSlippage: computed(() => {
        return store.getters['demeris/getSlippagePerc'] || 0.5;
      }),
      slippage: computed(() => {
        if (state.trueSlippage.value) {
          if (state.trueSlippage.value == 0.1 || state.trueSlippage.value == 0.5 || state.trueSlippage.value == 1) {
            return state.trueSlippage.value;
          } else {
            return null;
          }
        } else {
          return 0.5;
        }
      }),
      customSlippage: computed(() => {
        if (state.trueSlippage) {
          if (state.trueSlippage.value != 0.1 || state.trueSlippage.value != 0.5 || state.trueSlippage.value != 1) {
            return state.trueSlippage.value;
          } else {
            return null;
          }
        } else {
          return null;
        }
      }),
      isCustomSelected: computed(() => {
        if (state.customSlippage?.value) {
          return true;
        } else {
          return false;
        }
      }),
      alertStatus: computed(() => {
        if (state.slippage) {
          if (state.slippage.value) {
            if (state.slippage.value === 0.1) {
              return 'warning';
            } else {
              return null;
            }
          } else {
            if (state.slippage.value <= 0.1) {
              if (state.slippage.value < 0) {
                return 'error';
              } else {
                return 'warning';
              }
            } else if (state.slippage.value >= 3) {
              return 'error';
            } else {
              return null;
            }
          }
        } else {
          return null;
        }
      }),
      alertText: computed(() => {
        if (state.alertStatus === 'warning') {
          return 'With a low slippage, only a very small part of your swap may be fulfilled';
        } else if (state.alertStatus === 'error') {
          if (state.slippage.value < 0) {
            return 'Please enter a valid slippage rate.';
          } else {
            return 'Your swap price may be significantly above the market price. ';
          }
        } else {
          return '';
        }
      }),
      emitHandler: (event) => {
        emit(event);
      },
      setSlippage: (slippage) => {
        state.validSlippageUpdater(slippage);
      },
      setCustomSlippage: (e) => {
        state.validSlippageUpdater(e.target.value);
      },
      validSlippageUpdater(value) {
        const slippage = Number(value);
        if (slippage > 0 && slippage <= 100) {
          store.dispatch(GlobalDemerisActionTypes.SET_SESSION_DATA, { data: { slippagePerc: slippage } });
        }
      },
    });
    const customSlippageInput = ref(null);
    const limitPriceText = ref('');
    const minReceivedText = ref(null);

    const allowCustomSlippage = computed(() => {
      return store.getters['demeris/allowCustomSlippage'];
    });

    //TODO: dynamic digit float calculation
    watch(
      () => [props.swapData, state.slippage],
      async () => {
        if (props.swapData.pay.amount && props.swapData.receive.amount) {
          const payDisplayName = await getDisplayName(props.swapData.pay.denom, store.getters['demeris/getDexChain']);
          const receiveDisplayName = await getDisplayName(
            props.swapData.receive.denom,
            store.getters['demeris/getDexChain'],
          );
          const payAmount = props.swapData.pay.amount;
          const receiveAmount = props.swapData.receive.amount;

          let slippageTolerancePercent = 1 - state.slippage / 100;

          limitPriceText.value = `1 ${payDisplayName} = ${
            Math.floor((receiveAmount / payAmount) * slippageTolerancePercent * 10000) / 10000
          } ${receiveDisplayName}`;
          minReceivedText.value = `${
            Math.floor(receiveAmount * slippageTolerancePercent * 10000) / 10000
          } ${receiveDisplayName}`;
        }
      },
    );

    onMounted(() => {
      if (state.slippage != 0.1 || state.slippage != 0.5 || state.slippage != 1) {
        customSlippageInput.value.focus();
      }
    });

    return { ...toRefs(state), allowCustomSlippage, customSlippageInput, limitPriceText, minReceivedText };
  },
});
</script>

<style lang="scss" scoped>
.slippage-modal {
  position: relative;
  width: 100%;
  /* height: 55.8rem; */

  margin-bottom: 5rem;
  top: 0;
  left: 0;

  overflow: hidden;

  background-color: var(--surface);
  z-index: 10;

  .setting {
    padding: 0 2.4rem;

    &__sections {
      display: flex;
      justify-content: space-between;

      margin: 1.6rem 0;

      /* Chrome, Safari, Edge, Opera */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Firefox */
      input[type='number'] {
        -moz-appearance: textfield;
      }
      &-block {
        width: 5.2rem;
        height: 4rem;
        background-color: var(--fg-trans);

        border-radius: 8px;

        outline: none;

        &:last-child {
          width: 9.2rem;
          padding: 0.6rem 1.2rem;
          text-align: center;

          display: flex;
          align-items: center;
          justify-content: center;

          .custom-slippage {
            display: flex;

            input {
              background-color: transparent;
              width: 6rem;
            }

            &__percent {
              color: var(--text);
            }
          }
        }
      }
      .custom-selected {
        input {
          width: 2.8rem !important;
          text-align: right;
          outline: none;
          &::placeholder {
            color: transparent;
          }
        }
      }

      .custom-error {
        justify-content: flex-end;
        background: linear-gradient(135deg, #ffc1cc 0%, #ffcfc9 100%);
      }
    }
  }

  .details {
    padding: 0 2.4rem 2.4rem;
    margin-top: 3.2rem;
    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      margin-bottom: 1.6rem;

      &-left {
        display: flex;
        align-items: center;

        span {
          margin-left: 0.45rem;
        }
      }
    }
  }

  .selected {
    background: linear-gradient(100.01deg, #aae3f9 -9.61%, #fbcbb8 96.61%), linear-gradient(0deg, #9ff9ff, #9ff9ff);
  }

  .alert-wrapper {
    padding: 0 2.4rem;
  }
}
</style>
