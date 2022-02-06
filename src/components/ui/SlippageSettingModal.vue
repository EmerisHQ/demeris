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
          :class="[
            slippage === 0.1 && !isCustomSelected ? 'bg-surface theme-inverse dark:theme-inverse font-medium' : '',
          ]"
          @click="setSlippage(0.1)"
        >
          0.1%
        </button>
        <button
          class="h-12 flex-grow bg-fg rounded-xl outline-none text-text"
          :class="[
            slippage === 0.5 && !isCustomSelected ? 'bg-surface theme-inverse dark:theme-inverse font-medium' : '',
          ]"
          @click="setSlippage(0.5)"
        >
          0.5%
        </button>
        <button
          class="h-12 flex-grow bg-fg rounded-xl outline-none text-text"
          :class="[
            slippage === 1 && !isCustomSelected ? 'bg-surface theme-inverse dark:theme-inverse font-medium' : '',
          ]"
          @click="setSlippage(1)"
        >
          1%
        </button>
        <Search
          v-if="allowCustomSlippage"
          v-model:keyword="customSlippage"
          :input-type="'number'"
          :is-close-icon-visible="false"
          :is-search-icon-visible="false"
          :border-colour="isCustomSelected && customSlippage != trueSlippage ? 'bg-negative' : null"
          placeholder="Custom"
          class="custom-slippage bg-fg rounded-xl outline-none text-text"
          :class="[
            isCustomSelected && !isCustomSlippageEditing
              ? 'bg-surface theme-inverse dark:theme-inverse font-medium rounded-lg'
              : '',
          ]"
          @update:keyword="(e) => setCustomSlippage(e)"
          @focus:value="(e) => onCustomSlippageFocussed(e)"
          @blur:value="(e) => onCustomSlippageFocusOut(e)"
        >
          <span v-if="!isCustomSlippageEditing" class="text-text">%</span>
        </Search>
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
import { computed, defineComponent, PropType, reactive, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import Search from '@/components/common/Search.vue';
import Alert from '@/components/ui/Alert.vue';
import { GlobalDemerisActionTypes, GlobalDemerisGetterTypes, RootStoreType } from '@/store';
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
    Search,
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
    const { t } = useI18n({ useScope: 'global' });
    const trueSlippage = computed(() => {
      return useStore().getters[GlobalDemerisGetterTypes.USER.getSlippagePerc] || 0.5;
    });
    const allowCustomSlippage = computed(() => {
      return useStore().getters[GlobalDemerisGetterTypes.USER.allowCustomSlippage];
    });

    const inputBackgroundColour = computed(() => {
      if (isCustomSelected.value && !isCustomSlippageEditing.value) {
        return '';
      }
      return isCustomSelected.value || isCustomSlippageEditing.value ? 'var(--surface-image)' : 'var(--transparent)';
    });

    const inputWidth = computed(() => (customSlippage.value ? '4rem' : ''));

    const isCustomSelected = ref(false);
    const isCustomSlippageEditing = ref(false);
    const customSlippage = ref(trueSlippage.value);
    const limitPriceText = ref('');
    const minReceivedText = ref(null);

    const state = reactive({
      slippage: computed(() => {
        if (trueSlippage.value) {
          return trueSlippage.value;
        } else {
          return 0.5;
        }
      }),

      alertStatus: computed(() => {
        const slippage = state.slippage;
        if (slippage) {
          if (
            slippage <= 0 ||
            slippage > 100 ||
            (customSlippage.value && isCustomSelected.value && customSlippage.value != trueSlippage.value)
          ) {
            return 'error';
          } else if (slippage >= 20) {
            return 'warning';
          } else {
            return null;
          }
        } else {
          return null;
        }
      }),
      alertText: computed(() => {
        if (state.alertStatus === 'warning') {
          return t('components.slippageSettingsModal.highSlippageMessage');
        } else if (state.alertStatus === 'error') {
          return t('components.slippageSettingsModal.slippageValueError');
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
        state.validSlippageUpdater(e, true);
      },
      validSlippageUpdater(value, isCustom = false) {
        const slippage = Number(value);
        isCustomSelected.value = isCustom;
        if (slippage > 0 && slippage <= 100) {
          (useStore() as RootStoreType).dispatch(GlobalDemerisActionTypes.USER.SET_SESSION_DATA, {
            data: { slippagePerc: slippage },
          });
        }
      },
    });

    const onCustomSlippageFocussed = () => {
      isCustomSlippageEditing.value = true;
      isCustomSelected.value = true;
      customSlippage.value = trueSlippage.value;
    };

    const onCustomSlippageFocusOut = () => {
      isCustomSlippageEditing.value = false;
    };

    watch(
      () => allowCustomSlippage.value,
      () => {
        if (!allowCustomSlippage.value && isCustomSelected.value) {
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
          useStore().getters[GlobalDemerisGetterTypes.API.getDexChain],
        );
        const receiveDisplayName = await getDisplayName(
          props.swapData.receive.denom,
          useStore().getters[GlobalDemerisGetterTypes.API.getDexChain],
        );
        const payAmount = props.swapData.pay.amount;
        const receiveAmount = props.swapData.receive.amount;

        let slippageTolerancePercent = 1 - state.slippage / 100;
        limitPriceText.value = `1 ${payDisplayName} = ${
          payAmount
            ? Math.floor((receiveAmount / payAmount) * slippageTolerancePercent * 10000) / 10000
            : props.swapData.isReverse
            ? props.swapData.poolPrice?.toFixed(4)
            : (1 / props.swapData.poolPrice)?.toFixed(4)
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

    return {
      ...toRefs(state),
      allowCustomSlippage,
      customSlippage,
      limitPriceText,
      minReceivedText,
      onCustomSlippageFocussed,
      isCustomSelected,
      onCustomSlippageFocusOut,
      isCustomSlippageEditing,
      trueSlippage,
      inputBackgroundColour,
      inputWidth,
    };
  },
});
</script>

<style lang="scss" scoped>
.custom-slippage {
  max-width: 100px;

  &::v-deep(.suffix) {
    align-items: center;
  }

  ::v-deep(input) {
    min-width: 0.66em;
    font: inherit;
    letter-spacing: inherit;
    outline: none;
    -moz-appearance: textfield;
    padding-right: 0;
    background: v-bind(inputBackgroundColour);
    width: v-bind(inputWidth);

    &:empty {
      text-align: right;
    }

    &:focus,
    &:valid {
      text-align: right;
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
