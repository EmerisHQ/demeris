<template>
  <StakingBanner
    :display-denom="!isDemoAccount ? asset.name : undefined"
    :base-denom="!isDemoAccount ? asset.denom : undefined"
  />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';

import StakingBanner from '@/components/banners/StakingBanner.vue';
import useAccount from '@/composables/useAccount';
import useBalances from '@/composables/useBalances';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';

const store = useStore() as RootStoreTyped;
const { nativeBalances } = useAccount();

const asset = ref<{ name: string; denom: string }>({ name: '', denom: '' });

const isDemoAccount = computed(() => store.getters[GlobalGetterTypes.USER.isDemoAccount]);
const { mostAvailableBalance } = useBalances();
watch(
  mostAvailableBalance,
  (newValue) => {
    if (!newValue) return;
    const nativeAsset = nativeBalances.value.find((item) => item.base_denom === newValue.denom);
    asset.value.name = nativeAsset?.displayName;
    asset.value.denom = newValue.denom;
  },
  { immediate: true },
);
</script>
