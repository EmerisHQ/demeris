<template>
  <div
    class="denom-select flex items-center rounded-2xl shadow-panel bg-surface"
    :class="{
      'py-4 px-6': size === 'sm',
      'py-6 px-5': size === 'md',
    }"
  >
    <div class="self-stretch flex items-center flex-shrink-0 pr-3 flex-grow">
      <ValidatorBadge :validator="validator" :size="size" :class="'mr-4'" />
      <div>
        <div class="flex items-center font-medium text-1">
          {{ validator.moniker }}
        </div>
        <div
          class="text-muted text-0 overflow-hidden overflow-ellipsis whitespace-nowrap cursor-pointer"
          @click="setMax"
        >
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
  </div>
</template>
<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, toRefs } from 'vue';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import Price from '@/components/common/Price.vue';
import AmountInput from '@/components/ui/AmountInput.vue';
import { GlobalGetterTypes, RootStoreType } from '@/store';
import { ChainData } from '@/store/demeris-api/state';

import ValidatorBadge from '../common/ValidatorBadge.vue';

export default defineComponent({
  name: 'StakedValidatorAmountInput',
  components: { AmountDisplay, ValidatorBadge, AmountInput, Price },
  props: {
    modelValue: {
      type: String,
      required: false,
      default: undefined,
    },
    validator: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    size: { type: String, required: false, default: 'md' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const store = useStore() as RootStoreType;

    const chain = computed(() => {
      return store.getters[GlobalGetterTypes.API.getChain]({ chain_name: propsRef.validator.value.chain_name });
    });
    const stakingDenom = computed(() => {
      return (chain.value as ChainData)?.denoms.find((x) => x.stakable) ?? null;
    });
    const propsRef = toRefs(props);

    const model = computed({
      get: () => propsRef.modelValue.value,
      set: (value) => emit('update:modelValue', value),
    });
    const modelInBase = computed(() => {
      return new BigNumber(model.value).multipliedBy(10 ** parseInt(stakingDenom.value.precision)).toString();
    });
    const setMax = () => {
      model.value = new BigNumber(propsRef.validator.value.stakedAmount)
        .dividedBy(10 ** parseInt(stakingDenom.value.precision))
        .toString();
    };
    const stakingBalance = computed(() => {
      return propsRef.validator.value.stakedAmount;
    });
    return {
      stakingDenom,
      model,
      modelInBase,
      stakingBalance,
      setMax,
    };
  },
});
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
