<template>
  <AppLayout>
    <header class="pb-3 sm:pb-6 md:pb-6">
      <h1 class="text-2 sm:text-3 md:text-4 font-bold">Pools</h1>
    </header>

    <PoolsTable :pools="pools" />
  </AppLayout>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';

import PoolsTable from '@/components/liquidity/PoolsTable.vue';
import usePools from '@/composables/usePools';
import AppLayout from '@/layouts/AppLayout.vue';
import { pageview } from '@/utils/analytics';

export default {
  name: 'Pools',
  components: { AppLayout, PoolsTable },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    pageview({ page_title: 'Pools', page_path: '/pools' });
    useMeta(
      computed(() => ({
        title: t('context.pools.title'),
      })),
    );

    const { pools } = usePools();
    return {
      pools,
    };
  },
};
</script>

<style lang="scss" scoped></style>
