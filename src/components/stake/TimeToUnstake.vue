<template>{{ daysToUnstake }} days</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue';
import { useStore } from 'vuex';

import { GlobalDemerisActionTypes, TypedAPIStore } from '@/store';
import { featureRunning } from '@/utils/FeatureManager';

const store = useStore();
const apistore = store as TypedAPIStore;

interface Props {
  chainName: string;
}
const props = withDefaults(defineProps<Props>(), {
  chainName: '',
});
const { chainName } = toRefs(props);
const daysToUnstake = ref<number>(21);

async function getTimeToUnstake() {
  const days = await apistore.dispatch(GlobalDemerisActionTypes.API.GET_UNSTAKING_PERIOD, {
    chain_name: chainName.value,
    //   refreshTime: 5000,
  });
  console.log('days', days);
}

console.log(process.env);

if (featureRunning('TIME_TO_UNSTAKE_FROM_API') || !chainName.value) {
  // console.log('unbonding',  `https://dev.demeris.io/v1/chain/${chainName.value}/staking/params`)
  getTimeToUnstake();
  daysToUnstake.value = 18;
}
</script>

<style></style>
