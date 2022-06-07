<template>
  <fieldset
    class="denom-select flex items-center rounded-2xl shadow-panel bg-surface"
    :class="{
      'py-4 px-6': size === 'sm',
      'py-6 px-5': size === 'md',
    }"
  >
    <div class="self-stretch flex items-center shrink-0 pr-3 grow">
      <ValidatorBadge :validator="validator" :size="size" :class="'mr-4'" />
      <div>
        <div class="flex items-center font-medium text-1">
          {{ validator.moniker }}
        </div>
        <div class="text-muted text-0 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer" @click="setMax">
          <AmountDisplay v-if="stakingDenom" :amount="{ amount: validator.stakedAmount, denom: stakingDenom.name }" />
          staked
        </div>
      </div>
    </div>
    <label class="denom-select__coin-amount w-full text-right text-muted hover:text-text focus-within:text-text">
      <AmountInput
        v-model="model"
        class="denom-select__coin-amount-input text-text w-full p-0 text-right font-bold bg-transparent placeholder-inactive appearance-none border-none"
        :class="{ 'text-1': size === 'sm', 'text-2': size === 'md' }"
        placeholder="0"
        min="0"
      />
      <Price
        v-if="stakingDenom"
        :amount="{ denom: stakingDenom.name, amount: modelInBase }"
        :show-zero="true"
        :show-dash="false"
      />
    </label>
  </fieldset>
</template>

<script setup lang="ts">
import BigNumber from 'bignumber.js';
import { computed, toRefs } from 'vue';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import Price from '@/components/common/Price.vue';
import ValidatorBadge from '@/components/common/ValidatorBadge.vue';
import AmountInput from '@/components/ui/AmountInput.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { DesignSizes } from '@/types/util';

interface Props {
  validator: any;
  size?: DesignSizes;
  modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  modelValue: undefined,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

const store = useStore() as RootStoreTyped;

const chain = computed(() => {
  return store.getters[GlobalGetterTypes.API.getChain]({ chain_name: propsRef.validator.value.chain_name });
});
const stakingDenom = computed(() => {
  return chain.value?.denoms.find((x) => x.stakable) ?? null;
});
const propsRef = toRefs(props);

const model = computed({
  get: () => propsRef.modelValue.value,
  set: (value) => emit('update:modelValue', value),
});
const modelInBase = computed(() => {
  return new BigNumber(model.value).multipliedBy(10 ** stakingDenom.value.precision).toString();
});
const setMax = () => {
  model.value = new BigNumber(propsRef.validator.value.stakedAmount)
    .dividedBy(10 ** stakingDenom.value.precision)
    .toString();
};
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
