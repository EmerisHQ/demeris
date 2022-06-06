<template>
  <AppLayout>
    <header class="pb-3 sm:pb-6 md:pb-6">
      <h1 class="text-2 sm:text-3 md:text-4 font-bold">{{ $t('pages.assets.assets') }}</h1>
    </header>

    <AssetsTable :balances="[]" :show-all-assets="true" :hide-lp-assets="true" @row-click="openAssetPage" />
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';

import AssetsTable from '@/components/assets/AssetsTable';
import AppLayout from '@/layouts/AppLayout.vue';
import { pageview } from '@/utils/analytics';

const { t } = useI18n({ useScope: 'global' });

useMeta(
  computed(() => ({
    title: t('context.assets.title'),
  })),
);

const router = useRouter();
pageview({ page_title: 'Assets', page_path: '/assets' });
const openAssetPage = (asset: Record<string, string>) => {
  router.push({ name: 'Asset', params: { denom: asset.denom } });
};
</script>

<style lang="scss" scoped></style>
