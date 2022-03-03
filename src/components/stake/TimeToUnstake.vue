<template>
  <span v-if="!isResponseError">
    <span v-if="!isLoading">
      {{ daysToUnstake }}
      {{ daysToUnstake >= 1 ? $t('components.timeToUnstake.daySingular') : $t('components.timeToUnstake.dayPlural') }}
    </span>
    <span v-if="isLoading"><SkeletonLoader width="4rem" height="1rem" /></span>
  </span>
  <span v-if="isResponseError" class="flex justify-end w-full">
    <Button
      size="sm"
      variant="link"
      class="text-negative"
      :name="$t('components.timeToUnstake.errorButton')"
      @click="getTimeToUnstake()"
    />
  </span>
</template>

<script lang="ts" setup>
// TODO:
// - what is the correct response when the API fails? Fallback to 21 days? Show error message?

import { ref, toRefs } from 'vue';
import { useStore } from 'vuex';

import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import Button from '@/components/ui/Button.vue';
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
const daysToUnstake = ref<number | null>();
const isResponseError = ref<boolean>(false);
const isLoading = ref<boolean>(false);
async function getTimeToUnstake() {
  isResponseError.value = false;
  isLoading.value = true;
  try {
    daysToUnstake.value = await apistore.dispatch(GlobalDemerisActionTypes.API.GET_UNSTAKING_PERIOD, {
      chain_name: chainName.value,
      //   refreshTime: 5000,
    });
  } catch {
    isResponseError.value = true;
  }
  isLoading.value = false;
}
if (featureRunning('TIME_TO_UNSTAKE_FROM_API') || !chainName.value) {
  getTimeToUnstake();
}
</script>
