<template>
  <div class="flex w-full justify-center">
    <div class="max-w-7xl mx-auto px-8 w-full flex-1 flex flex-col items-stretch">
      <main class="pb-28 flex-1 flex flex-col items-center justify-center">
        <div class="w-full max-w-lg mx-auto">
          <StakedValidatorAmountInput v-if="validator" v-model="model" :validator="validator" />

          <div class="mt-2 w-full max-w-sm mx-auto">
            <!-- Stake Info -->
            <ListItem inset size="md" label="Time to unstake"> 21 days </ListItem>

            <ListItem inset size="md" label="Total stake remaining">
              <AmountDisplay :amount="{ amount: remainingStake, denom: baseDenom }" />
              <div class="text-muted">
                <Price :amount="{ denom: baseDenom, amount: remainingStake }" :show-zero="true" :show-dash="false" />
              </div>
            </ListItem>

            <!-- Fee -->
            <div class="mt-6 mb-2">
              <FeeLevelSelector :steps="actionSteps" @update:fees="fees = $event" />
            </div>
            <!-- Continue button -->
            <Button :name="$t('generic_cta.continue')" :disabled="!isValid" @click="goToReview" />
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
import { computed, defineComponent, ref, toRefs, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import Price from '@/components/common/Price.vue';
import StakedValidatorAmountInput from '@/components/stake/StakedValidatorAmountInput.vue';
import AmountInput from '@/components/ui/AmountInput.vue';
import Button from '@/components/ui/Button.vue';
import ListItem from '@/components/ui/List/ListItem.vue';
import { GlobalDemerisGetterTypes } from '@/store';
import { Step, UndelegateAction } from '@/types/actions';
import { actionHandler } from '@/utils/actionHandler';

export default defineComponent({
  name: 'StakedValidatorAmount',
  components: {
    AmountInput,
    StakedValidatorAmountInput,
    ListItem,
    AmountDisplay,
    Button,
    Price,
    FeeLevelSelector,
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
  emits: ['previous', 'next', 'update:modelValue'],
  setup(props, { emit }) {
    const route = useRoute();
    const store = useStore();

    const actionSteps = ref<Step[]>([]);
    const propsRef = toRefs(props);
    const fees = ref({});
    const model = computed({
      get: () => propsRef.modelValue.value,
      set: (value) => emit('update:modelValue', value),
    });

    const action = computed(() => {
      return {
        name: 'unstake',
        params: {
          validatorAddress: propsRef.validator.value.operator_address,
          amount: {
            amount: {
              amount: new BigNumber(model.value != '' ? model.value ?? 0 : 0)
                .multipliedBy(10 ** precision.value)
                .toString(),
              denom: baseDenom,
            },
            chain_name: propsRef.validator.value.chain_name,
          },
        },
      } as UndelegateAction;
    });
    watch(
      () => action.value,
      async (action, _) => {
        actionSteps.value = await actionHandler(action);
      },
    );

    const baseDenom = route.params.denom as string;
    const precision = computed(() =>
      store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
        name: baseDenom,
      }),
    );
    const stakingBalance = computed(() => {
      return propsRef.validator.value.stakedAmount;
    });
    const displayStakingBalance = computed(() => {
      const bn = new BigNumber(stakingBalance.value ?? 0);
      return bn.dividedBy(10 ** precision.value);
    });
    const remainingStake = computed(() => {
      return new BigNumber(stakingBalance.value ?? 0)
        .minus(new BigNumber(model.value != '' ? model.value ?? 0 : 0).multipliedBy(10 ** precision.value))
        .toString();
    });
    const isValid = computed(() => {
      return parseFloat(remainingStake.value) >= 0;
    });
    const goToReview = () => {
      emit('next', actionSteps.value);
    };
    return {
      displayStakingBalance,
      model,
      baseDenom,
      fees,
      goToReview,
      remainingStake,
      isValid,
      actionSteps,
    };
  },
});
</script>
