<template>
  <nav class="flex-1 max-w-7xl md:mx-auto lg:pl-4 xl:px-6 flex items-center text-muted">
    <router-link
      class="h-12 py-3.5 px-2 md:px-3 leading-5 hover:text-text active:opacity-70"
      exact-active-class="text-text font-medium"
      to="/"
    >
      {{ $t('navbar.portfolio') }}
    </router-link>
    <router-link
      class="h-12 py-3.5 px-2 md:px-3 leading-5 hover:text-text active:opacity-70"
      exact-active-class="text-text font-medium"
      to="/assets"
    >
      {{ $t('navbar.assets') }}
    </router-link>
    <router-link
      class="h-12 py-3.5 px-2 md:px-3 leading-5 hover:text-text active:opacity-70"
      exact-active-class="text-text font-medium"
      to="/pools"
    >
      {{ $t('navbar.pools') }}
    </router-link>
    <router-link
      v-if="isAirdropsFeatureRunning"
      class="h-12 py-3.5 px-2 md:px-3 leading-5 hover:text-text active:opacity-70 airdrop-menu-item"
      exact-active-class="text-text font-medium"
      to="/airdrops"
    >
      <div class="flex items-center">
        {{ $t('navbar.airdrops') }}
        <span v-if="airdropsLoading">
          <Icon name="LoadingIcon" :icon-size="0.8" class="ml-2" />
        </span>
        <span v-if="showEligibleAmount" class="ml-2 bg-negative py-1 px-2 rounded-full -text-1 font-medium text-white">
          {{ noOfClaimableAirdrops }}
        </span>
      </div>
    </router-link>
  </nav>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import Icon from '@/components/ui/Icon.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { LoadingState } from '@/types/util';
import { AirdropEligibilityStatus } from '@/utils/airdropEligibility';
import { featureRunning } from '@/utils/FeatureManager';

const route = useRoute();
const isAirdropsFeatureRunning = featureRunning('AIRDROPS_FEATURE');
const typedstore = useStore() as RootStoreTyped;
const airdrops = computed(() => {
  return typedstore.getters[GlobalGetterTypes.API.getAirdrops];
});

const onAirdropsPage = computed(() => {
  return route.fullPath.includes('/airdrop');
});

const airdropsLoading = computed(() => {
  return typedstore.getters[GlobalGetterTypes.API.getAirdropsStatus] === LoadingState.LOADING;
});

const noOfClaimableAirdrops = computed(() => {
  const claimableAirdrops = airdrops.value.filter((item) => item.eligibility === AirdropEligibilityStatus.CLAIMABLE);
  return claimableAirdrops.length;
});

const showEligibleAmount = computed(() => {
  return !onAirdropsPage.value && !airdropsLoading.value && noOfClaimableAirdrops.value > 0;
});
</script>

<style scoped lang="scss">
.router-link-exact-active {
  color: var(--text);
}
</style>
