<template>
  <AppLayout>
    <div>
      <h1 class="text-3xl font-bold my-8">Assets</h1>
      <AssetsTable :balances="balances" />
    </div>
  </AppLayout>
</template>

<script lang="ts">
import AssetsTable from '@/components/assets/AssetsTable';
import AppLayout from '@/layouts/AppLayout.vue';
import { Balances } from '@/types/api';

import balancesFixture from '../../tests/fixtures/balances.json';

export default {
  name: 'Assets',
  components: { AppLayout, AssetsTable },

  setup() {
    // TODO: Get data from API
    const balances: Balances = balancesFixture;

    return { balances };
  },
};
</script>
