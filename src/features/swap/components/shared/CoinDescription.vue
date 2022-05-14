<template>
  <div class="flex items-center space-x-4 text-right">
    <div>
      <AmountDisplay :amount="{ amount, denom }" :chain="chain" class="font-medium text-0" trunc-big-balance />
      <div class="text-muted -text-1">
        <ChainName :name="chain" />
      </div>
    </div>
    <CircleSymbol :display-status="false" size="sm" :denom="denom" />
  </div>
</template>

<script lang="ts" setup>
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';

interface Props {
  amount: string;
  denom: string;
  chain: string;
}

defineProps<Props>();
</script>
