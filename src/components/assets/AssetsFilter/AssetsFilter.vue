<template>
  <!-- Assets filter portfolio area -->
  <div class="assets-filters flex items-center gap-x-3">
    <Button
      size="sm"
      :variant="activeFilter === 'all' ? 'primary' : 'secondary'"
      :shadow="false"
      :full-width="false"
      capitalize
      rounded
      :name="`${$t('components.assetsFilter.allAssets')} (${props.assetsLength})`"
      :click-function="() => setActiveFilter('all')"
    />
    <Button
      size="sm"
      :variant="activeFilter === 'staking' ? 'primary' : 'secondary'"
      :shadow="false"
      :full-width="false"
      capitalize
      rounded
      :name="`${$t('components.assetsFilter.staking')} (${props.assetsStakingLength})`"
      :click-function="() => setActiveFilter('staking')"
    />
    <router-link class="ml-auto font-medium" :to="{ name: 'Stake Asset' }">
      {{ $t('components.assetsFilter.stakeAsset') }} &rarr;
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import Button from '@/components/ui/Button.vue';

interface Props {
  assetsLength?: number;
  assetsStakingLength?: number;
  assetFilterSelected?: string;
}

const props = withDefaults(defineProps<Props>(), {
  assetsLength: 0,
  assetsStakingLength: 0,
  assetFilterSelected: 'all',
});

const emit = defineEmits(['activeFilter']);

const activeFilter = computed(() => props.assetFilterSelected);

const setActiveFilter = (newActiveFilter: string): void => {
  emit('activeFilter', newActiveFilter);
};
</script>

<style lang="scss" scoped>
.assets-filters {
  :deep(.button-secondary) {
    @apply bg-fg-solid;
  }
}
</style>
