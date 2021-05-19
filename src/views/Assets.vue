<template>
  <AppLayout>
    <div class="home">
      <div class="container">
        <div>Assets</div>
        <AssetsTable :balances="balances" />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import AssetsTable from '@/components/assets/AssetsTable';
import AppLayout from '@/layouts/AppLayout.vue';
import { Balances } from '@/types/api';

export default {
  name: 'Assets',
  components: { AppLayout, AssetsTable },

  setup() {
    // TODO: Get data from API
    const balances: Balances = [
      {
        amount: 10,
        address: 'cosmos1eduu6rk03m7tqthj4weuvwqmwjxmh52wy0nxg3',
        base_denom: 'ATOM',
        on_chain: 'cosmos',
        verified: true,
        ibc: {},
      },
      {
        amount: 50,
        address: 'cosmos1eduu6rk03m7tqthj4weuvwqmwjxmh52wy0nxg3',
        base_denom: 'ATOM',
        on_chain: 'akash',
        verified: true,
        ibc: {},
      },
      {
        amount: 120,
        address: 'cosmos13hvstpm3k9wsa9esf4lvz5fl9svuzjf6vc8vvt',
        base_denom: 'KAVA',
        on_chain: 'kava',
        verified: true,
        ibc: {},
      },
    ];

    return { balances };
  },
};
</script>
