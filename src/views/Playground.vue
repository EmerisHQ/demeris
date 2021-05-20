<template>
  <div class="bg-white">
    <div class="p-10 flex flex-col space-y-8 w-72 mx-auto">
      <AssetChainsIndicator :balances="balances" denom="atom" :max-chains-count="4" />
      <AssetChainsIndicator :balances="balances" denom="kava" />
    </div>

    <div class="p-10 flex flex-col space-y-4 w-72 mx-auto">
      <Alert status="error" message="Error" />
      <Alert status="warning" message="Warning" />
      <Alert status="info" message="Info" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import AssetChainsIndicator from '@/components/common/AssetChainsIndicator';
import Alert from '@/components/ui/Alert.vue';
import { Balances } from '@/types/api';

export default defineComponent({
  components: {
    AssetChainsIndicator,
    Alert,
  },
  setup() {
    const balances: Balances = [
      {
        amount: 10,
        base_denom: 'atom',
        on_chain: 'Cosmos',
        address: '',
        verified: true,
        ibc: {},
      },
      {
        amount: 20,
        base_denom: 'atom',
        on_chain: 'Kava',
        address: '',
        verified: true,
        ibc: {},
      },
      {
        amount: 100,
        base_denom: 'atom',
        on_chain: 'Akash',
        address: '',
        verified: true,
        ibc: {},
      },
      {
        amount: 42,
        base_denom: 'atom',
        on_chain: 'Iris',
        address: '',
        verified: true,
        ibc: {},
      },
      {
        amount: 54,
        base_denom: 'atom',
        on_chain: 'BSC',
        address: '',
        verified: true,
        ibc: {},
      },
      {
        amount: 50,
        base_denom: 'kava',
        on_chain: 'Kava',
        address: '',
        verified: true,
        ibc: {},
      },
      {
        amount: 100,
        base_denom: 'kava',
        on_chain: 'Akash',
        address: '',
        verified: true,
        ibc: {},
      },
    ];

    return { balances };
  },
});
</script>
