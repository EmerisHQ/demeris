<template>
  <div
    class="denom-select flex items-center hover-show-delete relative"
    :class="{
      'py-4 px-6': size === 'sm',
      'py-6 px-5': size === 'md',
    }"
  >
    <button
      class="w-6 h-6 flex items-center justify-evenly cursor-pointer hidden delete-button rounded-full absolute -top-5 -right-3 text-white bg-black/54"
      @click="removeValidator"
    >
      <Icon :name="'CloseIcon'" :icon-size="1" />
    </button>
    <div class="self-stretch flex items-center shrink-0 pr-3 cursor-pointer grow" @click="selectValidator">
      <ValidatorBadge :size="size" :validator="validator" class="mr-4" />
      <div>
        <div class="flex items-center font-medium text-1">
          {{ validator.moniker }}
          <Icon name="SmallDownIcon" :icon-size="1" class="ml-1" />
        </div>
        <div class="text-muted text-0 overflow-hidden text-ellipsis whitespace-nowrap">
          {{ validator.stakedAmount / 10 ** precision ?? 0 }} <Denom :name="baseDenom" /> staked
        </div>
      </div>
    </div>
    <label class="denom-select__coin-amount w-full text-right text-muted hover:text-text focus-within:text-text">
      <AmountInput
        v-model="inputAmount"
        class="denom-select__coin-amount-input text-text w-full p-0 text-right font-bold bg-transparent placeholder-inactive appearance-none border-none"
        :class="{ 'text-1': size === 'sm', 'text-2': size === 'md' }"
        placeholder="0"
        min="0"
        data-cy="denom-amount-input"
      />
      <Price
        :amount="{ denom: baseDenom, amount: (parseFloat(inputAmount) * 10 ** precision).toString() }"
        :show-zero="true"
        :show-dash="false"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import Denom from '@/components/common/Denom.vue';
import Price from '@/components/common/Price.vue';
import ValidatorBadge from '@/components/common/ValidatorBadge.vue';
import AmountInput from '@/components/ui/AmountInput.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalGetterTypes } from '@/store';
import { DesignSizes } from '@/types/util';

interface Props {
  amount: string;
  size?: DesignSizes;
  validator: any;
}

const props = withDefaults(defineProps<Props>(), {
  amount: '',
  size: 'md',
  validator: () => {
    return {};
  },
});

const emit = defineEmits<{
  (e: 'update:amount', value: any): void;
  (e: 'select', value: any): void;
  (e: 'unselect', value: any): void;
}>();

const route = useRoute();
const store = useStore();
const baseDenom = route.params.denom as string;
const precision = computed(() =>
  store.getters[GlobalGetterTypes.API.getDenomPrecision]({
    name: baseDenom,
  }),
);

const propsRef = toRefs(props);

const inputAmount = computed({
  get: () => propsRef.amount.value,
  set: (value) => emit('update:amount', value),
});

const selectValidator = () => {
  emit('select', propsRef.validator.value);
};

const removeValidator = () => {
  emit('unselect', propsRef.validator.value);
};
</script>
<style lang="scss" scoped>
.hover-show-delete {
  &:hover {
    .delete-button {
      display: block;
    }
  }
  .delete-button:hover {
    display: block;
  }
}
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
