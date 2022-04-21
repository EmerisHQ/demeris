<template>
  <div>
    <StakeTableTitle
      :selected-tab="selectedTab"
      :denom="props.denom"
      :total-rewards-amount="totalRewardsAmount"
      @select-tab="selectTab"
    />
    <AsyncBoundary width="100%" height="300px">
      <StakeTableContents :selected-tab="selectedTab" :denom="props.denom" :total-rewards-amount="totalRewardsAmount" />
    </AsyncBoundary>
    <StakeTableBanner v-if="showStakingBanner" :denom="props.denom" />
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import StakeTableBanner from '@/components/asset/StakeTableBanner.vue';
import StakeTableContents from '@/components/asset/StakeTableContents.vue';
import StakeTableTitle from '@/components/asset/StakeTableTitle.vue';
import AsyncBoundary from '@/components/common/AsyncBoundary.vue';
import useAccount from '@/composables/useAccount';
import useStaking from '@/composables/useStaking';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { event } from '@/utils/analytics';

const store = useStore() as RootStoreTyped;
const selectedTab = ref<number>(1);
const props = defineProps<{ denom: string }>();
const { stakingBalancesByChain } = useAccount();
const stakingBalances = computed(() => {
  return stakingBalancesByChain(
    store.getters[GlobalGetterTypes.API.getChainNameByBaseDenom]({ denom: props.denom }),
  ).filter((x) => Math.floor(parseFloat(x.amount)) > 0);
});

const showStakingBanner = computed(() => {
  return stakingBalances.value.length === 0;
});

const selectTab = (tabNumber?: number): void => {
  if (tabNumber === 2) {
    // Unstaking tab clicked
    event('unstaking_tab_select', {
      event_label: 'Asset Page Staking Table Unstake Tab Click',
      event_category: 'click',
    });
  }
  selectedTab.value = tabNumber;
};

const { getTotalRewardsAmount } = useStaking();
const totalRewardsAmount = getTotalRewardsAmount(props.denom);
</script>
<style scoped>
* :deep(.tippy-box) {
  background: var(--surface);
  color: var(--text);
}
</style>
