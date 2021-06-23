<template>
  <AppLayout>
    <section class="assets">
      <nav class="assets__nav">
        <router-link to="/assets" class="assets__nav__item" :class="{ 'assets__nav__item--inactive': isChainsTab }">
          Assets
        </router-link>
        <router-link
          to="/assets/chains"
          class="assets__nav__item"
          :class="{ 'assets__nav__item--inactive': !isChainsTab }"
        >
          Chains
        </router-link>
      </nav>
      <div
        v-for="(balances, chain) in aggregatedBalances"
        :key="chain"
        class="assets__group"
        :class="{ 'assets__group--all': chain === 'all' }"
      >
        <h2 v-if="chain !== 'all'" class="assets__group__title w-bold"><ChainName :name="chain"> assets</ChainName></h2>
        <AssetsTable :balances="balances" class="assets__table" @row-click="openAssetPage" />
      </div>
    </section>
  </AppLayout>
</template>

<script lang="ts">
import { computed } from '@vue/runtime-core';
import groupBy from 'lodash.groupby';
import { useRoute, useRouter } from 'vue-router';

import AssetsTable from '@/components/assets/AssetsTable';
import ChainName from '@/components/common/ChainName.vue';
import useAccount from '@/composables/useAccount';
import AppLayout from '@/layouts/AppLayout.vue';

export default {
  name: 'Assets',
  components: { AppLayout, AssetsTable, ChainName },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const { balances } = useAccount();

    const isChainsTab = computed(() => {
      return route.params.tab === 'chains';
    });

    const aggregatedBalances = computed(() => {
      if (isChainsTab.value) {
        return groupBy(balances.value, 'on_chain');
      }

      return { all: balances.value };
    });

    const openAssetPage = (asset: Record<string, string>) => {
      router.push({ name: 'Asset', params: { denom: asset.denom } });
    };

    return { aggregatedBalances, isChainsTab, openAssetPage };
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
      font-weight: 700;
      margin-right: 2.4rem;

      &--inactive {
        color: var(--inactive);
      }
    }
  }

  &__table {
    margin-top: 2.4rem;
  }

  &__group {
    &:not(&--all) {
      margin-top: 4rem;
    }
  }
}
</style>
