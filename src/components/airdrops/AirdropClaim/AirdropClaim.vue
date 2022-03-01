<template>
  <div class="wrapper w-full relative">
    <div class="claim-widget bg-surface dark:bg-fg rounded-2xl py-8 shadow-panel">
      <!-- Claim Header -->
      <!-- Has Airdrop amount -->
      <div class="text-center mb-6">
        <div class="w-1/4 mx-auto mb-6">
          <img :src="selectedAirdrop.tokenIcon" alt="Airdrop Logo" />
        </div>
        <p class="-text-1 text-muted mb-2">Your Airdrop amount</p>
        <p class="text-2 font-bold">126.54 LIKE</p>
      </div>

      <!-- Claim Details -->
      <div class="px-6 pb-6">
        <div v-if="selectedAirdrop.snapshotDate" class="flex justify-between -text-1 text-muted mb-4">
          <p>Snapshot Date</p>
          <p>{{ selectedAirdrop.snapshotDate }}</p>
        </div>
        <div v-if="selectedAirdrop.startDate" class="flex justify-between -text-1 text-muted mb-4">
          <p>Starts</p>
          <p>{{ selectedAirdrop.startDate }}</p>
        </div>
        <div v-if="selectedAirdrop.endDate" class="flex justify-between -text-1 text-muted mb-4">
          <p>Ends</p>
          <p>{{ selectedAirdrop.endDate }}</p>
        </div>
        <div class="flex justify-between -text-1 text-muted mb-4">
          <p>Distribution</p>
          <p>Auto-drop</p>
        </div>
      </div>

      <!-- Claim button -->
      <div class="px-6">
        <Button name="Claim" @click="toggleClaimModal" />
      </div>

      <!-- Ended -->
      <div class="px-6 mt-4">
        <div class="bg-fg p-4 rounded-xl -text-1 font-medium">Ended</div>
      </div>

      <!-- Not Eligible -->
      <div class="px-6 mt-4">
        <div class="bg-fg p-4 rounded-xl -text-1 font-medium">Not eligible</div>
      </div>

      <!-- Become Eligible -->
      <div class="px-6 mt-4">
        <div class="bg-fg p-4 rounded-xl">
          <p class="-text-1 text-muted mb-1">Become eligible</p>
          <p class="-text-1 font-medium">Look condition in how to be eligible section</p>
        </div>
      </div>

      <!-- Eligibility to be announced -->
      <div class="px-6 mt-4">
        <div class="bg-fg p-4 rounded-xl">
          <p class="-text-1 text-muted mb-1">Eligibility</p>
          <p class="-text-1 font-medium">To be announced</p>
        </div>
      </div>

      <!-- Eligibility  - Stake ATOM -->
      <div class="px-6 mt-4">
        <div class="bg-fg p-4 rounded-xl">
          <p class="-text-1 text-muted mb-1">Eligibility</p>
          <p class="-text-1 font-medium">Stake ATOM</p>
        </div>
      </div>
    </div>

    <AirdropClaimModal :open="isClaimModalOpen" @close="toggleClaimModal" />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, toRaw } from 'vue';
import { useStore } from 'vuex';

import AirdropClaimModal from '@/components/airdrops/AirdropClaim/AirdropClaimModal.vue';
import Button from '@/components/ui/Button.vue';
import { GlobalDemerisGetterTypes, TypedAPIStore } from '@/store';

export default defineComponent({
  name: 'AirdropClaim',
  components: {
    Button,
    AirdropClaimModal,
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

    return {
      isClaimModalOpen,
      toggleClaimModal,
      selectedAirdrop,
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
