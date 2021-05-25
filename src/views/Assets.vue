<template>
  <AppLayout>
    <div class="flex flex-col space-y-12">
      <div class="flex space-x-12">
        <router-link to="/assets" class="text-xl font-bold focus:outline-none">Assets</router-link>
        <router-link custom to="/assets/chains">
          <span class="text-xl font-bold text-gray-400 focus:outline-none cursor-not-allowed">Chains</span>
        </router-link>
      </div>
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
