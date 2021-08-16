<template>
  <AppLayout>
    <header class="pb-3 sm:pb-6 md:pb-6">
      <h1 class="text-2 sm:text-3 md:text-4 font-bold">Assets</h1>
    </header>

    <AssetsTable :balances="[]" :show-all-assets="true" :hide-lp-assets="true" @row-click="openAssetPage" />
  </AppLayout>
</template>

<script lang="ts">
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';

import AssetsTable from '@/components/assets/AssetsTable';
import AppLayout from '@/layouts/AppLayout.vue';

export default {
  name: 'Assets',
  components: { AppLayout, AssetsTable },

  setup() {
    useMeta({ title: 'Assets' });
    const router = useRouter();

    const openAssetPage = (asset: Record<string, string>) => {
      router.push({ name: 'Asset', params: { denom: asset.denom } });
    };

    return { openAssetPage };
  },
};
</script>

<style lang="scss" scoped></style>
