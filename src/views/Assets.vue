<template>
  <AppLayout>
    <section class="assets">
      <div class="assets__header">
        <h1 class="assets__title">Assets</h1>
      </div>

      <div class="assets__group">
        <AssetsTable :balances="[]" :show-all-assets="true" class="assets__table" @row-click="openAssetPage" />
      </div>
    </section>
  </AppLayout>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';

import AssetsTable from '@/components/assets/AssetsTable';
import AppLayout from '@/layouts/AppLayout.vue';

export default {
  name: 'Assets',
  components: { AppLayout, AssetsTable },

  setup() {
    const router = useRouter();

    const openAssetPage = (asset: Record<string, string>) => {
      router.push({ name: 'Asset', params: { denom: asset.denom } });
    };

    return { openAssetPage };
  },
};
</script>

<style lang="scss" scoped>
.assets {
  display: flex;
  flex-direction: column;
  font-size: 1.6rem;

  &__title {
    font-size: 5.1rem;
    font-weight: 700;
    margin-bottom: 3.2rem;
  }

  &__table {
    margin-top: 2.4rem;
  }
}
</style>
