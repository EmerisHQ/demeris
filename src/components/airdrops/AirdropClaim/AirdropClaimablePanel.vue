<template>
  <div>
    <div v-if="isDemoAccountBanner" class="mt-8 flex justify-between bg-text text-inverse rounded-2xl shadow-card">
      <div class="w-1/2 p-6">
        <p class="text-2 font-bold mb-4">Find out which airdrops you are eligible for</p>
        <a class="-text-1 text-inverse mb-2 flex items-center cursor-pointer" @click="toggleConnectWalletModal">
          Connect your wallet
          <Icon name="ArrowRightIcon" :icon-size="0.6" class="ml-2" />
        </a>
      </div>

      <img src="~@/assets/images/demo-account-banner.png" alt="Claimable airdrops header" class="w-1/2" />
    </div>

    <div v-if="!isDemoAccountBanner" class="mt-8 flex justify-between bg-text text-inverse rounded-2xl shadow-card">
      <div class="w-1/2 p-6">
        <p class="text-2 font-bold mb-4">Congratulations! You have 4 Airdrops to claim</p>
        <p class="-text-1 text-inverse mb-2 flex items-center">
          Claim now
          <Icon name="ArrowRightIcon" :icon-size="0.6" class="ml-2" />
        </p>
      </div>

      <img src="~@/assets/images/claimable-airdrops-header.png" alt="Claimable airdrops header" class="w-1/2" />
    </div>

    <ConnectWalletModal :open="isWalletModalOpen" @close="toggleConnectWalletModal" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref,toRaw } from 'vue';
import { useStore } from 'vuex';

import ConnectWalletModal from '@/components/account/ConnectWalletModal.vue';
import Icon from '@/components/ui/Icon.vue';
import useTheme from '@/composables/useTheme';
import { GlobalDemerisGetterTypes, TypedAPIStore } from '@/store';

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
    const apistore = useStore() as TypedAPIStore;
    const isWalletModalOpen = ref(false);

    const selectedAirdrop = computed(() => {
      return toRaw(apistore.getters[GlobalDemerisGetterTypes.API.getSelectedAirdrop]);
    });

    const isDemoAccountBanner = computed(() => {
      return (
        !apistore.getters[GlobalDemerisGetterTypes.USER.isSignedIn] ||
        apistore.getters[GlobalDemerisGetterTypes.USER.isDemoAccount]
      );
    });

    const toggleConnectWalletModal = () => {
      isWalletModalOpen.value = !isWalletModalOpen.value;
    };

    return {
      theme,
      selectedAirdrop,
      isDemoAccountBanner,
      isWalletModalOpen,
      toggleConnectWalletModal,
    };
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  min-width: 20rem;
}
</style>
