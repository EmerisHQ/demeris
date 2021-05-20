<template>
  <div class="bg-white">
    <div class="p-10 flex flex-col space-y-8 w-72 mx-auto">
      <AssetChainsIndicator :balances="balances" denom="atom" :max-chains-count="4" />
      <AssetChainsIndicator :balances="balances" denom="kava" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import AssetChainsIndicator from '@/components/assets/AssetChainsIndicator';
import { Balances } from '@/types/api';

import balancesFixture from '../../tests/fixtures/balances.json';

export default defineComponent({
  components: {
    AssetChainsIndicator,
  },
  setup() {
    const balances: Balances = balancesFixture;

    return { balances };
  },
});
</script>
