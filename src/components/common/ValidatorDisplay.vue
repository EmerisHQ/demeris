<template>
  <div
    class="denom-select flex items-center"
    :class="{
      'py-4 px-6': size === 'sm',
      'py-6 px-5': size === 'md',
    }"
  >
    <div class="self-stretch flex items-center flex-shrink-0 pr-3 cursor-pointer flex-grow">
      <CircleSymbol :denom="baseDenom" :chain-name="undefined" :size="size" :class="'mr-4'" />
      <div>
        <div class="flex items-center font-medium text-1">
          {{ validator.moniker }}
        </div>
        <div class="text-muted text-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {{ validator.validator.stakedAmount / 10 ** precision ?? 0 }} <Denom :name="baseDenom" /> staked
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import useAccount from '@/composables/useAccount';
import { GlobalDemerisGetterTypes, RootStore, RootStoreType } from '@/store';
import { keyHashfromAddress } from '@/utils/basic';

export default defineComponent({
  name: 'ValidatorDisplay',
  components: {},
  props: {
    validator: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    chainName: {
      type: String,
      required: true,
      default: '',
    },
  },
  setup(props) {
    const store = useStore() as RootStoreType;
    const { stakingBalances } = useAccount();
    const chain = computed(() => {
      return store.getters[GlobalDemerisGetterTypes.API.getChain]({ chain_name: propsRef.validator.value.chain_name });
    });
    const stakingDenom = computed(() => {
      return chain.value;
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
      baseDenom,
      stakingBalance,
    };
  },
});
</script>
