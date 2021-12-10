<template>
  <div
    class="denom-select flex items-center"
    :class="{
      'py-4 px-6': size === 'sm',
      'py-6 px-5': size === 'md',
    }"
  >
    <div
      class="self-stretch flex items-center flex-shrink-0 pr-3 cursor-pointer"
      :class="isSelected ? 'flex-shrink-0' : 'flex-grow'"
      @click="toggleDenomSelectModal"
    >
      <CircleSymbol
        :denom="'uatom'"
        :chain-name="undefined"
        :size="size"
        :class="'mr-4'"
        @click="toggleDenomSelectModal"
      />
      <div>
        <div class="flex items-center font-medium text-1">
          {{ validator.moniker }}

          <Icon name="SmallDownIcon" :icon-size="1" class="ml-1" />
        </div>
        <div class="text-muted text-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {{ validator.stakedAmount / 10 ** precision ?? 0 }} <Denom :name="'uatom'" /> staked
        </div>
      </div>
    </div>
    <label class="denom-select__coin-amount w-full text-right text-muted hover:text-text focus-within:text-text">
      <AmountInput
        :model-value="amount"
        :readonly="readonly"
        class="
          denom-select__coin-amount-input
          text-text
          w-full
          p-0
          text-right
          font-bold
          bg-transparent
          placeholder-inactive
          appearance-none
          border-none
        "
        :class="{ 'text-1': size === 'sm', 'text-2': size === 'md' }"
        placeholder="0"
        min="0"
        @input="$emit('update:amount', $event.target.value)"
      />
      test21231
    </label>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import AmountInput from '@/components/ui/AmountInput.vue';
import Icon from '@/components/ui/Icon.vue';
import { store } from '@/store';
import { getDisplayName } from '@/utils/actionHandler';
export default defineComponent({
  name: 'ValidatorSelect',
  components: { AmountInput, Denom, CircleSymbol, Icon },
  props: {
    amount: { type: [String, Number], required: false, default: null },
    isOver: { type: Boolean, required: false, default: false },
    readonly: { type: Boolean, default: false },
    showChain: { type: Boolean, default: false },
    size: { type: String, required: false, default: 'md' },
    validator: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  emits: ['update:amount', 'select', 'modalToggle', 'change'],
  setup(props, { emit }) {
    const inputAmount = computed({
      get: () => props.amount,
      set: (value) => emit('update:amount', value),
    });
    const router = useRouter();
    const baseDenom = router.currentRoute.value.params.denom as string;
    const precision = computed(() =>
      store.getters['demeris/getDenomPrecision']({
        name: baseDenom,
      }),
    );

    const isSelected = computed(() => {
      return true;
    });

    const isOpen = ref(false);

    function toggleDenomSelectModal() {
      isOpen.value = !isOpen.value;
      emit('modalToggle', isOpen.value);
    }

    function denomSelectHandler(payload) {
      emit('select', payload);
      toggleDenomSelectModal();
    }

    return {
      inputAmount,
      isSelected,
      isOpen,
      precision,
      toggleDenomSelectModal,
      denomSelectHandler,
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
