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
          class="h-12 grow rounded-xl outline-none text-text"
          :class="[
            slippage === 0.1 && !isCustomSelected ? 'bg-surface theme-inverse dark:theme-inverse font-medium' : 'bg-fg',
          ]"
          @click="setSlippage(0.1)"
        >
          0.1%
        </button>
        <button
          class="h-12 grow rounded-xl outline-none text-text"
          :class="[
            slippage === 0.5 && !isCustomSelected ? 'bg-surface theme-inverse dark:theme-inverse font-medium' : 'bg-fg',
          ]"
          @click="setSlippage(0.5)"
        >
          0.5%
        </button>
        <button
          class="h-12 grow rounded-xl outline-none text-text"
          :class="[
            slippage === 1 && !isCustomSelected ? 'bg-surface theme-inverse dark:theme-inverse font-medium' : 'bg-fg',
          ]"
          @click="setSlippage(1)"
        >
          1%
        </button>
        <Input
          v-if="allowCustomSlippage"
          v-model:modelValue="customSlippage"
          class="rounded-xl outline-none text-text"
          :class="[
            isCustomSelected && !isCustomSlippageEditing && alertStatus !== 'error'
              ? 'bg-surface theme-inverse dark:theme-inverse font-medium rounded-lg'
              : 'bg-fg',
          ]"
          :border-colour="isCustomSelected && customSlippage != trueSlippage ? 'bg-negative' : null"
          placeholder="Custom"
          :force-border-visible="isCustomSelected && alertStatus == 'error'"
          :value-formatter="format"
          type="text"
          @update:modelValue="(e) => setCustomSlippage(e)"
          @focus:value="(_e) => onCustomSlippageFocussed()"
          @blur:value="(_e) => onCustomSlippageFocusOut()"
          @keydown="(e) => onKeyDown(e)"
        >
          <template #end>
            <span v-if="isCustomSlippageEditing">%</span>
          </template>
        </Input>
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
        <div class="shrink ml-1 -text-1 font-normal text-right">
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
        <div class="shrink ml-1 -text-1 font-normal text-right">{{ minReceivedText }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import Alert from '@/components/ui/Alert.vue';
import Input from '@/components/ui/Input.vue';
import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';
import { getDisplayName } from '@/utils/actionHandler';
import { useStore } from '@/utils/useStore';

type SwapData = {
  pay: { denom: string; amount: number };
  receive: { denom: string; amount: number };
  poolPrice: number;
  isReverse: boolean;
};

interface Props {
  swapData: SwapData;
}

const props = withDefaults(defineProps<Props>(), {
  swapData: () => {
    return {
      pay: { denom: '', amount: 0 },
      receive: { denom: '', amount: 0 },
      poolPrice: 0,
      isReverse: false,
    };
  },
});

const emit = defineEmits<{
  (e: 'goback'): void;
}>();

const { t } = useI18n({ useScope: 'global' });
const typedstore = useStore() as RootStoreTyped;
const trueSlippage = computed(() => {
  return typedstore.getters[GlobalGetterTypes.USER.getSlippagePerc] || 0.5;
});
const allowCustomSlippage = computed(() => {
  return typedstore.getters[GlobalGetterTypes.USER.allowCustomSlippage];
});

const inputWidth = computed(() =>
  customSlippage.value && customSlippage.value?.toString()?.length >= 6 ? '7.5rem' : '5rem',
);
const textAlign = computed(() => (isCustomSlippageEditing.value ? 'left' : 'center'));
const suffixParent = computed(() => (isCustomSlippageEditing.value ? null : 0));
const inputBackground = computed(() => {
  return isCustomSelected.value && state.alertStatus == 'error'
    ? `var(--fg-solid)`
    : isCustomSelected.value && !isCustomSlippageEditing.value && state.alertStatus !== 'error'
    ? 'var(--text)'
    : 'var(--fg)';
});
const isCustomSelected = ref(false);
const isCustomSlippageEditing = ref(false);
const customSlippage = ref(
  trueSlippage.value != 0.1 && trueSlippage.value != 0.5 && trueSlippage.value != 1 ? trueSlippage.value : 'Custom',
);
const limitPriceText = ref('');
const minReceivedText = ref(null);

const format = (value: string) => {
  let newValue = value;
  // Only numbers
  newValue = newValue.replace(/[^0-9.]/g, '');

  if (newValue.startsWith('.')) {
    newValue = '0' + newValue;
  }

  if (newValue.split('').filter((char) => char === '.').length > 1) {
    // Remove subsequent separators
    newValue = newValue.replace(/(?<=\..*)\./g, '');
  }

  return newValue;
};

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
        (customSlippage.value &&
          isCustomSelected.value &&
          parseFloat(customSlippage.value.toString()?.replace('%', '')) != trueSlippage.value) ||
        (isCustomSelected.value && !customSlippage.value)
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
      if (!isCustom) {
        customSlippage.value = 'Custom';
      }
      typedstore.dispatch(GlobalActionTypes.USER.SET_SESSION_DATA, {
        data: { slippagePerc: slippage },
      });
    }
  },
});

const { slippage, alertStatus, alertText, emitHandler, setSlippage, setCustomSlippage } = toRefs(state);

const onCustomSlippageFocussed = () => {
  isCustomSlippageEditing.value = true;
  isCustomSelected.value = true;
  customSlippage.value = trueSlippage.value;
};

const onCustomSlippageFocusOut = () => {
  isCustomSlippageEditing.value = false;
  if (!!Number(customSlippage.value)) {
    customSlippage.value += '%';
  }
};

const onKeyDown = (e) => {
  const keyCode = e.keyCode || e.which;
  if (keyCode == 8 || keyCode == 27 || keyCode == 46 || keyCode == 37 || keyCode == 39) {
    // backspace || delete || escape || arrows
    return;
  } else if (/^[A-Za-z]+$/.test(e.key) || /[-!$%^@&*()_+|~=`\\#{}\[\]:";'<>?,\/]/.test(e.key)) {
    //disallow alphabets and these characters.
    e.preventDefault();
  }
  return;
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
      useStore().getters[GlobalGetterTypes.API.getDexChain],
    );
    const receiveDisplayName = await getDisplayName(
      props.swapData.receive.denom,
      useStore().getters[GlobalGetterTypes.API.getDexChain],
    );
    const payAmount = props.swapData.pay.amount;
    const receiveAmount = props.swapData.receive.amount;

    const slippageTolerancePercent = 1 - state.slippage / 100;
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

onMounted(() => {
  if (state.slippage && state.slippage != 0.1 && state.slippage != 0.5 && state.slippage != 1) {
    isCustomSelected.value = true;
  }
  if (!!Number(customSlippage.value)) {
    customSlippage.value += '%';
  }
});
</script>

<style lang="scss" scoped>
:deep(.input) {
  width: v-bind(inputWidth);
  input {
    &:empty {
      text-align: center;
    }
    &:focus,
    &:valid {
      text-align: v-bind(textAlign);
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

:deep(.input__icon) {
  color: var(--text);
  padding: v-bind(suffixParent);
  display: flex;
  align-items: center;
  height: inherit;
}

:deep(input) {
  padding-right: 0.82rem;
  background: v-bind(inputBackground);
}
</style>
