<template>
  <div class="flex flex-col space-y-7 pb-3">
    <div class="flex space-x-2" role="radiogroup">
      <label v-for="option of slippageOptions" :key="option" class="min-w-[52px] flex-1 shrink-0 py-[2px]">
        <input v-model="data.selectedOption" name="slippage" type="radio" :value="option" class="peer sr-only" />
        <div
          class="transition-all duration-300 cursor-pointer py-3 text-center shrink-0 rounded-xl text-text bg-fg peer-checked:font-medium peer-checked:theme-inverse peer-checked:bg-surface"
          aria-hidden
        >
          {{ option }}%
        </div>
      </label>

      <div v-if="allowCustomSlippage" class="flex w-full relative p-[2px]">
        <div
          class="relative w-full rounded-xl px-2 inline-flex items-center z-[1]"
          :class="[
            isCustomInputFocused ? 'bg-bg' : 'bg-fg dark:bg-fg',
            isCustomSelected && alertStatus !== 'error' ? 'theme-inverse text-text font-medium !bg-surface' : '',
            alertStatus === 'error' ? 'error-border' : '',
          ]"
        >
          <FlexibleAmountInput
            ref="customInputRef"
            v-model="data.customValue"
            :min-width="30"
            :suffix="showCustomPlaceholder ? '' : '%'"
            class="max-w-full"
            :placeholder="showCustomPlaceholder ? '' : '0'"
            :forcer-border-visible="true"
            compact
            @focus="() => toggleCustomFocus()"
            @blur="() => toggleCustomFocus()"
          />
          <span
            v-if="showCustomPlaceholder"
            class="transition-opacity absolute pointer-events-none text-center left-0 right-0"
          >
            Custom
          </span>
        </div>
        <div
          class="absolute w-full h-full left-0 top-0 rounded-[0.7rem] bg-gold-circular"
          :class="{ 'opacity-0': !isCustomInputFocused }"
        />
      </div>
    </div>

    <dl v-if="state.matches('ready.valid')" class="grid grid-cols-[auto_1fr] gap-y-3 -text-1 mr-1">
      <dt class="text-muted">Limit price</dt>
      <dd class="text-right font-medium whitespace-nowrap">
        <AmountDisplay :amount="inputAmount" /> =
        <AmountDisplay :amount="limitPrice" />
      </dd>
      <dt class="text-muted">
        Min. received
        <div class="absolute">(if 100% swapped)</div>
      </dt>
      <dd class="text-right font-medium"><AmountDisplay :amount="minOutputAmount" /></dd>
    </dl>
    <div v-if="alertStatus">
      <Alert :status="alertStatus" :message="alertText" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useToggle } from '@vueuse/core';
import { computed, nextTick, onMounted, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import Alert from '@/components/ui/Alert.vue';
import FlexibleAmountInput from '@/components/ui/FlexibleAmountInput.vue';
import { GlobalGetterTypes } from '@/store';

import { amountToUnit, getLimitPriceFromRoute, getMinOutputAmountFromRoute } from '../../logic';
import { useSwapActor } from '../../state';

const slippageOptions = ['0.1', '0.5', '1'];

const store = useStore();
const { state, send } = useSwapActor();
const { t } = useI18n({ useScope: 'global' });

const data = reactive({
  selectedOption: String(state.value.context.maxSlippage),
  customValue: '',
});

const [isCustomInputFocused, toggleCustomFocus] = useToggle();
const isCustomSelected = computed(() => data.selectedOption === data.customValue);
const allowCustomSlippage = computed(() => store.getters[GlobalGetterTypes.USER.allowCustomSlippage]);

const inputAmount = computed(() => amountToUnit({ amount: '1', denom: state.value.context.inputCoin?.baseDenom }));

const limitPrice = computed(() =>
  amountToUnit({
    amount: getLimitPriceFromRoute(state.value.context, state.value.context.selectedRouteIndex),
    denom: state.value.context.outputCoin?.baseDenom,
  }),
);

const minOutputAmount = computed(() =>
  amountToUnit({
    amount: getMinOutputAmountFromRoute(state.value.context, state.value.context.selectedRouteIndex),
    denom: state.value.context.outputCoin?.baseDenom,
  }),
);

const showCustomPlaceholder = computed(() => {
  if (isCustomInputFocused.value) return false;
  if (data.customValue !== '') return false;
  return true;
});

const alertStatus = computed(() => {
  if (Number(data.selectedOption) >= 20 && Number(data.selectedOption) <= 100) {
    return 'warning';
  } else if (Number(data.selectedOption) === 0 || Number(data.selectedOption) > 100) {
    return 'error';
  } else {
    return null;
  }
});

const alertText = computed(() => {
  if (alertStatus.value === 'warning') {
    return t('components.slippageSettingsModal.highSlippageMessage');
  } else if (alertStatus.value === 'error') {
    return t('components.slippageSettingsModal.slippageValueError');
  } else {
    return '';
  }
});

watch(isCustomInputFocused, () => {
  if (isCustomInputFocused.value) {
    data.selectedOption = undefined;
  } else {
    if (slippageOptions.includes(data.customValue)) {
      data.selectedOption = data.customValue;
      data.customValue = '';
      return;
    }

    if (data.customValue) {
      data.selectedOption = data.customValue;
    }
  }
});

onMounted(() => {
  if (!slippageOptions.includes(data.selectedOption)) {
    nextTick(() => (data.customValue = data.selectedOption));
  }
});

watch(data, () => {
  send({ type: 'SLIPPAGE.CHANGE', value: data.selectedOption });
});
</script>
<style lang="postcss" scoped>
.error-border {
  border: var(--negative);
  border-style: solid;
}
</style>
