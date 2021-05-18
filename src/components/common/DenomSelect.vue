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
    <img class="denom-select__coin-image" src="@/assets/coins/atom.png" alt="pay coin">
    <div class="denom-select__coin">
      <div class="denom-select__coin-denom s-0 w-medium">ATOM</div>
      <div class="denom-select__coin-from s-minus">Cosmos Hub</div>
    </div>
    <div class="denom-select__coin-amount">
      <div class="denom-select__coin-amount-type s-minus">Pay</div>
      <input class="denom-select__coin-amount-input s-1" type="number" value="0">
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'DenomSelect',
  setup() {
    const store = useStore();
    const chains = computed(() => store.getters.getChain);
    console.log(chains);
    console.log(store.state.demeris.chains);
    return { chains };
  },
});
</script>
<style lang="scss" scoped>
.denom-select {
  display:flex;
  align-items: center;

  padding: 0 2.4rem;

  &__coin-image {
    width: 2.4rem;
    height: 2.4rem;

    margin-right:1.2rem;
  }

  &__coin {
    flex-shrink: 0;

    &-denom {
      color:var(--text);
    }

    &-from {
      color:var(--muted);
    }
  }

  &__coin-amount {
    text-align: right;
    width: 100%;
    margin-left: 1.2rem;

    &-type {
      color:var(--muted);
    }
   
    &-input {
      width: 100%;
      text-align: inherit;
      border: none;
      outline: none;
      padding: 0;

      color:var(--text);

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