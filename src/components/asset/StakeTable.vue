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
import BigNumber from 'bignumber.js';
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';

import StakeTableBanner from '@/components/asset/StakeTableBanner.vue';
import StakeTableContents from '@/components/asset/StakeTableContents.vue';
import StakeTableTitle from '@/components/asset/StakeTableTitle.vue';
import AsyncBoundary from '@/components/common/AsyncBoundary.vue';
import useAccount from '@/composables/useAccount';
import useStaking, { StakingRewards } from '@/composables/useStaking';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { event } from '@/utils/analytics';
import { parseCoins } from '@/utils/basic';

const store = useStore() as RootStoreTyped;
const stakingRewardsData = ref<StakingRewards>(null);
const selectedTab = ref<number>(1);
const props = defineProps<{ denom: string }>();
const { getStakingRewardsByBaseDenom } = useStaking();
const { stakingBalancesByChain } = useAccount();
const stakingBalances = computed(() => {
  return stakingBalancesByChain(
    store.getters[GlobalGetterTypes.API.getChainNameByBaseDenom]({ denom: props.denom }),
  ).filter((x) => Math.floor(parseFloat(x.amount)) > 0);
});

const showStakingBanner = computed(() => {
  return stakingBalances.value.length === 0;
});

const isSignedIn = computed(() => {
  return store.getters[GlobalGetterTypes.USER.isSignedIn];
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

//  ignores denoms that are not from native chain
const totalRewardsAmount = computed(() => {
  if (!stakingRewardsData.value?.total) return 0;
  const total = parseCoins(stakingRewardsData.value?.total ?? '0')
    .map((value) => (value.denom !== props.denom ? '0' : value.amount))
    .reduce((prevValue, currentValue) => BigNumber.sum(prevValue, currentValue).toString());
  return parseFloat(total ?? '0');
});

watch(
  () => isSignedIn.value,
  async () => {
    stakingRewardsData.value = await getStakingRewardsByBaseDenom(props.denom);
  },
  { immediate: true },
);
</script>
<style scoped>
* :deep(.tippy-box) {
  background: var(--surface);
  color: var(--text);
}
</style>
