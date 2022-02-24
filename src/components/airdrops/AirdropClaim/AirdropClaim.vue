<template>
  <div class="wrapper w-full relative">
    <div class="claim-widget bg-surface dark:bg-fg rounded-2xl py-8 shadow-panel">
      <!-- Claim Header -->
      <!-- Has Airdrop amount -->
      <div class="text-center mb-6">
        <div class="w-1/4 mx-auto mb-6">
          <img :src="selectedAirdrop.tokenIcon" alt="Airdrop Logo" class="w-full" />
        </div>
        <p v-if="!isAutoDropped" class="-text-1 text-muted mb-2">Your Airdrop amount</p>
        <p v-if="isAutoDropped" class="inline-block -text-1 mb-2 text-positive-text">
          Auto-claimed<Icon :name="'ClaimedIcon'" :icon-size="1" class="ml-1" />
        </p>
        <p class="text-2 font-bold">126.54 LIKE</p>
      </div>

      <!-- Claim Details -->
      <div class="px-6 pb-6">
        <div v-if="selectedAirdrop.snapshotDate" class="flex justify-between -text-1 text-muted mb-4">
          <p>Snapshot Date</p>
          <p>{{ selectedAirdrop.snapshotDate }}</p>
        </div>
        <div v-if="selectedAirdrop.airdropStartDate" class="flex justify-between -text-1 text-muted mb-4">
          <p>Starts</p>
          <p>{{ selectedAirdrop.airdropStartDate }}</p>
        </div>
        <div v-if="selectedAirdrop.airdropEndDate" class="flex justify-between -text-1 text-muted mb-4">
          <p>Ends</p>
          <p>{{ selectedAirdrop.airdropEndDate }}</p>
        </div>
        <div v-if="isAutoDropped" class="flex justify-between -text-1 text-muted mb-4">
          <p>Distribution</p>
          <p>Auto-claim</p>
        </div>
      </div>

      <!-- Claim button -->
      <div class="px-6">
        <Button v-if="!isAutoDropped" name="Claim" @click="toggleClaimModal" />
        <Button
          v-if="isAutoDropped"
          name="More Details"
          variant="secondary"
          class="border border-text rounded-lg"
          @click="goToAirdropWebsite"
        />
      </div>
    </div>

    <AirdropClaimModal :open="isClaimModalOpen" :selected-airdrop="selectedAirdrop" @close="toggleClaimModal" />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, toRaw } from 'vue';
import { useStore } from 'vuex';

import AirdropClaimModal from '@/components/airdrops/AirdropClaim/AirdropClaimModal.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalDemerisGetterTypes, TypedAPIStore } from '@/store';

export default defineComponent({
  name: 'AirdropClaim',
  components: {
    Button,
    AirdropClaimModal,
    Icon,
  },

  setup() {
    const apistore = useStore() as TypedAPIStore;

    const isClaimModalOpen = ref(false);

    const toggleClaimModal = () => {
      isClaimModalOpen.value = !isClaimModalOpen.value;
    };

    const selectedAirdrop = computed(() => {
      return toRaw(apistore.getters[GlobalDemerisGetterTypes.API.getSelectedAirdrop]);
    });

    const isAutoDropped = computed(() => {
      return (
        selectedAirdrop.value.claimActions.length === 1 &&
        selectedAirdrop.value.claimActions[0].actionType === 'autodrop'
      );
    });

    const goToAirdropWebsite = () => {
      window.open(selectedAirdrop.value.projectWebsiteUrl, '_blank');
    };

    return {
      isClaimModalOpen,
      toggleClaimModal,
      selectedAirdrop,
      isAutoDropped,
      goToAirdropWebsite,
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
