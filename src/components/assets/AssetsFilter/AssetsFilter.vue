<template>
  <!-- Assets filter portfolio area -->
  <div class="flex items-center gap-x-3">
    <Button
      size="sm"
      :variant="activeFilter === 'all' ? 'primary' : 'secondary'"
      :shadow="false"
      :full-width="false"
      capitalize
      rounded
      :name="`${$t('components.assetsFilter.allAssets')} (${props.assetsLength})`"
      :click-function="() => (activeFilter = 'all')"
    />
    <Button
      size="sm"
      :variant="activeFilter === 'staking' ? 'primary' : 'secondary'"
      :shadow="false"
      :full-width="false"
      capitalize
      rounded
      :name="`${$t('components.assetsFilter.staking')} (${props.assetsStakingLength})`"
      :click-function="() => (activeFilter = 'staking')"
    />
    <router-link class="ml-auto font-medium" :to="{ name: 'Stake Asset' }">
      {{ $t('components.assetsFilter.stakeAsset') }} &rarr;
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import Button from '@/components/ui/Button.vue';

const activeFilter = ref('all');

interface Props {
  assetsLength?: number;
  assetsStakingLength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  assetsLength: 0,
  assetsStakingLength: 0,
});
</script>
