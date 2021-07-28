<template>
  <div class="slippage-modal relative w-full z-10 overflow-hidden bg-surface shadow-panel rounded-2xl">
    <TitleWithGoback
      :title="'Price'"
      :func="
        () => {
          emitHandler('goback');
        }
      "
    />

    <div class="setting">
      <div class="-text-1 font-medium">{{ $t('components.slippageSettingsModal.title') }}</div>
      <div class="flex justify-between my-4 gap-x-3">
        <button
          class="h-12 flex-grow bg-fg rounded-xl outline-none text-text"
          :class="[
            slippage === 0.1 && !isCustomSelected ? 'bg-brand-to-r dark:theme-inverse font-medium' : '',
            allowCustomSlippage ? '' : 'no-custom-slippage',
          ]"
          @click="setSlippage(0.1)"
        >
          0.1%
        </button>
        <button
          class="h-12 flex-grow bg-fg rounded-xl outline-none text-text"
          :class="[
            slippage === 0.5 && !isCustomSelected ? 'bg-brand-to-r dark:theme-inverse font-medium' : '',
            allowCustomSlippage ? '' : 'no-custom-slippage',
          ]"
          @click="setSlippage(0.5)"
        >
          0.5%
        </button>
        <button
          class="h-12 flex-grow bg-fg rounded-xl outline-none text-text"
          :class="[
            slippage === 1 && !isCustomSelected ? 'bg-brand-to-r dark:theme-inverse font-medium' : '',
            allowCustomSlippage ? '' : 'no-custom-slippage',
          ]"
          @click="setSlippage(1)"
        >
          1%
        </button>
        <button
          v-if="allowCustomSlippage"
          class="h-12 flex-grow bg-fg rounded-xl outline-none text-text"
          :class="[
            isCustomSelected
              ? 'custom-selected bg-brand-to-r dark:theme-inverse font-medium flex items-center justify-center text-center'
              : '',
            Number(slippage) < 0 ? 'justify-end text-negative border-negative' : '',
          ]"
        >
          <div class="custom-slippage flex">
            <input
              ref="customSlippageInput"
              :value="customSlippage"
              type="number"
              placeholder="Custom"
              class="w-full bg-transparent outline-none text-right"
              @input="setCustomSlippage"
            />
            <span v-if="isCustomSelected" class="text-text">%</span>
          </div>
        </button>
      </div>
    </div>
    <div v-if="alertStatus" class="alert-wrapper">
      <Alert :status="alertStatus" :message="alertText" />
    </div>

    <div class="details">
      <div class="details__row">
        <div class="details__row-left -text-1 font-medium">
          <tippy :max-width="192">
            {{ $t('components.slippageSettingsModal.limitPrice') }}
            <template #content> {{ $t('components.slippageSettingsModal.disclaimer') }} </template>
          </tippy>
        </div>
        <div class="details__row-right -text-1 font-normal">
          {{ limitPriceText }}
        </div>
      </div>
      <div class="details__row">
        <div class="details__row-left -text-1 font-medium">
          <tippy :max-width="192">
            <div>
              {{ $t('components.slippageSettingsModal.minReceivedLbl').split('/')[0] }} <br />{{
                $t('components.slippageSettingsModal.minReceivedLbl').split('/')[1]
              }}
            </div>
            <template #content>{{ $t('components.slippageSettingsModal.minReceivedLblHint') }} </template>
          </tippy>
        </div>
        <div class="details__row-right -text-1 font-normal">{{ minReceivedText }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref, toRefs, watch } from 'vue';

import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
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
    const trueSlippage = computed(() => {
      return store.getters['demeris/getSlippagePerc'] || 0.5;
    });
    const customSlippage = computed(() => {
      if (trueSlippage.value) {
        if (trueSlippage.value != 0.1 && trueSlippage.value != 0.5 && trueSlippage.value != 1) {
          return trueSlippage.value;
        } else {
          return null;
        }
      } else {
        return null;
      }
    });

    const state = reactive({
      slippage: computed(() => {
        if (trueSlippage.value) {
          if (trueSlippage.value == 0.1 || trueSlippage.value == 0.5 || trueSlippage.value == 1) {
            return trueSlippage.value;
          } else {
            return null;
          }
        } else {
          return 0.5;
        }
      }),

      isCustomSelected: computed(() => {
        if (customSlippage?.value) {
          return true;
        } else {
          return false;
        }
      }),
      alertStatus: computed(() => {
        const slippage = state.slippage ?? customSlippage.value;
        if (slippage) {
          if (slippage == 0.1) {
            return 'warning';
          } else if (slippage <= 0.1) {
            if (slippage < 0) {
              return 'error';
            } else {
              return 'warning';
            }
          } else if (slippage >= 3) {
            return 'error';
          } else {
            return null;
          }
        } else {
          return null;
        }
      }),
      alertText: computed(() => {
        if (state.alertStatus === 'warning') {
          return 'With a low slippage, only a very small part of your swap may be fulfilled';
        } else if (state.alertStatus === 'error') {
          if (state.slippage < 0) {
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
      if (state.slippage != 0.1 && state.slippage != 0.5 && state.slippage != 1) {
        customSlippageInput.value.focus();
      }
    });

    return {
      ...toRefs(state),
      allowCustomSlippage,
      customSlippageInput,
      customSlippage,
      limitPriceText,
      minReceivedText,
    };
  },
});
</script>

<style lang="scss" scoped>
.slippage-modal {
  .setting {
    padding: 0 1.5rem;

    &__sections {
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
        &:nth-child(4) {
          flex-grow: 2;
        }
      }
      .custom-selected input {
        // width: 1.75rem !important;
        &::placeholder {
          color: transparent;
        }
      }
    }
  }

  .details {
    padding: 0 1.5rem 1.5rem;
    margin-top: 2rem;
    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      margin-bottom: 1rem;

      &-left {
        display: flex;
        align-items: center;

        span {
          margin-left: 0.25rem;
        }
      }
    }
  }

  .selected {
    background: linear-gradient(102.36deg, #64dbfc -2.26%, #30ffdf 34.48%, #fffe39 92.77%);
  }

  .alert-wrapper {
    padding: 0 1.5rem;
  }
}

.no-custom-slippage {
  width: 5.75rem !important;
}
</style>
