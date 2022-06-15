<template>
  <div
    class="denom-select flex items-center"
    :class="{
      'denom-select--readonly': readonly,
      'denom-select--empty': !hasOptions,
      'py-4 px-6': size === 'sm',
      'py-6 px-5': size === 'md',
    }"
  >
    <div
      class="self-stretch flex items-center shrink-0 pr-3 cursor-pointer"
      :class="isSelected ? 'shrink-0' : 'grow'"
      @click="toggleDenomSelectModal"
    >
      <CircleSymbol
        :denom="selectedDenom?.base_denom ?? 'empty'"
        :chain-name="selectedDenom?.on_chain ?? undefined"
        :size="size"
        :class="showChain ? 'mr-3' : 'mr-4'"
        @click="toggleDenomSelectModal"
      />
      <div v-if="isSelected">
        <div class="flex items-center font-medium" :class="showChain ? 'text-0' : 'text-1'">
          <tippy
            v-if="displayName.startsWith('Gravity')"
            :id="`${selectedDenom.on_chain}/${selectedDenom.base_denom}`"
            class="tippy-info"
          >
            <div class="max-display-width overflow-hidden text-ellipsis whitespace-nowrap">{{ displayName }}</div>
            <template #content> {{ displayName }} </template>
          </tippy>
          <Denom
            v-else
            :name="selectedDenom?.base_denom"
            :class="{
              'font-medium text-1': !isDefaultState,
            }"
          />
          <Icon v-if="hasOptions" name="SmallDownIcon" :icon-size="1" class="ml-1" />
        </div>
        <div v-if="showChain" class="text-muted -text-1 overflow-hidden text-ellipsis whitespace-nowrap">
          <ChainName :name="selectedDenom.on_chain" />
        </div>
      </div>
      <div v-else>
        <div class="flex items-center font-medium" :class="showChain ? 'text-0' : 'text-1'">
          {{ $t('components.denomSelect.select') }} <Icon name="SmallDownIcon" :icon-size="1" class="ml-1" />
        </div>
      </div>
    </div>

    <label
      v-if="isSelected"
      class="denom-select__coin-amount w-full text-right text-muted hover:text-text focus-within:text-text"
    >
      <div
        v-if="isDefaultState"
        class="denom-select__coin-amount-type select-none"
        :class="{ '-text-1': size === 'sm' }"
      >
        {{ inputHeader }}
      </div>
      <SkeletonLoader v-if="isAmountLoading" width="80%" height="1.3125rem" />
      <AmountInput
        v-else
        :model-value="amount"
        :readonly="readonly"
        class="denom-select__coin-amount-input text-text w-full p-0 text-right font-bold bg-transparent placeholder-inactive appearance-none border-none"
        :class="{ 'text-1': size === 'sm', 'text-2': size === 'md' }"
        placeholder="0"
        min="0"
        @input="$emit('update:amount', ($event.target as HTMLInputElement).value), $emit('change', inputHeader)"
      />
      <div
        v-if="!isDefaultState && !isAmountLoading"
        class="denom-select__coin-amount-type select-none"
        :class="{ '-text-1': size === 'sm' }"
      >
        {{ displayPrice }}
      </div>
    </label>
  </div>
  <DenomSelectModal
    v-if="isOpen"
    class="inset-0 z-30"
    :class="{
      'absolute overflow-hidden z-30 bg-surface shadow-panel rounded-2xl': size === 'sm',
      'fixed bg-bg': size === 'md',
    }"
    v-bind="$attrs"
    :other-assets="otherAssets"
    :assets="assets"
    :counter-denom="counterDenom"
    :func="toggleDenomSelectModal"
    :title="inputHeader.startsWith('Pay') ? 'Pay with' : 'Receive'"
    @select="denomSelectHandler"
  />
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import DenomSelectModal from '@/components/common/DenomSelectModal.vue';
import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import AmountInput from '@/components/ui/AmountInput.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalGetterTypes } from '@/store';
import { DesignSizes } from '@/types/util';
import { getDisplayName } from '@/utils/actionHandler';
import { useStore } from '@/utils/useStore';

const emit = defineEmits<{
  (e: 'update:amount', value: any): void;
  (e: 'select', payload: any): void;
  (e: 'modalToggle', isOpen: any): void;
  (e: 'change', inputHeader: any): void;
}>();

interface Props {
  inputHeader: string;
  selectedDenom: object;
  counterDenom: object;
  assets: object;
  otherAssets: object;
  amount: any;
  isOver: boolean;
  readonly?: boolean;
  showChain?: boolean;
  size: DesignSizes;
  isDefaultState?: boolean;
  isAmountLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  inputHeader: '',
  selectedDenom: null,
  counterDenom: null,
  otherAssets: () => {
    return {};
  },
  amount: null,
  isOver: false,
  readonly: false,
  showChain: false,
  size: 'md',
  isDefaultState: true,
  isAmountLoading: false,
});

const isSelected = computed(() => {
  return props?.selectedDenom === null ? false : true;
});

const hasOptions = computed(() => {
  return props.assets.length > 0;
});

const displayName = ref('');
watch(
  () => props.selectedDenom,
  async () => {
    if (props.selectedDenom?.base_denom) {
      displayName.value = await getDisplayName(
        props.selectedDenom.base_denom,
        useStore().getters[GlobalGetterTypes.API.getDexChain],
      );
    }
  },
);

const isOpen = ref(false);

function toggleDenomSelectModal() {
  if (!hasOptions.value || props.readonly) {
    return;
  }
  isOpen.value = !isOpen.value;
  emit('modalToggle', isOpen.value);
}

function denomSelectHandler(payload) {
  emit('select', payload);
  toggleDenomSelectModal();
}
//Removes text before $
const displayPrice = computed(() =>
  props.inputHeader.substring(props.inputHeader.indexOf('$'), props.inputHeader.length),
);
</script>
<style lang="scss" scoped>
.denom-select {
  &--empty &__coin,
  &--empty &__coin-image {
    cursor: default;
  }

  .max-display-width {
    max-width: 9.375rem;
  }

  &__coin-amount {
    &-input {
      outline: none;

      &::placeholder {
        transition: color 150ms ease-out;
      }

      /* Chrome, Safari, Edge, Opera */
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
    &:hover &-input:not(:focus)::placeholder {
      color: var(--muted);
    }
  }
}
</style>
