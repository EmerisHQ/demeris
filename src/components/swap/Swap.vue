<template>
  <FeatureRunningConditional name="SWAP_WIDGET_DISABLED">
    <template #deactivated>
      <FeatureRunningConditional name="DEX_AGG">
        <template #deactivated>
          <LiquiditySwap :default-asset="nativeAsset" />
        </template>
        <DexSwap :default-asset="nativeAsset" />
      </FeatureRunningConditional>
    </template>
    <SwapDisabled />
  </FeatureRunningConditional>
</template>

<script setup lang="ts">
import { EmerisAPI } from '@emeris/types';
import { defineProps, toRefs } from 'vue';

import FeatureRunningConditional from '@/components/common/FeatureRunningConditional.vue';
import LiquiditySwap from '@/components/liquidity/Swap.vue';
import DexSwap from '@/components/swap/DexSwap.vue';
import SwapDisabled from '@/components/swap/SwapDisabled.vue';

interface SwapProps {
  nativeAsset?: EmerisAPI.Balance;
}
const props = defineProps<SwapProps>();
const { nativeAsset } = toRefs(props);
</script>
