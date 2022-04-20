<template>
  <div class="flex items-center justify-end gap-x-4">
    <Price
      :amount="{ denom: props.denom, amount: `${totalRewardsAmount}` }"
      :show-dash="false"
      :label="props.label"
      :class="{ 'text-muted': totalRewardsAmount <= 0 }"
    />
    <Button
      v-if="props.hasButton"
      variant="primary"
      size="sm"
      :disabled="totalRewardsAmount <= 0"
      :name="$t('components.stakeTable.claim')"
      :click-function="() => $router.push(`/staking/${props.denom}/${StakingActions.CLAIM}`)"
      class="pl-4"
    />
  </div>
</template>

<script lang="ts" setup>
import Price from '@/components/common/Price.vue';
import Button from '@/components/ui/Button.vue';
import useStaking from '@/composables/useStaking';
import { StakingActions } from '@/types/actions';

interface Props {
  denom: string;
  label: string;
  hasButton: boolean;
  buttonAction: any;
}

const props = withDefaults(defineProps<Props>(), {
  denom: '',
  label: '',
  hasButton: false,
});

const { getTotalRewardsAmount } = useStaking();
const totalRewardsAmount = getTotalRewardsAmount(props.denom);
</script>
