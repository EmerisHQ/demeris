<template>
  <Price
    :amount="{ denom: denom, amount: totalRewardsAmount + '' }"
    :show-dash="false"
    :label="label"
    :class="{ 'text-muted': totalRewardsAmount <= 0 }"
  />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';

import Price from '@/components/common/Price.vue';
import useStaking, { StakingRewards } from '@/composables/useStaking';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { getSumOfRewards } from '@/utils/basic';
const store = useStore() as RootStoreTyped;
const { getStakingRewardsByBaseDenom } = useStaking();

const props = defineProps<{ denom: string; label: string }>();

const stakingRewardsData = ref<StakingRewards>(null);

const isSignedIn = computed(() => {
  return store.getters[GlobalGetterTypes.USER.isSignedIn];
});

const totalRewardsAmount = computed(() => {
  return getSumOfRewards(stakingRewardsData.value?.total, props.denom);
});

watch(
  () => isSignedIn.value,
  async () => {
    stakingRewardsData.value = await getStakingRewardsByBaseDenom(props.denom);
  },
  { immediate: true },
);
</script>

<style scoped></style>
