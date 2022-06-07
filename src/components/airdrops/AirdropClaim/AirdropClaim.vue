<template>
  <div class="wrapper w-full relative">
    <div class="claim-widget bg-surface dark:bg-darkBanner rounded-2xl px-6 py-8 shadow-panel">
      <!-- Claim Header -->
      <!-- Has Airdrop amount -->
      <div class="text-center mb-6">
        <div class="w-1/4 mx-auto mb-6">
          <img
            v-if="!imageLoadFail"
            :src="selectedAirdrop.tokenIcon"
            alt="Airdrop Logo"
            class="w-full rounded-full"
            @error="() => (imageLoadFail = true)"
          />
          <div v-else class="w-20 h-20 bg-text text-inverse rounded-full text-center pt-4 text-3 font-bold">
            {{ selectedAirdrop.project.slice(0, 2) }}
          </div>
        </div>

        <div v-if="selectedAirdrop.dateStatus === EmerisAirdrops.AirdropDateStatus.ENDED">
          <div v-if="isAutoDropped" class="inline-flex items-center mb-2">
            <p class="-text-1 text-positive-text">{{ $t('context.airdrops.claimCard.autoDrop') }}</p>
            <Icon :name="'ClaimedIcon'" :icon-size="1" class="ml-1" />
          </div>
          <div
            v-else-if="selectedAirdrop.eligibility === AirdropEligibilityStatus.CLAIMED"
            class="inline-flex items-center mb-2"
          >
            <p class="-text-1 text-positive-text">{{ $t('context.airdrops.claimCard.claimed') }}</p>
            <Icon :name="'ClaimedIcon'" :icon-size="1" class="ml-1" />
          </div>
          <p class="text-2 font-bold">{{ $t('context.airdrops.claimCard.ended') }}</p>
        </div>

        <div v-else-if="selectedAirdrop.dateStatus === EmerisAirdrops.AirdropDateStatus.NOT_STARTED">
          <div v-if="isAutoDropped" class="inline-flex items-center mb-2">
            <p class="-text-1 text-positive-text">{{ $t('context.airdrops.claimCard.autoDrop') }}</p>
            <Icon :name="'ClaimedIcon'" :icon-size="1" class="ml-1" />
          </div>
          <p
            v-else-if="selectedAirdrop.eligibility === AirdropEligibilityStatus.ELIGIBLE"
            class="-text-1 text-muted mb-2"
          >
            {{ $t('context.airdrops.claimCard.eligible') }}
          </p>
          <p
            v-else-if="selectedAirdrop.eligibility === AirdropEligibilityStatus.ELIGIBILITY_UNAVAILABLE"
            class="-text-1 text-muted mb-2"
          >
            {{ $t('context.airdrops.claimCard.unavailable') }}
          </p>
          <p v-else class="-text-1 text-muted mb-2">
            {{ $t('context.airdrops.claimCard.becomeEligible') }}
          </p>
          <p class="text-2 font-bold">{{ $t('context.airdrops.claimCard.comingSoon') }}</p>
        </div>

        <div v-else-if="selectedAirdrop.dateStatus === EmerisAirdrops.AirdropDateStatus.ONGOING">
          <div v-if="isAutoDropped" class="inline-flex items-center mb-2">
            <p class="-text-1 text-positive-text">{{ $t('context.airdrops.claimCard.autoDrop') }}</p>
            <Icon :name="'ClaimedIcon'" :icon-size="1" class="ml-1" />
          </div>
          <p
            v-else-if="selectedAirdrop.eligibility === AirdropEligibilityStatus.NOT_ELIGIBLE"
            class="-text-1 text-muted mb-2"
          >
            {{ $t('context.airdrops.claimCard.becomeEligible') }}
          </p>
          <p
            v-else-if="selectedAirdrop.eligibility === AirdropEligibilityStatus.ELIGIBLE"
            class="-text-1 text-muted mb-2"
          >
            {{ $t('context.airdrops.claimCard.eligible') }}
          </p>
          <div
            v-else-if="selectedAirdrop.eligibility === AirdropEligibilityStatus.CLAIMABLE"
            class="inline-flex items-center mb-2"
          >
            <p class="-text-1 text-positive-text">{{ $t('context.airdrops.claimCard.claimable') }}</p>
            <Icon :name="'ClaimedIcon'" :icon-size="1" class="ml-1" />
          </div>
          <div
            v-else-if="selectedAirdrop.eligibility === AirdropEligibilityStatus.CLAIMED"
            class="inline-flex items-center mb-2"
          >
            <p class="-text-1 text-positive-text">{{ $t('context.airdrops.claimCard.claimed') }}</p>
            <Icon :name="'ClaimedIcon'" :icon-size="1" class="ml-1" />
          </div>
          <p
            v-else-if="selectedAirdrop.eligibility === AirdropEligibilityStatus.ELIGIBILITY_UNAVAILABLE"
            class="-text-1 text-muted mb-2"
          >
            {{ $t('context.airdrops.claimCard.unavailable') }}
          </p>
          <p v-else class="-text-1 text-muted mb-2">
            {{ $t('context.airdrops.claimCard.ongoing') }}
          </p>
          <!-- <p class="text-2 font-bold">{{ $t('context.airdrops.claimCard.airdropAmount') }}</p> -->
        </div>

        <div v-else>
          <div v-if="isAutoDropped" class="inline-flex items-center mb-2">
            <p class="-text-1 text-positive-text">{{ $t('context.airdrops.claimCard.autoDrop') }}</p>
            <Icon :name="'ClaimedIcon'" :icon-size="1" class="ml-1" />
          </div>
          <p
            v-else-if="selectedAirdrop.eligibility === AirdropEligibilityStatus.NOT_ELIGIBLE"
            class="-text-1 text-muted mb-2"
          >
            {{ $t('context.airdrops.claimCard.becomeEligible') }}
          </p>
          <p
            v-else-if="selectedAirdrop.eligibility === AirdropEligibilityStatus.ELIGIBLE"
            class="-text-1 text-muted mb-2"
          >
            {{ $t('context.airdrops.claimCard.eligible') }}
          </p>
          <div
            v-else-if="selectedAirdrop.eligibility === AirdropEligibilityStatus.CLAIMABLE"
            class="inline-flex items-center mb-2"
          >
            <p class="-text-1 text-positive-text">{{ $t('context.airdrops.claimCard.claimable') }}</p>
            <Icon :name="'ClaimedIcon'" :icon-size="1" class="ml-1" />
          </div>
          <div
            v-else-if="selectedAirdrop.eligibility === AirdropEligibilityStatus.CLAIMED"
            class="inline-flex items-center mb-2"
          >
            <p class="-text-1 text-positive-text">{{ $t('context.airdrops.claimCard.claimed') }}</p>
            <Icon :name="'ClaimedIcon'" :icon-size="1" class="ml-1" />
          </div>
          <p
            v-else-if="selectedAirdrop.eligibility === AirdropEligibilityStatus.ELIGIBILITY_UNAVAILABLE"
            class="-text-1 text-muted mb-2"
          >
            {{ $t('context.airdrops.claimCard.unavailable') }}
          </p>

          <p class="text-2 font-bold">{{ $t('context.airdrops.claimCard.notAnnounced') }}</p>
        </div>
      </div>

      <!-- Claim Details -->
      <div class="pb-6">
        <div class="flex justify-between -text-1 text-muted mb-4">
          <p>{{ $t('context.airdrops.claimCard.snapshotDate') }}{{ isMultipleSnapshots ? 's' : '' }}</p>
          <p v-if="!isMultipleSnapshots">{{ selectedAirdrop.snapshotDate ? selectedAirdrop.snapshotDate : '-' }}</p>
          <div v-else>
            <p v-for="(item, index) in selectedAirdrop.snapshotDate" :key="index" class="mb-2">{{ item }}</p>
          </div>
        </div>
        <div v-if="selectedAirdrop.airdropStartDate" class="flex justify-between -text-1 text-muted mb-4">
          <p>{{ $t('context.airdrops.claimCard.starts') }}</p>
          <p>{{ selectedAirdrop.airdropStartDate }}</p>
        </div>
        <div v-if="selectedAirdrop.airdropEndDate" class="flex justify-between -text-1 text-muted mb-4">
          <p>{{ $t('context.airdrops.claimCard.ends') }}</p>
          <p>{{ selectedAirdrop.airdropEndDate }}</p>
        </div>
        <div v-if="isAutoDropped && !isDemoAccount" class="flex justify-between -text-1 text-muted mb-4">
          <p>{{ $t('context.airdrops.claimCard.distribution') }}</p>
          <p>{{ $t('context.airdrops.claimCard.autoDrop') }}</p>
        </div>
      </div>

      <!-- Claim button -->
      <Button v-if="isClaimable && !isDemoAccount" name="Claim" @click="toggleClaimModal" />
      <Button
        v-if="isAutoDropped && !isDemoAccount"
        :animate="false"
        name="More details"
        variant="secondary"
        class="border border-text rounded-lg"
        @click="goToAirdropWebsite"
      />
      <Button
        v-if="isDemoAccount"
        :animate="false"
        name="Connect wallet"
        variant="secondary"
        class="border border-text rounded-lg"
        @click="toggleConnectWalletModal"
      />
    </div>

    <ConnectWalletModal :open="isWalletModalOpen" @close="toggleConnectWalletModal" />
    <AirdropClaimModal :open="isClaimModalOpen" :selected-airdrop="selectedAirdrop" @close="toggleClaimModal" />
  </div>
</template>
<script setup lang="ts">
import { EmerisAirdrops } from '@emeris/types';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import ConnectWalletModal from '@/components/account/ConnectWalletModal.vue';
import AirdropClaimModal from '@/components/airdrops/AirdropClaim/AirdropClaimModal.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { AirdropEligibilityStatus } from '@/utils/airdropEligibility';

interface Props {
  selectedAirdrop?: EmerisAirdrops.Airdrop;
}

const props = withDefaults(defineProps<Props>(), { selectedAirdrop: null });

const typedstore = useStore() as RootStoreTyped;

const isClaimModalOpen = ref(false);
const isWalletModalOpen = ref(false);
let imageLoadFail = ref(false);

const toggleClaimModal = () => {
  isClaimModalOpen.value = !isClaimModalOpen.value;
};

const isAutoDropped = computed(() => {
  return props.selectedAirdrop.eligibility === AirdropEligibilityStatus.AUTO_DROP;
});

const isClaimable = computed(() => {
  return props.selectedAirdrop.eligibility === AirdropEligibilityStatus.CLAIMABLE;
});

const goToAirdropWebsite = () => {
  window.open(props.selectedAirdrop.projectWebsiteUrl, '_blank');
};

const isDemoAccount = computed(() => {
  return (
    !typedstore.getters[GlobalGetterTypes.USER.isSignedIn] || typedstore.getters[GlobalGetterTypes.USER.isDemoAccount]
  );
});

const isMultipleSnapshots = computed(() => {
  return typeof props.selectedAirdrop.snapshotDate === 'object';
});

const toggleConnectWalletModal = () => {
  isWalletModalOpen.value = !isWalletModalOpen.value;
};
</script>

<style lang="scss" scoped>
.wrapper {
  min-width: 20rem;
  /* min-height: 17rem; */
}
.claim-widget {
  min-height: 24rem;
}
</style>
