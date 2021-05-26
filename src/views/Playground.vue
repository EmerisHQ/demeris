<template>
  <div class="bg-white">
    <div class="p-10 flex flex-col space-y-8 w-1/2 mx-auto">
      <AssetChainsIndicator :balances="balances" denom="atom" :max-chains-count="4" />
      <AssetChainsIndicator :balances="balances" denom="kava" />
    </div>

    <div class="p-10 flex flex-col space-y-8 w-1/5 mx-auto">
      <Alert status="error" message="Error" />
      <Alert status="warning" message="Warning" />
      <Alert status="info" message="Info" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import AssetChainsIndicator from '@/components/assets/AssetChainsIndicator';
import Alert from '@/components/ui/Alert.vue';
import { Balances } from '@/types/api';

import balancesFixture from '../../tests/fixtures/balances.json';

export default defineComponent({
  components: {
    AssetChainsIndicator,
    Alert,
  },
  setup() {
    const balances: Balances = balancesFixture;

    return { balances };
  },
});
</script>
