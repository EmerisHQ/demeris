<template>
  <div
    class="denom-select flex items-center py-4 px-6"
    :class="{ 'denom-select--readonly': readonly, 'denom-select--empty': !hasOptions }"
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

    <div class="denom-select__coin self-stretch flex items-center flex-auto pr-3" @click="toggleDenomSelectModal">
      <CircleSymbol
        :denom="selectedDenom?.base_denom ?? 'empty'"
        :chain-name="selectedDenom?.on_chain ?? undefined"
        size="sm"
        class="mr-3 cursor-pointer"
        @click="toggleDenomSelectModal"
      />
      <div v-if="isSelected">
        <div class="denom-select__coin-denom text-0 font-medium">
          <tippy
            v-if="displayName.startsWith('GDEX')"
            :id="`${selectedDenom.on_chain}/${selectedDenom.base_denom}`"
            class="tippy-info"
          >
            <div class="max-display-width">{{ displayName }}</div>
            <template #content> {{ displayName }} </template>
          </tippy>
          <Denom v-else :name="selectedDenom?.base_denom" />
          <Icon v-if="hasOptions" name="SmallDownIcon" :icon-size="1" />
        </div>
        <div class="denom-select__coin-from -text-1 overflow-hidden overflow-ellipsis white-space-nowrap">
          <ChainName :name="selectedDenom.on_chain" />
        </div>
      </div>
      <div v-else>
        <div class="denom-select__coin-denom text-0 font-medium">
          {{ $t('components.denomSelect.select') }} <Icon name="SmallDownIcon" :icon-size="1" />
        </div>
      </div>
    </div>

    <label class="denom-select__coin-amount w-full text-right text-muted hover:text-text focus-within:text-text">
      <div class="denom-select__coin-amount-type -text-1 select-none">{{ inputHeader }}</div>
      <AmountInput
        :model-value="amount"
        :class="isOver ? 'text-negative-text' : 'text-text'"
        :readonly="readonly"
        class="
          denom-select__coin-amount-input
          w-full
          p-0
          text-1 text-right
          font-bold
          bg-transparent
          appearance-none
          border-none
        "
        placeholder="0"
        min="0"
        @input="$emit('update:amount', $event.target.value), $emit('change', inputHeader)"
      />
    </label>
  </div>

  <DenomSelectModal
    v-show="isOpen"
    class="absolute h-full w-full top-0 left-0 overflow-hidden z-10 bg-surface shadow-panel rounded-2xl"
    :assets="assets"
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
import { store } from '@/store';
import { getDisplayName } from '@/utils/actionHandler';
export default defineComponent({
  name: 'DenomSelect',
  components: { AmountInput, ChainName, Denom, CircleSymbol, Icon, DenomSelectModal },
  props: {
    inputHeader: { type: String, required: true },
    selectedDenom: { type: Object, required: false, default: null },
    assets: { type: Object, required: true },
    amount: { type: [String, Number], required: false, default: null },
    isOver: { type: Boolean, required: false, default: false },
    readonly: { type: Boolean, default: false },
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
            store.getters['demeris/getDexChain'],
          );
        }
      },
    );

    const coinImage = computed(() => {
      try {
        const denom = displayName.value;
        let denomIconName = 'empty';
        if (denom.includes('GDEX')) {
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

  &__coin {
    flex-shrink: 0;
    cursor: pointer;

    &-denom {
      display: flex;
      align-items: center;
      color: var(--text);

      .icon {
        margin-left: 0.25rem;
      }

      .max-display-width {
        max-width: 9.375rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    &-from {
      color: var(--muted);
    }

    &-image {
      width: 1.5rem;
      height: 1.5rem;

      margin-right: 0.75rem;

      cursor: pointer;
    }
  }

  &__coin-amount {
    &-input {
      outline: none;

      &::placeholder {
        color: var(--inactive);
        transition: color 150ms ease-out;
      }

      /* Chrome, Safari, Edge, Opera */
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
    &:hover &-input::placeholder {
      color: var(--muted);
    }
    &-input:focus::placeholder {
      color: var(--inactive);
    }
  }

  .over {
    color: var(--negative-text);
  }
}
</style>
