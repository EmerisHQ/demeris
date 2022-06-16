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
import { computed, onMounted, ref, toRefs } from 'vue';

import StakeTableBanner from '@/components/asset/StakeTableBanner.vue';
import StakeTableContents from '@/components/asset/StakeTableContents.vue';
import StakeTableTitle from '@/components/asset/StakeTableTitle.vue';
import AsyncBoundary from '@/components/common/AsyncBoundary.vue';
import useAccount from '@/composables/useAccount';
import useChains from '@/composables/useChains';
import useStaking from '@/composables/useStaking';
import { event } from '@/utils/analytics';

const selectedTab = ref<number>(1);

const props = defineProps<{ denom: string }>();
const propsRef = toRefs(props);

const { stakingBalancesByChain } = useAccount();
const { getChainNameByBaseDenom } = useChains();

const chainName = ref<string>(null);

onMounted(async () => {
  chainName.value = await getChainNameByBaseDenom(propsRef.denom.value);
});

const stakingBalances = computed(() => {
  return stakingBalancesByChain(chainName.value).filter((x) => Math.floor(parseFloat(x.amount)) > 0);
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
