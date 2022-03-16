<template>
  <div class="wrapper w-full relative">
    <div class="claim-widget bg-surface dark:bg-fg rounded-2xl px-6 py-8 shadow-panel">
      <!-- Claim Header -->
      <!-- Has Airdrop amount -->
      <div class="text-center mb-6">
        <div class="w-1/4 mx-auto mb-6">
          <img
            v-if="selectedAirdrop.tokenIcon"
            :src="selectedAirdrop.tokenIcon"
            alt="Airdrop Logo"
            class="w-full rounded-full"
          />
          <div v-else class="w-20 h-20 bg-text text-inverse rounded-full text-center pt-4 text-3 font-bold">
            {{ selectedAirdrop.chainName.slice(0, 1) }}
          </div>
        </div>

        <div v-if="selectedAirdrop.dateStatus === 'ended'">
          <p class="text-1 font-bold">Airdrop ended</p>
        </div>

        <div v-if="selectedAirdrop.dateStatus === 'not_started'">
          <p class="-text-1 text-muted mb-2">Airdrop coming soon</p>
          <p class="text-1 font-bold">You could become eligible for this airdrop</p>
        </div>

        <div v-if="!isAutoDropped && selectedAirdrop.dateStatus === 'ongoing'">
          <p class="-text-1 text-muted mb-2">Your Airdrop amount</p>
          <p class="text-2 font-bold">126.54 LIKE</p>
        </div>

        <div v-if="isAutoDropped && selectedAirdrop.dateStatus === 'ongoing'">
          <p class="inline-block -text-1 mb-2 text-positive-text">
            Auto-claimed<Icon :name="'ClaimedIcon'" :icon-size="1" class="ml-1" />
          </p>
          <p class="text-2 font-bold">126.54 LIKE</p>
        </div>
      </div>

      <!-- Claim Details -->
      <div class="pb-6">
        <div class="flex justify-between -text-1 text-muted mb-4">
          <p>Snapshot Date</p>
          <p>{{ selectedAirdrop.snapshotDate ? selectedAirdrop.snapshotDate : '-' }}</p>
        </div>
        <div v-if="selectedAirdrop.airdropStartDate" class="flex justify-between -text-1 text-muted mb-4">
          <p>Starts</p>
          <p>{{ selectedAirdrop.airdropStartDate }}</p>
        </div>
        <div v-if="selectedAirdrop.airdropEndDate" class="flex justify-between -text-1 text-muted mb-4">
          <p>Ends</p>
          <p>{{ selectedAirdrop.airdropEndDate }}</p>
        </div>
        <div v-if="isAutoDropped && !isDemoAccount" class="flex justify-between -text-1 text-muted mb-4">
          <p>Distribution</p>
          <p>Auto-claim</p>
        </div>
      </div>

      <!-- Claim button -->
      <Button v-if="!isAutoDropped && !isDemoAccount" name="Claim" @click="toggleClaimModal" />
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
import { computed, defineComponent, ref, toRaw } from 'vue';
import { useStore } from 'vuex';

import ConnectWalletModal from '@/components/account/ConnectWalletModal.vue';
import AirdropClaimModal from '@/components/airdrops/AirdropClaim/AirdropClaimModal.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';

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
      return (
        selectedAirdrop.value.claimActions &&
        selectedAirdrop.value.claimActions.length === 1 &&
        selectedAirdrop.value.claimActions[0].actionType === 'autodrop'
      );
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

    const toggleConnectWalletModal = () => {
      isWalletModalOpen.value = !isWalletModalOpen.value;
    };

    return {
      isClaimModalOpen,
      isWalletModalOpen,
      toggleClaimModal,
      selectedAirdrop,
      isAutoDropped,
      goToAirdropWebsite,
      isDemoAccount,
      toggleConnectWalletModal,
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
