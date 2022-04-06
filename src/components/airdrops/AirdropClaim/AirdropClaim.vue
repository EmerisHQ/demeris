<template>
  <div class="wrapper w-full relative">
    <div class="claim-widget bg-surface dark:bg-darkBanner rounded-2xl px-6 py-8 shadow-panel">
      <!-- Claim Header -->
      <!-- Has Airdrop amount -->
      <div class="text-center mb-6">
        <div class="w-1/4 mx-auto mb-6">
          <img
            v-if="selectedAirdrop.tokenIcon && selectedAirdrop.imageExists"
            :src="selectedAirdrop.tokenIcon"
            alt="Airdrop Logo"
            class="w-full rounded-full"
          />
          <div v-else class="w-20 h-20 bg-text text-inverse rounded-full text-center pt-4 text-3 font-bold">
            {{ selectedAirdrop.project.slice(0, 2) }}
          </div>
        </div>

        <div v-if="selectedAirdrop.dateStatus === EmerisAirdrops.AirdropDateStatus.ENDED">
          <p class="text-1 font-bold">{{ $t('context.airdrops.claimCard.ended') }}</p>
        </div>

        <div v-else-if="selectedAirdrop.dateStatus === EmerisAirdrops.AirdropDateStatus.NOT_STARTED">
          <p class="-text-1 text-muted mb-2">{{ $t('context.airdrops.claimCard.comingSoon') }}</p>
          <p class="text-1 font-bold">{{ $t('context.airdrops.claimCard.becomeEligible') }}</p>
        </div>

        <div v-else-if="!isAutoDropped && selectedAirdrop.dateStatus === EmerisAirdrops.AirdropDateStatus.ONGOING">
          <p class="-text-1 text-muted mb-2">{{ $t('context.airdrops.claimCard.amountTitle') }}</p>
          <p class="text-2 font-bold">{{ $t('context.airdrops.claimCard.airdropAmount') }}</p>
        </div>

        <div v-else-if="isAutoDropped && selectedAirdrop.dateStatus === EmerisAirdrops.AirdropDateStatus.ONGOING">
          <div class="inline-flex items-center mb-2">
            <p class="-text-1 text-positive-text">{{ $t('context.airdrops.claimCard.autoDrop') }}</p>
            <Icon :name="'ClaimedIcon'" :icon-size="1" class="ml-1" />
          </div>
          <p class="text-2 font-bold">{{ $t('context.airdrops.claimCard.airdropAmount') }}</p>
        </div>

        <div v-else-if="selectedAirdrop.dateStatus === EmerisAirdrops.AirdropDateStatus.NOT_ANNOUNCED">
          <p class="text-2 font-bold">{{ $t('context.airdrops.claimCard.notAnnounced') }}</p>
        </div>

        <div v-else>
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
<script lang="ts">
import { EmerisAirdrops } from '@emeris/types';
import { computed, defineComponent, ref, toRaw } from 'vue';
import { useStore } from 'vuex';

import ConnectWalletModal from '@/components/account/ConnectWalletModal.vue';
import AirdropClaimModal from '@/components/airdrops/AirdropClaim/AirdropClaimModal.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { AirdropEligibilityStatus } from '@/utils/airdropEligibility';

export default defineComponent({
  name: 'AirdropClaim',
  components: {
    Button,
    AirdropClaimModal,
    ConnectWalletModal,
    Icon,
  },

  setup() {
    const typedstore = useStore() as RootStoreTyped;

    const isClaimModalOpen = ref(false);
    const isWalletModalOpen = ref(false);

    const toggleClaimModal = () => {
      isClaimModalOpen.value = !isClaimModalOpen.value;
    };

    const selectedAirdrop = computed(() => {
      return toRaw(typedstore.getters[GlobalGetterTypes.API.getSelectedAirdrop]);
    });

    const isAutoDropped = computed(() => {
      return selectedAirdrop.value.eligibility === AirdropEligibilityStatus.AUTO_DROP;
    });

    const isClaimable = computed(() => {
      return selectedAirdrop.value.eligibility === AirdropEligibilityStatus.CLAIMABLE;
    });

    const goToAirdropWebsite = () => {
      window.open(selectedAirdrop.value.projectWebsiteUrl, '_blank');
    };

    const isDemoAccount = computed(() => {
      return (
        !typedstore.getters[GlobalGetterTypes.USER.isSignedIn] ||
        typedstore.getters[GlobalGetterTypes.USER.isDemoAccount]
      );
    });

    const isMultipleSnapshots = computed(() => {
      return typeof selectedAirdrop.value.snapshotDate === 'object';
    });

    const toggleConnectWalletModal = () => {
      isWalletModalOpen.value = !isWalletModalOpen.value;
    };

    return {
      isClaimModalOpen,
      isWalletModalOpen,
      toggleClaimModal,
      selectedAirdrop,
      isAutoDropped,
      isClaimable,
      goToAirdropWebsite,
      isDemoAccount,
      isMultipleSnapshots,
      toggleConnectWalletModal,
      EmerisAirdrops,
    };
  },
});
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
