<template>
  <div>
    <div
      v-if="isDemoAccountBanner && !airdropsLoading"
      class="mt-8 flex justify-between bg-text text-inverse rounded-2xl shadow-card cursor-pointer"
      @click="toggleConnectWalletModal"
    >
      <div class="w-1/2 p-6">
        <p class="text-2 font-bold mb-4">Find out which airdrops you are eligible for</p>
        <p class="-text-1 text-inverse mb-2 flex items-center">
          Connect your wallet
          <Icon name="ArrowRightIcon" :icon-size="0.6" class="ml-2" />
        </p>
      </div>

      <img :src="demoAccountBanner" alt="Claimable airdrops header" class="w-1/2" />
    </div>

    <div
      v-if="!isDemoAccountBanner && !airdropsLoading"
      class="mt-8 flex justify-between bg-text text-inverse rounded-2xl shadow-card cursor-pointer"
    >
      <div class="w-1/2 p-6">
        <p class="text-2 font-bold mb-4">Congratulations! You have 4 Airdrops to claim</p>
        <p class="-text-1 text-inverse mb-2 flex items-center">
          Claim now
          <Icon name="ArrowRightIcon" :icon-size="0.6" class="ml-2" />
        </p>
      </div>

      <img :src="claimableAirdropsHeader" alt="Claimable airdrops header" class="w-1/2" />
    </div>

    <div
      v-if="airdropsLoading"
      class="mt-8 flex justify-between bg-inverse text-dark rounded-2xl shadow-card cursor-pointer"
    >
      <div class="w-1/2 py-8 px-6">
        <p class="text-2 font-bold mb-4">Checking your airdrops...</p>
        <p class="-text-1 text-dark mb-2 flex items-center">Searching 12/34 airdrops</p>
      </div>

      <img
        src="~@/assets/images/airdrops-loading-banner.png"
        alt="Claimable airdrops header"
        class="w-1/2 rounded-2xl"
      />
    </div>

    <ConnectWalletModal :open="isWalletModalOpen" @close="toggleConnectWalletModal" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRaw } from 'vue';
import { useStore } from 'vuex';

import claimableAirdropsHeader from '@/assets/images/claimable-airdrops-header.png';
import demoAccountBanner from '@/assets/images/demo-account-banner.png';
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

    return {
      theme,
      selectedAirdrop,
      claimableAirdropsHeader,
      demoAccountBanner,
      isDemoAccountBanner,
      isWalletModalOpen,
      toggleConnectWalletModal,
      airdropsLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  min-width: 20rem;
}
</style>
