<template>
  <div class="self-stretch flex items-center shrink-0 pr-3 grow py-6">
    <ValidatorBadge :validator="validator" :size="size" :class="'mr-4'" />
    <div class="flex items-center font-medium">
      {{ validator.moniker }}
    </div>
    <div class="flex flex-col items-end text-right justify-end grow">
      <div class="text-muted text-0 overflow-hidden text-ellipsis whitespace-nowrap">
        <Price :amount="{ amount: validator.stakedAmount, denom: stakingDenom.name }" />
      </div>
      <div class="text-muted text-0 overflow-hidden text-ellipsis whitespace-nowrap -text-1">
        <AmountDisplay :amount="{ amount: validator.stakedAmount, denom: stakingDenom.name }" /> staked
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import Price from '@/components/common/Price.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { DesignSizes } from '@/types/util';

import ValidatorBadge from '../common/ValidatorBadge.vue';

interface Props {
  validator: any;
  size?: DesignSizes;
}

const props = withDefaults(defineProps<Props>(), { size: 'md' });

const store = useStore() as RootStoreTyped;
const propsRef = toRefs(props);
const chain = computed(() => {
  return store.getters[GlobalGetterTypes.API.getChain]({ chain_name: propsRef.validator.value?.chain_name });
});
const stakingDenom = computed(() => {
  return chain.value?.denoms.find((x) => x.stakable) ?? null;
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
