<template>
  <div class="denom-select">
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

    <img
      class="denom-select__coin-image"
      :src="require(`@/assets/coins/${isSelected ? selectedDenom?.base_denom?.substr(1) : 'stake'}.png`)"
      :alt="`${type} coin`"
      @click="openDenomSelectModal"
    />

    <div v-if="isSelected" class="denom-select__coin" @click="openDenomSelectModal">
      <div class="denom-select__coin-denom s-0 w-medium">
        {{ $filters.getCoinName(selectedDenom?.base_denom) }}
        <Icon name="SmallDownIcon" :width="'16'" :height="'16'" :view-box="'0 0 16 16'" />
      </div>
      <div class="denom-select__coin-from s-minus">{{ selectedDenom.on_chain }}</div>
    </div>

    <div v-else class="denom-select__coin" @click="openDenomSelectModal">
      <div class="denom-select__coin-denom s-0 w-medium">
        Select asset <Icon name="SmallDownIcon" :width="'16'" :height="'16'" :view-box="'0 0 16 16'" />
      </div>
    </div>

    <div class="denom-select__coin-amount">
      <div class="denom-select__coin-amount-type s-minus">{{ type }}</div>
      <input
        :value="amount"
        class="denom-select__coin-amount-input s-1"
        type="number"
        placeholder="0"
        min="0"
        @input="$emit('update:amount', Math.abs(Number($event.target.value)))"
      />
    </div>
  </div>

  <DenomSelectModal v-show="isOpen" />
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import DenomSelectModal from '@/components/common/DenomSelectModal.vue';
import Icon from '@/components/ui/Icon.vue';
export default defineComponent({
  name: 'DenomSelect',
  components: { Icon, DenomSelectModal },
  props: {
    type: { type: String, required: true },
    selectedDenom: { type: Object, required: false, default: null },
    userBalance: { type: Object, required: true },
    amount: { type: Number, required: false, default: null },
  },
  emits: ['update:amount'],
  setup(props, { emit }) {
    const inputAmount = computed({
      get: () => props.amount,
      set: value => emit('update:amount', value),
    });

    const isSelected = computed(() => {
      return props?.selectedDenom === null ? false : true;
    });

    const isOpen = ref(false);

    function openDenomSelectModal() {
      isOpen.value = true;
    }

    console.log(props.userBalance);
    return { inputAmount, isSelected, isOpen, openDenomSelectModal };
  },
});
</script>
<style lang="scss" scoped>
.denom-select {
  display: flex;
  align-items: center;

  padding: 1.6rem 2.4rem;

  &__coin {
    flex-shrink: 0;
    cursor: pointer;

    &-denom {
      display: flex;
      align-items: center;
      color: var(--text);

      svg {
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
}
</style>
