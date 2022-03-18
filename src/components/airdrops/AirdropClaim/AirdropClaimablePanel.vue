<template>
  <div>
    <div
      v-if="isDemoAccountBanner && !airdropsLoading"
      class="mt-8 flex justify-between bg-inverse text-text rounded-2xl shadow-card cursor-pointer border border-border"
      @click="toggleConnectWalletModal"
    >
      <div class="w-1/2 p-6">
        <p class="text-2 font-bold mb-4">Find out which airdrops you are eligible for</p>
        <p class="-text-1 text-text mb-2 flex items-center">
          Connect your wallet
          <Icon name="ArrowRightIcon" :icon-size="0.6" class="ml-2" />
        </p>
      </div>

      <img src="~@/assets/images/demo-account-banner.png" alt="Demo account" class="w-1/2" />
    </div>

    <div
      v-if="!isDemoAccountBanner && !airdropsLoading && !noAirdropsToClaim"
      class="mt-8 flex justify-between bg-text text-inverse rounded-2xl shadow-card cursor-pointer"
    >
      <div class="w-1/2 p-6">
        <p class="text-2 font-bold mb-4">Congratulations! You have {{ noOfClaimableAirdrops }} Airdrops to claim</p>
        <p class="-text-1 text-inverse mb-2 flex items-center">
          Claim now
          <Icon name="ArrowRightIcon" :icon-size="0.6" class="ml-2" />
        </p>
      </div>

      <img src="~@/assets/images/claimable-airdrops-header.png" alt="Claimable airdrops header" class="w-1/2" />
    </div>

    <div
      v-if="airdropsLoading"
      class="mt-8 flex justify-between bg-inverse text-dark rounded-2xl shadow-card cursor-pointer border border-border"
    >
      <div class="w-1/2 py-8 px-6">
        <p class="text-2 font-bold mb-4">Checking your airdrops...</p>
        <p class="-text-1 text-dark mb-2 flex items-center">Searching 12/34 airdrops</p>
      </div>

      <img src="~@/assets/images/airdrops-loading-banner.png" alt="Airdrops loading" class="w-1/2 rounded-2xl" />
    </div>

    <div
      v-if="!isDemoAccountBanner && !airdropsLoading && noAirdropsToClaim"
      class="mt-8 flex justify-between bg-inverse text-dark rounded-2xl shadow-card cursor-pointer border border-border"
    >
      <div class="w-1/2 py-8 px-6">
        <p class="text-2 font-bold mb-4">No airdrops to claim</p>
        <p class="-text-1 text-dark mb-1">Check out the upcoming airdrops and find out</p>
        <p class="-text-1 text-dark mb-2 flex items-center">
          if you’re eligible<Icon name="ArrowRightIcon" :icon-size="0.6" class="ml-2" />
        </p>
      </div>

      <img src="~@/assets/images/no-airdrops-to-claim.png" alt="No airdrops to claim" class="w-1/2 rounded-2xl" />
    </div>

    <ConnectWalletModal :open="isWalletModalOpen" @close="toggleConnectWalletModal" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRaw } from 'vue';
import { useStore } from 'vuex';

import ConnectWalletModal from '@/components/account/ConnectWalletModal.vue';
import Icon from '@/components/ui/Icon.vue';
import useTheme from '@/composables/useTheme';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { LoadingState } from '@/types/util';

export default defineComponent({
  name: 'AirdropClaimablePanel',
  components: {
    Icon,
    ConnectWalletModal,
  },
  props: {
    activeFilter: {
      type: String,
      default: 'all',
    },
  },
  setup() {
    const theme = useTheme();
    const typedstore = useStore() as RootStoreTyped;
    const isWalletModalOpen = ref(false);

    const selectedAirdrop = computed(() => {
      return toRaw(typedstore.getters[GlobalGetterTypes.API.getSelectedAirdrop]);
    });

    const airdrops = computed(() => {
      return typedstore.getters[GlobalGetterTypes.API.getAirdrops];
    });

    const isDemoAccountBanner = computed(() => {
      return (
        !typedstore.getters[GlobalGetterTypes.USER.isSignedIn] ||
        typedstore.getters[GlobalGetterTypes.USER.isDemoAccount]
      );
    });

    const toggleConnectWalletModal = () => {
      isWalletModalOpen.value = !isWalletModalOpen.value;
    };

    const airdropsLoading = computed(() => {
      return typedstore.getters[GlobalGetterTypes.API.getAirdropsStatus] === LoadingState.LOADING;
    });

    const noAirdropsToClaim = computed(() => {
      return airdrops.value.every((item) => item.eligibility !== 'CLAIMABLE');
    });

    const noOfClaimableAirdrops = computed(() => {
      const claimableAirdrops = airdrops.value.filter((item) => item.eligibility === 'CLAIMABLE');
      return claimableAirdrops.length;
    });

    return {
      theme,
      selectedAirdrop,
      isDemoAccountBanner,
      isWalletModalOpen,
      toggleConnectWalletModal,
      airdropsLoading,
      noAirdropsToClaim,
      noOfClaimableAirdrops,
    };
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  min-width: 20rem;
}
</style>
