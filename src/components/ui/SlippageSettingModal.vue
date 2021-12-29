<template>
  <div class="relative w-full z-10 overflow-hidden bg-surface shadow-panel rounded-2xl">
    <TitleWithGoback
      :title="'Price'"
      :func="
        () => {
          emitHandler('goback');
        }
      "
    />

    <div class="px-6">
      <div class="-text-1 font-medium">{{ $t('components.slippageSettingsModal.title') }}</div>
      <div class="flex justify-between my-4 space-x-2">
        <button
          class="h-12 flex-grow bg-fg rounded-xl outline-none text-text"
          :class="[slippage === 0.1 && !isCustomSelected ? 'bg-brand-to-r dark:theme-inverse font-medium' : '']"
          @click="setSlippage(0.1)"
        >
          0.1%
        </button>
        <button
          class="h-12 flex-grow bg-fg rounded-xl outline-none text-text"
          :class="[slippage === 0.5 && !isCustomSelected ? 'bg-brand-to-r dark:theme-inverse font-medium' : '']"
          @click="setSlippage(0.5)"
        >
          0.5%
        </button>
        <button
          class="h-12 flex-grow bg-fg rounded-xl outline-none text-text"
          :class="[slippage === 1 && !isCustomSelected ? 'bg-brand-to-r dark:theme-inverse font-medium' : '']"
          @click="setSlippage(1)"
        >
          1%
        </button>
        <label
          v-if="allowCustomSlippage"
          class="
            custom-slippage
            h-12
            pr-3
            flex-shrink flex
            items-baseline
            justify-center
            text-center
            focus-within:text-right
            bg-fg
            rounded-xl
            outline-none
            text-text
          "
          :class="[
            isCustomSelected ? 'custom-selected bg-brand-to-r dark:theme-inverse font-medium' : '',
            Number(slippage) < 0 ? 'justify-end text-negative-text border-negative' : '',
          ]"
          for=""
        >
          <input
            ref="customSlippageInput"
            :value="customSlippage"
            type="number"
            placeholder="Custom"
            class="
              custom-slippage__input
              h-12
              appearance-none
              overflow-hidden
              py-0
              pr-0
              pl-3
              m-0
              flex-grow
              border-none
              outline-none
              bg-transparent
            "
            :class="[isCustomSelected ? 'w-12' : 'w-20']"
            required
            @input="setCustomSlippage"
          />
          <span :class="{ hidden: !isCustomSelected }" class="text-text">%</span>
        </label>
      </div>
    </div>
    <div v-if="alertStatus" class="px-6">
      <Alert :status="alertStatus" :message="alertText" />
    </div>

    <div class="px-6 pb-6 mt-8 space-y-6">
      <div class="flex justify-between">
        <div class="flex-1 -text-1 font-medium">
          <tippy :max-width="192">
            {{ $t('components.slippageSettingsModal.limitPrice') }}
            <template #content> {{ $t('components.slippageSettingsModal.disclaimer') }} </template>
          </tippy>
        </div>
        <div class="flex-shrink ml-1 -text-1 font-normal text-right">
          {{ limitPriceText }}
        </div>
      </div>
      <div class="flex justify-between">
        <div class="flex-1 -text-1 font-medium">
          <tippy :max-width="192">
            <div>
              {{ $t('components.slippageSettingsModal.minReceivedLbl').split('/')[0] }} <br />{{
                $t('components.slippageSettingsModal.minReceivedLbl').split('/')[1]
              }}
            </div>
            <template #content>{{ $t('components.slippageSettingsModal.minReceivedLblHint') }} </template>
          </tippy>
        </div>
        <div class="flex-shrink ml-1 -text-1 font-normal text-right">{{ minReceivedText }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref, toRefs, watch } from 'vue';

import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import Alert from '@/components/ui/Alert.vue';
import { GlobalDemerisActionTypes, RootStoreType } from '@/store';
import { getDisplayName } from '@/utils/actionHandler';
import { useStore } from '@/utils/useStore';

type SwapData = {
  pay: { denom: string; amount: number };
  receive: { denom: string; amount: number };
  poolPrice: number;
  isReverse: boolean;
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
          poolPrice: 0,
          isReverse: false,
        };
      },
    },
  },
  emits: ['goback'],
  setup(props: { swapData: SwapData }, { emit }) {
    const trueSlippage = computed(() => {
      return useStore().getters['demerisUSER/getSlippagePerc'] || 0.5;
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
          (useStore() as RootStoreType).dispatch(GlobalDemerisActionTypes.USER.SET_SESSION_DATA, {
            data: { slippagePerc: slippage },
          });
        }
      },
    });
    const customSlippageInput = ref(null);
    const limitPriceText = ref('');
    const minReceivedText = ref(null);

    const allowCustomSlippage = computed(() => {
      return useStore().getters['demerisUSER/allowCustomSlippage'];
    });

    watch(
      () => allowCustomSlippage.value,
      () => {
        if (!allowCustomSlippage.value && state.isCustomSelected) {
          state.setSlippage(0.5);
        }
      },
    );

    //TODO: dynamic digit float calculation
    watch(
      () => [props.swapData.pay.amount, props.swapData.pay.denom, props.swapData.receive.denom, state.slippage],
      async () => {
        const payDisplayName = await getDisplayName(
          props.swapData.pay.denom,
          useStore().getters['demerisAPI/getDexChain'],
        );
        const receiveDisplayName = await getDisplayName(
          props.swapData.receive.denom,
          useStore().getters['demerisAPI/getDexChain'],
        );
        const payAmount = props.swapData.pay.amount;
        const receiveAmount = props.swapData.receive.amount;

        let slippageTolerancePercent = 1 - state.slippage / 100;
        limitPriceText.value = `1 ${payDisplayName} = ${
          payAmount
            ? Math.floor((receiveAmount / payAmount) * slippageTolerancePercent * 10000) / 10000
            : props.swapData.isReverse
            ? props.swapData.poolPrice.toFixed(4)
            : (1 / props.swapData.poolPrice).toFixed(4)
        } ${receiveDisplayName}`;
        if (props.swapData.pay.amount && props.swapData.receive.amount) {
          minReceivedText.value = `${
            Math.floor(receiveAmount * slippageTolerancePercent * 10000) / 10000
          } ${receiveDisplayName}`;
        } else {
          minReceivedText.value = null;
        }
      },
      { immediate: true },
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
.custom-slippage {
  &:hover &__input::placeholder {
    color: var(--muted);
  }

  &__input {
    min-width: 0.66em;
    font: inherit;
    letter-spacing: inherit;
    outline: none;
    -moz-appearance: textfield;

    &:empty {
      text-align: center;
    }

    &:focus,
    &:valid {
      text-align: right;
    }

    &::placeholder,
    &:focus::placeholder {
      color: var(--inactive);
    }
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
    }
  }
}
</style>
