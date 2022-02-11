<template>
  <div>
    <UnstakeFormAmountInput v-if="validator" v-model="form.amount" :validator="validator" />
    <List>
      <ListItem inset size="md" label="Time to unstake"> 21 days </ListItem>

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
    </List>
    <!-- Fee -->
    <div class="mt-6 mb-2">
      <FeeLevelSelector :steps="steps" @update:fees="fees = $event" />
    </div>
    <!-- Continue button -->
    <Button :name="$t('generic_cta.continue')" :disabled="!isValid" @click="goToReview" />
  </div>
</template>
<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, inject, onMounted, PropType, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import Price from '@/components/common/Price.vue';
import Button from '@/components/ui/Button.vue';
import List from '@/components/ui/List/List.vue';
import ListItem from '@/components/ui/List/ListItem.vue';
import useStaking from '@/composables/useStaking';
import { GlobalDemerisGetterTypes } from '@/store';
import { Step, UndelegateForm } from '@/types/actions';

import UnstakeFormAmountInput from './UnstakeFormAmountInput.vue';

export default defineComponent({
  name: 'UnstakeFormAmount',
  components: {
    UnstakeFormAmountInput,
    ListItem,
    AmountDisplay,
    Button,
    Price,
    FeeLevelSelector,
    List,
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
    const route = useRoute();
    const store = useStore();

    const form = inject<UndelegateForm>('unstakeForm');
    const { getStakingRewardsByBaseDenom } = useStaking();
    const propsRef = toRefs(props);
    const fees = ref({});
    const stakingRewardsData = ref(null);
    const baseDenom = route.params.denom as string;
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
