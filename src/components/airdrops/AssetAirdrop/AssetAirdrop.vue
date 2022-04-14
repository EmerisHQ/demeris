<template>
  <div v-if="showAirdropCard" class="bg-fg w-full p-4 flex items-center justify-between rounded-xl mt-8">
    <div class="flex items-center">
      <img src="~@/assets/images/token-airdrop.png" alt="Token Airdrop" class="w-8 h-8 rounded-full mr-2" />
      <p>
        <span class="uppercase">{{ assetAirdrop[0].project }}</span> {{ $t('context.airdrops.airdrop') }}
      </p>
    </div>
    <div class="text-muted">0.123 {{ assetAirdrop[0].tokenTicker }}</div>
    <div class="flex items-center">
      <div class="mr-6">
        <Button
          v-if="assetAirdrop[0].eligibility === AirdropEligibilityStatus.CLAIMABLE"
          name="Claim"
          size="sm"
          variant="secondary"
        />
        <div v-else-if="assetAirdrop[0].eligibility === AirdropEligibilityStatus.ELIGIBLE">Eligible</div>
        <div
          v-if="assetAirdrop[0].eligibility === AirdropEligibilityStatus.AUTO_DROP"
          class="flex items-center float-right"
        >
          <Icon :name="'CheckIcon'" :icon-size="1" class="mr-2" />Auto-drop
        </div>
        <div
          v-else-if="assetAirdrop[0].eligibility === AirdropEligibilityStatus.CLAIMED"
          class="flex items-center float-right"
        >
          <Icon :name="'CheckIcon'" :icon-size="1" class="mr-2" />Claimed
        </div>
      </div>
      <Icon :name="'CloseIcon'" :icon-size="1" class="cursor-pointer" @click="() => (airdropCardIsVisible = false)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { getTicker } from '@/utils/actionHandler';
import { AirdropEligibilityStatus } from '@/utils/airdropEligibility';
import { featureRunning } from '@/utils/FeatureManager';
import { useStore } from '@/utils/useStore';

interface Props {
  denom: string;
}

const props = withDefaults(defineProps<Props>(), { denom: '' });

const airdropCardIsVisible = ref(true);
const tokenTicker = ref('');
const typedstore = useStore() as RootStoreTyped;

onMounted(async () => {
  tokenTicker.value = await getTicker(props.denom, typedstore.getters[GlobalGetterTypes.API.getDexChain]);
});

const assetAirdrop = computed(() => {
  const airdrops = typedstore.getters[GlobalGetterTypes.API.getAirdrops];
  return airdrops.filter((item) => item.tokenTicker === tokenTicker.value);
});

const isDemoAccount = computed(() => {
  return (
    !typedstore.getters[GlobalGetterTypes.USER.isSignedIn] || typedstore.getters[GlobalGetterTypes.USER.isDemoAccount]
  );
});

const isAirdropsRunning = featureRunning('AIRDROPS_FEATURE');

const showAirdropCard = computed(() => {
  return (
    isAirdropsRunning &&
    !isDemoAccount.value &&
    airdropCardIsVisible.value &&
    assetAirdrop.value[0] &&
    assetAirdrop.value[0].eligibility !== AirdropEligibilityStatus.ENDED &&
    assetAirdrop.value[0].eligibility !== AirdropEligibilityStatus.NOT_ELIGIBLE &&
    assetAirdrop.value[0].eligibility !== AirdropEligibilityStatus.NOT_AVAILABLE
  );
});
</script>
