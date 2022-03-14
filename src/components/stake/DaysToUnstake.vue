<template>
  <span v-if="!isResponseError">
    <span v-if="!isLoading">
      {{
        `${daysToUnstake}
       ${daysToUnstake <= 1 ? $t('components.daysToUnstake.daySingular') : $t('components.daysToUnstake.dayPlural')}`
      }}
    </span>
    <span v-if="isLoading"><SkeletonLoader width="4rem" height="1rem" /></span>
  </span>
  <span v-if="isResponseError" class="flex justify-end w-full">
    <Button
      size="sm"
      variant="link"
      class="text-negative"
      :name="$t('components.daysToUnstake.errorButton')"
      @click="getDaysToUnstake()"
    />
  </span>
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue';
import { useStore } from 'vuex';

import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import Button from '@/components/ui/Button.vue';
import { GlobalActionTypes, RootStoreTyped } from '@/store';
import { featureRunning } from '@/utils/FeatureManager';
const store = useStore();
const apistore = store as RootStoreTyped;
interface Props {
  chainName: string;
}
const props = withDefaults(defineProps<Props>(), { chainName: '' });
const { chainName } = toRefs(props);
const daysToUnstake = ref<number | null>(null);
const isResponseError = ref<boolean>(false);
const isLoading = ref<boolean>(false);
async function getDaysToUnstake() {
  isResponseError.value = false;
  isLoading.value = true;
  try {
    const unstakingParams = await apistore.dispatch(GlobalActionTypes.API.GET_UNSTAKING_PARAM, {
      subscribe: false,
      params: {
        chain_name: chainName.value,
      },
    });
    daysToUnstake.value = (Math.round(unstakingParams.unbonding_time / 1000000000 / 60 / 60 / 24) * 100) / 100;
  } catch {
    isResponseError.value = true;
  }
  isLoading.value = false;
}
if (featureRunning('TIME_TO_UNSTAKE_FROM_API')) {
  getDaysToUnstake();
} else {
  daysToUnstake.value = 21;
}
</script>
