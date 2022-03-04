<template>
  <main class="pb-28 flex-1 flex flex-col items-center justify-center">
    <div class="w-full max-w-lg mx-auto">
      <UnstakeFormAmountInput v-if="validator" v-model="form.amount" :validator="validator" />
    </div>

    <div class="mt-2 w-full max-w-sm mx-auto">
      <ListItem inset size="md" label="Time to unstake">
        <TimeToUnstake :chain-name="chainName" />
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
<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, inject, onMounted, PropType, ref, toRefs } from 'vue';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import Price from '@/components/common/Price.vue';
import TimeToUnstake from '@/components/stake/TimeToUnstake.vue';
import Button from '@/components/ui/Button.vue';
import ListItem from '@/components/ui/List/ListItem.vue';
import useStaking from '@/composables/useStaking';
import { GlobalDemerisGetterTypes } from '@/store';
import { ChainData } from '@/store/demeris-api/state';
import { Step, UnstakeForm } from '@/types/actions';

import UnstakeFormAmountInput from './UnstakeFormAmountInput.vue';

export default defineComponent({
  name: 'UnstakeFormAmount',
  components: {
    UnstakeFormAmountInput,
    ListItem,
    TimeToUnstake,
    AmountDisplay,
    Button,
    Price,
    FeeLevelSelector,
  },
  props: {
    validator: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    steps: {
      type: Array as PropType<Step[]>,
      default: () => [],
    },
  },
  emits: ['next'],
  setup(props, { emit }) {
    const store = useStore();

    const form = inject<UnstakeForm>('unstakeForm');
    const { getStakingRewardsByBaseDenom } = useStaking();
    const propsRef = toRefs(props);
    const fees = ref({});
    const stakingRewardsData = ref(null);
    const chain = computed(() => {
      return store.getters[GlobalDemerisGetterTypes.API.getChain]({ chain_name: propsRef.validator.value.chain_name });
    });
    const chainName = ref<string>(propsRef.validator.value.chain_name);
    const baseDenom = (chain.value as ChainData)?.denoms.find((x) => x.stakable).name;
    const precision = computed(() =>
      store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
        name: baseDenom,
      }),
    );

    const stakingRewards = computed(() => {
      if (stakingRewardsData.value !== null) {
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
    const displayStakingBalance = computed(() => {
      const bn = new BigNumber(stakingBalance.value ?? 0);
      return bn.dividedBy(10 ** precision.value);
    });
    const remainingStake = computed(() => {
      return new BigNumber(stakingBalance.value ?? 0)
        .minus(new BigNumber(form.amount != '' ? form.amount ?? 0 : 0).multipliedBy(10 ** precision.value))
        .toString();
    });
    const isValid = computed(() => {
      return parseFloat(remainingStake.value) >= 0;
    });
    const goToReview = () => {
      emit('next');
    };
    onMounted(async () => {
      stakingRewardsData.value = await getStakingRewardsByBaseDenom(baseDenom);
    });
    return {
      chainName,
      displayStakingBalance,
      baseDenom,
      fees,
      goToReview,
      remainingStake,
      isValid,
      stakingRewards,
      form,
    };
  },
});
</script>
