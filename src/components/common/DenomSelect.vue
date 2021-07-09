<template>
  <div class="denom-select" :class="{ 'denom-select--readonly': readonly, 'denom-select--empty': !hasOptions }">
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

    <CircleSymbol
      :denom="selectedDenom?.base_denom"
      size="sm"
      class="denom-select__coin-image"
      @click="toggleDenomSelectModal"
    />

    <div v-if="isSelected" class="denom-select__coin" @click="toggleDenomSelectModal">
      <div class="denom-select__coin-denom s-0 w-medium">
        <Denom :name="selectedDenom?.base_denom" />
        <Icon v-if="hasOptions" name="SmallDownIcon" :icon-size="1.6" />
      </div>
      <div class="denom-select__coin-from s-minus"><ChainName :name="selectedDenom.on_chain" /></div>
    </div>

    <div v-else class="denom-select__coin" @click="toggleDenomSelectModal">
      <div class="denom-select__coin-denom s-0 w-medium">
        Select asset <Icon name="SmallDownIcon" :icon-size="1.6" />
      </div>
    </div>

    <div class="denom-select__coin-amount">
      <div class="denom-select__coin-amount-type s-minus">{{ inputHeader }}</div>
      <input
        :value="amount"
        :class="isOver ? 'over' : ''"
        :readonly="readonly"
        class="denom-select__coin-amount-input s-1"
        type="number"
        placeholder="0"
        min="0"
        @input="$emit('update:amount', Math.abs(Number($event.target.value))), $emit('change', inputHeader)"
      />
    </div>
  </div>

  <DenomSelectModal
    v-show="isOpen"
    :assets="assets"
    :func="toggleDenomSelectModal"
    :title="inputHeader.startsWith('Pay') ? 'Pay with' : 'Receive'"
    @select="denomSelectHandler"
  />
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import DenomSelectModal from '@/components/common/DenomSelectModal.vue';
import Icon from '@/components/ui/Icon.vue';
export default defineComponent({
  name: 'DenomSelect',
  components: { ChainName, Denom, CircleSymbol, Icon, DenomSelectModal },
  props: {
    inputHeader: { type: String, required: true },
    selectedDenom: { type: Object, required: false, default: null },
    assets: { type: Object, required: true },
    amount: { type: Number, required: false, default: null },
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

    const coinImage = computed(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const image = require(`@/assets/coins/${
          isSelected.value ? props.selectedDenom.base_denom?.substr(1) : 'stake'
        }.png`);
        return image;
      } catch {
        return require(`@/assets/coins/stake.png`);
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

    return { inputAmount, isSelected, isOpen, coinImage, hasOptions, toggleDenomSelectModal, denomSelectHandler };
  },
});
</script>
<style lang="scss" scoped>
.denom-select {
  display: flex;
  align-items: center;

  padding: 1.6rem 2.4rem;

  &--empty &__coin {
    cursor: default;
  }

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
        margin-left: 0.4rem;
      }
    }

    &-from {
      color: var(--muted);
    }

    &-image {
      width: 2.4rem;
      height: 2.4rem;

      margin-right: 1.2rem;

      cursor: pointer;
    }
  }

  &__coin-amount {
    text-align: right;
    width: 100%;
    margin-left: 1.2rem;

    &-type {
      color: var(--muted);
    }

    &-input {
      width: 100%;
      text-align: inherit;
      border: none;
      outline: none;
      padding: 0;

      color: var(--text);

      /* Chrome, Safari, Edge, Opera */
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Firefox */
      & {
        -moz-appearance: textfield;
      }
    }
  }

  .over {
    color: var(--negative-text);
  }
}
</style>
