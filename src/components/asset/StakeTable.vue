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
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, toRefs } from 'vue';

import StakeTableContents from '@/components/asset/StakeTableContents.vue';
import StakeTableTitle from '@/components/asset/StakeTableTitle.vue';
import AsyncBoundary from '@/components/common/AsyncBoundary.vue';
import useChains from '@/composables/useChains';
import useStaking from '@/composables/useStaking';
import { event } from '@/utils/analytics';

const selectedTab = ref<number>(1);

const props = defineProps<{ denom: string }>();
const propsRef = toRefs(props);

const { getChainNameByBaseDenom } = useChains();

let chainName = ref<string>(null);

onMounted(async () => {
  chainName.value = await getChainNameByBaseDenom(propsRef.denom.value);
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
