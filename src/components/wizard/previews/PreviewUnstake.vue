<template>
  <List>
    <!-- Pay/Receive -->

    <ListItem direction="col">
      <ListItem v-if="tx" size="sm" :label="$t('components.previews.unstake.unstakeLbl')">
        <div class="flex justify-end items-center">
          <div class="text-right">
            <AmountDisplay
              class="font-medium"
              :class="context === 'widget' ? 'text-0' : 'text-1'"
              :amount="{ amount: unStaked, denom: baseDenom }"
            />
            <div class="block text-muted -text-1" :class="{ 'mt-0.5': context !== 'widget' }">
              <Price :amount="{ amount: unStaked, denom: baseDenom }" />
            </div>
          </div>
          <CircleSymbol :denom="baseDenom" :chain-name="chainName" size="md" class="ml-3" />
        </div>
      </ListItem>
      <ListItem v-if="tx" size="sm" :label="$t('components.previews.unstake.claimLbl')" class="text-muted">
        <AmountDisplay class="font-medium" :amount="{ amount: stakingRewards, denom: baseDenom }" />
      </ListItem>
    </ListItem>

    <!-- Price  -->
    <ListItem v-if="tx && validator?.moniker" size="sm" :label="$t('components.previews.unstake.fromLbl')">
      <div class="flex justify-end items-center">
        {{ validator.moniker }}
        <ValidatorBadge :validator="validator" class="ml-3" />
      </div>
    </ListItem>

    <ListItem direction="col">
      <ListItem size="sm" label="Time to unstake">
        <DaysToUnstake :chain-name="chainName" />
      </ListItem>
      <ListItem size="sm" :label="$t('components.previews.unstake.availLbl')" class="text-normal text-muted">
        {{ availableAt }}
      </ListItem>
    </ListItem>
    <!-- Fee -->
    <ListItem
      size="sm"
      :label="$t('components.previews.unstake.feeLbl')"
      :hint="$t('components.previews.unstake.feeLblHint')"
    >
      <template v-for="(fee, chain) in fees" :key="'fee_' + chain">
        <template v-for="(feeAmount, denom) in fee" :key="'fee' + chain + denom">
          <AmountDisplay :amount="{ amount: feeAmount.toString(), denom }" />
        </template>
      </template>
    </ListItem>
  </List>
</template>
<script setup lang="ts">
import { EmerisBase } from '@emeris/types';
import { computed, onMounted, ref, toRefs } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Price from '@/components/common/Price.vue';
import ValidatorBadge from '@/components/common/ValidatorBadge.vue';
import DaysToUnstake from '@/components/stake/DaysToUnstake.vue';
import { List, ListItem } from '@/components/ui/List';
import useStaking from '@/composables/useStaking';
import * as Actions from '@/types/actions';

interface Props {
  step: Actions.Step;
  fees: Record<string, EmerisBase.Amount>;
  context?: 'default' | 'widget';
  isReceipt?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  context: 'default',
  isReceipt: false,
});

const { getValidatorsByBaseDenom, getStakingRewardsByBaseDenom } = useStaking();

const propsRef = toRefs(props);
const validators = ref([]);
const tx = propsRef.step.value.transactions[0];
const baseDenom = (tx.data as Actions.UnstakeData).amount.denom;
const chainName = (tx.data as Actions.UnstakeData).chainName;

const stakingRewardsData = ref(null);
const unStaked = (tx.data as Actions.UnstakeData).amount.amount;

onMounted(async () => {
  try {
    stakingRewardsData.value = await getStakingRewardsByBaseDenom(baseDenom);
  } catch (e) {}
  validators.value = await getValidatorsByBaseDenom(baseDenom);
});

const validator = computed(() => {
  return validators.value.find((x) => x.operator_address == (tx.data as Actions.UnstakeData).validatorAddress);
});
const stakingRewards = computed(() => {
  if (stakingRewardsData.value !== null && stakingRewardsData.value.total) {
    return parseFloat(
      stakingRewardsData.value.rewards.find(
        (x) => x.validator_address === (tx.data as Actions.UnstakeData).validatorAddress,
      )?.reward ?? '0',
    ).toString();
  } else {
    return '0';
  }
});

const availableAtTime = new Date();
availableAtTime.setDate(availableAtTime.getDate() + 21);
const availableAt = availableAtTime.toLocaleString();
</script>
