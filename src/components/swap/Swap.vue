<template>
  <FeatureRunningConditional name="SWAP_WIDGET_DISABLED">
    <template #deactivated>
      <FeatureRunningConditional name="DEX_AGG">
        <template #deactivated>
          <LiquiditySwap :default-asset="nativeAsset" />
        </template>
        <SwapMultiDex :default-denom="defaultDenom" />
      </FeatureRunningConditional>
    </template>
    <SwapDisabled />
  </FeatureRunningConditional>
</template>

<script setup lang="ts">
import { EmerisAPI } from '@emeris/types';
import { defineProps } from 'vue';

import FeatureRunningConditional from '@/components/common/FeatureRunningConditional.vue';
import LiquiditySwap from '@/components/liquidity/Swap.vue';
import SwapDisabled from '@/components/swap/SwapDisabled.vue';
import SwapMultiDex from '@/features/swap/SwapMultiDex.vue';

interface SwapProps {
  nativeAsset?: EmerisAPI.Balance;
  defaultDenom?: string;
}

defineProps<SwapProps>();
</script>
