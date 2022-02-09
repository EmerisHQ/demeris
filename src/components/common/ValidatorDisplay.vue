<template>
  <div
    class="denom-select flex items-center"
    :class="{
      'py-4 px-6': size === 'sm',
      'py-6 px-5': size === 'md',
    }"
  >
    <div class="self-stretch flex items-center flex-shrink-0 pr-3 cursor-pointer flex-grow">
      <CircleSymbol :denom="stakingDenom" :chain-name="undefined" :size="size" :class="'mr-4'" />
      <div>
        <div class="flex items-center font-medium text-1">
          {{ validator.moniker }}
        </div>
        <div class="text-muted text-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
          <AmountDisplay :amount="{ amount: validator.stakedAmount, denom: stakingDenom.name }" /> staked
        </div>
      </div>
    </div>
    <label class="denom-select__coin-amount w-full text-right text-muted hover:text-text focus-within:text-text">
      <AmountInput
        :model-value="validator.inputAmount"
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
      <Price :amount="{ denom: stakingDenom, amount: inputAmount * 10 ** precision }" />
    </label>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Price from '@/components/common/Price.vue';
import AmountInput from '@/components/ui/AmountInput.vue';
import useAccount from '@/composables/useAccount';
import { GlobalDemerisGetterTypes, RootStoreType } from '@/store';
import { ChainData } from '@/store/demeris-api/state';
import { keyHashfromAddress } from '@/utils/basic';

export default defineComponent({
  name: 'ValidatorDisplay',
  components: { AmountDisplay, CircleSymbol, AmountInput, Price },
  props: {
    validator: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    size: { type: String, required: false, default: 'md' },
  },
  setup(props) {
    const store = useStore() as RootStoreType;
    const { stakingBalances } = useAccount();
    const chain = computed(() => {
      return store.getters[GlobalDemerisGetterTypes.API.getChain]({ chain_name: propsRef.validator.value.chain_name });
    });
    const stakingDenom = computed(() => {
      return (chain.value as ChainData).denoms.find((x) => x.stakable) ?? null;
    });
    const propsRef = toRefs(props);

    const validatorKeyhash = computed(() => {
      if (propsRef.validator.value.operator_address) {
        return keyHashfromAddress(propsRef.validator.value.operator_address);
      } else {
        return null;
      }
    });

    const stakingBalance = computed(() => {
      return stakingBalances.value.find((item) => {
        if (item && validatorKeyhash.value) {
          return (
            item.chain_name === propsRef.validator.value.chain_name && item.validator_address == validatorKeyhash.value
          );
        }
      });
    });
    return {
      stakingDenom,
      stakingBalance,
    };
  },
});
</script>
