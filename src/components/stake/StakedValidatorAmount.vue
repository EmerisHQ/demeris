<template>
  <div class="flex w-full justify-center">
    <div class="max-w-7xl mx-auto px-8 w-full flex-1 flex flex-col items-stretch">
      <main class="pb-28 flex-1 flex flex-col items-center justify-center">
        <div class="w-full max-w-lg mx-auto">
          <ValidatorDisplay v-if="validator" v-model:amount="model" :validator="validator" />

          <div class="mt-2 w-full max-w-sm mx-auto">
            <!-- Stake Info -->
            <ListItem inset size="md" label="Time to unstake"> 21 days </ListItem>

            <ListItem inset size="md" label="Total stake remaining">
              <AmountDisplay :amount="{ amount: remainingStake, denom: baseDenom }" />
              <div class="text-muted">
                <Price :amount="{ denom: baseDenom, amount: remainingStake }" :show-zero="true" />
              </div>
            </ListItem>

            <!-- Fee -->
            <div class="mt-6 mb-2">
              <!-- <FeeLevelSelector :steps="actionSteps" @update:fees="state.fees = $event" /> -->
            </div>
            <!-- Continue button -->
            <Button :name="$t('generic_cta.continue')" :disabled="false" />
          </div>
        </div>
      </main>
    </div>
  </div>
  {{ validator.identity }}
  {{ validator.moniker }}
  {{ displayStakingBalance }}
  <AmountInput v-model="model" type="text" />
</template>
<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import Price from '@/components/common/Price.vue';
import ValidatorDisplay from '@/components/common/ValidatorDisplay.vue';
import AmountInput from '@/components/ui/AmountInput.vue';
import Button from '@/components/ui/Button.vue';
import ListItem from '@/components/ui/List/ListItem.vue';
import useAccount from '@/composables/useAccount';
import { GlobalDemerisGetterTypes } from '@/store';
import { keyHashfromAddress } from '@/utils/basic';
export default defineComponent({
  name: 'StakedValidatorAmount',
  components: {
    AmountInput,
    ValidatorDisplay,
    ListItem,
    AmountDisplay,
    Button,
    Price,
  },
  props: {
    modelValue: {
      type: String,
      required: false,
      default: undefined,
    },
    validator: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const route = useRoute();
    const store = useStore();
    const { stakingBalances } = useAccount();

    const propsRef = toRefs(props);

    const model = computed({
      get: () => propsRef.modelValue.value,
      set: (value) => emit('update:modelValue', value),
    });

    const validatorKeyhash = computed(() => {
      if (propsRef.validator.value.operator_address) {
        return keyHashfromAddress(propsRef.validator.value.operator_address);
      } else {
        return null;
      }
    });

    const baseDenom = route.params.denom as string;
    const precision = computed(() =>
      store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
        name: baseDenom,
      }),
    );
    const stakingBalance = computed(() => {
      return stakingBalances.value.find((item) => {
        if (item && validatorKeyhash.value) {
          return (
            item.chain_name === propsRef.validator.value.chain_name && item.validator_address == validatorKeyhash.value
          );
        }
      });
    });
    const displayStakingBalance = computed(() => {
      const bn = new BigNumber(stakingBalance.value?.amount ?? 0);
      return bn.dividedBy(10 ** precision.value);
    });
    const remainingStake = computed(() => {
      return new BigNumber(stakingBalance.value?.amount ?? 0).minus(
        new BigNumber(model.value).multipliedBy(10 ** precision.value),
      );
    });
    return {
      displayStakingBalance,
      model,
      baseDenom,
      remainingStake,
    };
  },
});
</script>
