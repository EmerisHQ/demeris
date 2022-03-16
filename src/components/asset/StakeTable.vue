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
<script lang="tsx" setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';

import StakeTableContents from '@/components/asset/StakeTableContents.vue';
import StakeTableTitle from '@/components/asset/StakeTableTitle.vue';
import AsyncBoundary from '@/components/common/AsyncBoundary.vue';
import useStaking, { StakingRewards } from '@/composables/useStaking';
import { GlobalDemerisGetterTypes } from '@/store';

const store = useStore();
const stakingRewardsData = ref<StakingRewards>(null);
const selectedTab = ref<number>(1);
const props = defineProps<{ denom: string }>();
const { getStakingRewardsByBaseDenom } = useStaking();

const isSignedIn = computed(() => {
  return store.getters[GlobalDemerisGetterTypes.USER.isSignedIn];
});

const selectTab = (tabNumber?: number): void => {
  selectedTab.value = tabNumber;
};

const totalRewardsAmount = computed(() => {
  return parseFloat(stakingRewardsData.value?.total ?? '0');
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
* >>> .tippy-box {
  background: var(--surface);
  color: var(--text);
}
</style>
