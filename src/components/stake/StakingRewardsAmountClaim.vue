<template>
  <div class="flex items-center justify-end gap-x-4">
    <Price
      :amount="{ denom: denom, amount: `${totalRewardsAmount}` }"
      :show-dash="false"
      :label="label"
      :class="{ 'text-muted': totalRewardsAmount <= 0 }"
    />
    <Button variant="primary" size="sm" :disabled="totalRewardsAmount <= 0">
      {{ $t('components.stakeTable.claim') }}
    </Button>
  </div>
</template>

<script lang="ts" setup>
import Price from '@/components/common/Price.vue';
import Button from '@/components/ui/Button.vue';
import useStaking from '@/composables/useStaking';

const props = defineProps<{ denom: string; label: string }>();

const { getTotalRewardsAmount } = useStaking();
const totalRewardsAmount = getTotalRewardsAmount(props.denom);
</script>
