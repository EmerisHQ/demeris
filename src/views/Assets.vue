<template>
  <AppLayout>
    <section class="assets">
      <nav class="assets__nav">
        <router-link to="/assets" class="assets__nav__item">Assets</router-link>
        <router-link to="/assets/chains" custom>
          <span class="assets__nav__item assets__nav__item--inactive">Chains</span>
        </router-link>
      </nav>
      <AssetsTable :balances="balances" class="assets__table" @row-click="openAssetPage" />
    </section>
  </AppLayout>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';

import AssetsTable from '@/components/assets/AssetsTable';
import useAccount from '@/composables/useAccount';
import AppLayout from '@/layouts/AppLayout.vue';

export default {
  name: 'Assets',
  components: { AppLayout, AssetsTable },

  setup() {
    const router = useRouter();
    const { balances } = useAccount();

    const openAssetPage = (asset: Record<string, string>) => {
      router.push({ name: 'Asset', params: { denom: asset.denom } });
    };

    return { balances, openAssetPage };
  },
};
</script>

<style lang="scss" scoped>
.assets {
  display: flex;
  flex-direction: column;
  font-size: 1.6rem;

  &__nav {
    display: flex;

    &__item {
      font-size: 2.8rem;
      font-weight: 600;
      margin-right: 2.4rem;

      &--inactive {
        color: rgba(0, 0, 0, 0.33);
        cursor: not-allowed;
      }
    }
  }

  &__table {
    margin-top: 2.4rem;
  }
}
</style>
