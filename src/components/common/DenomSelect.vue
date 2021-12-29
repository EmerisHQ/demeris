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
    <!--Displays a denom selection component:
				Selected denom badge
				Selected denom name
				Selected chain name
				arrow to display full list in modal (DenomSelectModal.vue)
			  Props:
					denoms: [] of denoms
					disabled: [] of denoms to display as disabled
				Dependencies:
					vuex getter to get  chain name from chain id
		-->
    <!-- selectedDenom?.base_denom ?? ''set atom as a default coin
    when it changed-->

    <div
      class="self-stretch flex items-center flex-shrink-0 pr-3 cursor-pointer"
      :class="isSelected ? 'flex-shrink-0' : 'flex-grow'"
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
            <div class="max-display-width overflow-hidden overflow-ellipsis whitespace-nowrap">{{ displayName }}</div>
            <template #content> {{ displayName }} </template>
          </tippy>
          <Denom v-else :name="selectedDenom?.base_denom" />
          <Icon v-if="hasOptions" name="SmallDownIcon" :icon-size="1" class="ml-1" />
        </div>
        <div v-if="showChain" class="text-muted -text-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
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
      <div class="denom-select__coin-amount-type select-none" :class="{ '-text-1': size === 'sm' }">
        {{ inputHeader }}
      </div>
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
        @input="$emit('update:amount', $event.target.value), $emit('change', inputHeader)"
      />
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
<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import DenomSelectModal from '@/components/common/DenomSelectModal.vue';
import AmountInput from '@/components/ui/AmountInput.vue';
import Icon from '@/components/ui/Icon.vue';
import { getDisplayName } from '@/utils/actionHandler';
import { useStore } from '@/utils/useStore';
export default defineComponent({
  name: 'DenomSelect',
  components: { AmountInput, ChainName, Denom, CircleSymbol, Icon, DenomSelectModal },
  props: {
    inputHeader: { type: String, required: true },
    selectedDenom: { type: Object, required: false, default: null },
    counterDenom: { type: Object, required: false, default: null },
    assets: { type: Object, required: true },
    otherAssets: {
      type: Object,
      default: () => {
        return {};
      },
    },
    amount: { type: [String, Number], required: false, default: null },
    isOver: { type: Boolean, required: false, default: false },
    readonly: { type: Boolean, default: false },
    showChain: { type: Boolean, default: false },
    size: { type: String, required: false, default: 'md' },
  },
  emits: ['update:amount', 'select', 'modalToggle', 'change'],
  setup(props, { emit }) {
    const inputAmount = computed({
      get: () => props.amount,
      set: (value) => emit('update:amount', value),
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
            useStore().getters['demerisAPI/getDexChain'],
          );
        }
      },
    );

    const coinImage = computed(() => {
      try {
        const denom = displayName.value;
        let denomIconName = 'empty';
        if (denom.includes('Gravity')) {
          denomIconName = 'pool';
        } else {
          //TODO adjust url
          denomIconName = denom.toLowerCase();
        }
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const image = require(`@/assets/coins/${isSelected.value ? denomIconName : 'empty'}.png`);
        return image;
      } catch {
        return require(`@/assets/coins/empty.png`);
      }
    });

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

    return {
      inputAmount,
      isSelected,
      isOpen,
      coinImage,
      hasOptions,
      toggleDenomSelectModal,
      denomSelectHandler,
      displayName,
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
