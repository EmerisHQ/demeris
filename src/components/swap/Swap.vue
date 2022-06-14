<template>
  <FeatureRunningConditional name="SWAP_WIDGET_DISABLED">
    <template #deactivated>
      <FeatureRunningConditional name="OSMOSIS_DOWN">
        <SwapOsmosisDown />
      </FeatureRunningConditional>
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

import FeatureRunningConditional from '@/components/common/FeatureRunningConditional.vue';
import LiquiditySwap from '@/components/liquidity/Swap.vue';
import SwapDisabled from '@/components/swap/SwapDisabled.vue';
import SwapOsmosisDown from '@/components/swap/SwapOsmosisDown.vue';
import SwapMultiDex from '@/features/swap/SwapMultiDex.vue';

interface SwapProps {
  nativeAsset?: EmerisAPI.Balance;
  defaultDenom?: string;
}

defineProps<SwapProps>();
</script>
