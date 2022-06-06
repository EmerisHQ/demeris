<template>
  <main class="pb-28 flex-1 flex flex-col items-center justify-center">
    <div class="w-full max-w-lg mx-auto">
      <UnstakeFormAmountInput v-if="validator" v-model="form.amount" :validator="validator" />
    </div>

    <div class="mt-2 w-full max-w-sm mx-auto">
      <ListItem inset size="md" label="Time to unstake">
        <DaysToUnstake :chain-name="chainName" />
      </ListItem>

      <ListItem inset size="md" label="Total stake remaining">
        <AmountDisplay :amount="{ amount: remainingStake, denom: baseDenom }" />
        <div class="text-muted">
          <Price :amount="{ denom: form.denom, amount: remainingStake }" :show-zero="true" :show-dash="false" />
        </div>
      </ListItem>
      <ListItem inset size="md" label="Claiming rewards">
        <AmountDisplay :amount="{ amount: stakingRewards, denom: form.denom }" />
        <div class="text-muted">
          <Price :amount="{ denom: form.denom, amount: stakingRewards }" :show-zero="true" :show-dash="false" />
        </div>
      </ListItem>
      <div class="mt-6 mb-2">
        <FeeLevelSelector :steps="steps" @update:fees="fees = $event" />
      </div>
      <!-- Continue button -->
      <Button :name="$t('generic_cta.continue')" :disabled="!isValid" @click="goToReview" />
    </div>
  </main>
</template>
<script setup lang="ts">
import { EmerisAPI } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { computed, inject, onMounted, ref, toRefs } from 'vue';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import Price from '@/components/common/Price.vue';
import DaysToUnstake from '@/components/stake/DaysToUnstake.vue';
import Button from '@/components/ui/Button.vue';
import ListItem from '@/components/ui/List/ListItem.vue';
import useStaking from '@/composables/useStaking';
import { GlobalGetterTypes } from '@/store';
import { Step, UnstakeForm } from '@/types/actions';

import UnstakeFormAmountInput from './UnstakeFormAmountInput.vue';

interface Props {
  validator: EmerisAPI.Validator;
  steps?: Step[];
}

const props = withDefaults(defineProps<Props>(), {
  steps: () => [],
});

const emit = defineEmits<{
  (e: 'next'): void;
}>();

const store = useStore();

const form = inject<UnstakeForm>('unstakeForm');
const { getStakingRewardsByBaseDenom } = useStaking();
const propsRef = toRefs(props);
const fees = ref({});
const stakingRewardsData = ref(null);
const chain = computed(() => {
  return store.getters[GlobalGetterTypes.API.getChain]({ chain_name: propsRef.validator.value.chain_name });
});
const chainName = ref<string>(propsRef.validator.value.chain_name);
const baseDenom = chain.value?.denoms.find((x) => x.stakable).name;
const precision = computed(() =>
  store.getters[GlobalGetterTypes.API.getDenomPrecision]({
    name: baseDenom,
  }),
);

const stakingRewards = computed(() => {
  if (stakingRewardsData.value?.rewards) {
    return parseFloat(
      stakingRewardsData.value.rewards.find((x) => x.validator_address == propsRef.validator.value.operator_address)
        ?.reward ?? '0',
    ).toString();
  } else {
    return '0';
  }
});
const stakingBalance = computed(() => {
  return propsRef.validator.value.stakedAmount;
});
const remainingStake = computed(() => {
  return new BigNumber(stakingBalance.value ?? 0)
    .minus(new BigNumber(form.amount != '' ? form.amount ?? 0 : 0).multipliedBy(10 ** precision.value))
    .toString();
});
const isValid = computed(() => {
  return parseFloat(remainingStake.value) >= 0 && parseFloat(form.amount) > 0;
});
const goToReview = () => {
  emit('next');
};
onMounted(async () => {
  stakingRewardsData.value = await getStakingRewardsByBaseDenom(baseDenom);
});
</script>
