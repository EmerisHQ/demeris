<template>
  <div>
    <div
      v-if="showConnectWalletBanner"
      class="mt-8 flex justify-between bg-inverse text-text rounded-2xl shadow-card cursor-pointer border border-border"
      @click="toggleConnectWalletModal"
    >
      <div class="lg:w-1/2 md:w-1/2 w-1/2 p-6">
        <p class="lg:text-2 sm:text-0 font-bold mb-4">
          {{ $t('context.airdrops.claimablepanel.findOutEligibleAirdrops') }}
        </p>
        <p class="-text-1 text-text mb-2 flex items-center">
          {{ $t('context.airdrops.claimablepanel.connectWallet') }}
          <Icon name="ArrowRightIcon" :icon-size="0.6" class="ml-2" />
        </p>
      </div>

      <img :src="demoAccountBanner" alt="Claimable airdrops header" class="lg:w-1/2 md:w-1/2 w-1/2" />
    </div>

    <div
      v-if="showClaimNowBanner"
      class="mt-8 flex justify-between bg-text text-inverse rounded-2xl shadow-card cursor-pointer"
    >
      <div class="lg:w-1/2 md:w-1/2 w-1/2 p-6">
        <p class="lg:text-2 sm:text-0 font-bold mb-4">
          {{ $t('context.airdrops.claimablepanel.congrats', { noOfAirdrops: noOfClaimableAirdrops }) }}
        </p>
        <p class="-text-1 text-inverse mb-2 flex items-center">
          {{ $t('context.airdrops.claimablepanel.claimNow') }}
          <Icon name="ArrowRightIcon" :icon-size="0.6" class="ml-2" />
        </p>
      </div>

      <img :src="claimableAirdropsHeader" alt="Claimable airdrops header" class="lg:w-1/2 md:w-1/2 w-1/2" />
    </div>

    <div
      v-if="airdropsLoading"
      class="mt-8 flex justify-between bg-inverse text-dark rounded-2xl shadow-card cursor-pointer border border-border"
    >
      <div class="lg:w-1/2 md:w-1/2 w-1/2 py-8 px-6">
        <p class="lg:text-2 sm:text-0 font-bold mb-4">{{ $t('context.airdrops.claimablepanel.checkingAirdrops') }}</p>
        <p class="-text-1 text-dark mb-2 flex items-center">
          {{ $t('context.airdrops.claimablepanel.searchingAirdrops') }}
        </p>
      </div>

      <img
        src="~@/assets/images/airdrops-loading-banner.png"
        alt="Airdrops loading"
        class="lg:w-1/2 md:w-1/2 w-1/2 rounded-2xl"
      />
    </div>

    <div
      v-if="showNoAirdropsToClaimBanner"
      class="mt-8 flex justify-between bg-inverse text-dark rounded-2xl shadow-card cursor-pointer border border-border"
      @click="goToUpcomingAirdrops"
    >
      <div class="lg:w-1/2 md:w-1/2 w-1/2 py-8 px-6">
        <p class="lg:text-2 sm:text-0 font-bold mb-4">{{ $t('context.airdrops.claimablepanel.noAirdropsToClaim') }}</p>
        <p class="-text-1 text-dark mb-1">
          {{ $t('context.airdrops.claimablepanel.checkOutForEligibility') }}
          <Icon name="ArrowRightIcon" :icon-size="0.6" class="ml-2 inline-flex" />
        </p>
      </div>

      <img
        src="~@/assets/images/no-airdrops-to-claim.png"
        alt="No airdrops to claim"
        class="lg:w-1/2 md:w-1/2 w-1/2 rounded-2xl"
      />
    </div>

    <ConnectWalletModal :open="isWalletModalOpen" @close="toggleConnectWalletModal" />
  </div>
</template>

<script setup lang="ts">
/* eslint-disable max-lines-per-function */
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import claimableAirdropsHeader from '@/assets/images/claimable-airdrops-header.png';
import demoAccountBanner from '@/assets/images/demo-account-banner.png';
import ConnectWalletModal from '@/components/account/ConnectWalletModal.vue';
import Icon from '@/components/ui/Icon.vue';
import useTheme from '@/composables/useTheme';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { LoadingState } from '@/types/util';
import { AirdropEligibilityStatus } from '@/utils/airdropEligibility';

interface Props {
  activeFilter?: string;
}

const props = withDefaults(defineProps<Props>(), { activeFilter: 'all' });

const emit = defineEmits<{
  (e: 'active-filter', filter: string): void;
}>();

useTheme();
const typedstore = useStore() as RootStoreTyped;
const isWalletModalOpen = ref(false);

const airdrops = computed(() => {
  return typedstore.getters[GlobalGetterTypes.API.getAirdrops];
});

const isDemoAccount = computed(() => {
  return (
    !typedstore.getters[GlobalGetterTypes.USER.isSignedIn] || typedstore.getters[GlobalGetterTypes.USER.isDemoAccount]
  );
});

const toggleConnectWalletModal = () => {
  isWalletModalOpen.value = !isWalletModalOpen.value;
};

const airdropsLoading = computed(() => {
  return typedstore.getters[GlobalGetterTypes.API.getAirdropsStatus] === LoadingState.LOADING;
});

const noAirdropsToClaim = computed(() => {
  return airdrops.value.every((item) => item.eligibility !== AirdropEligibilityStatus.CLAIMABLE);
});

const noOfClaimableAirdrops = computed(() => {
  const claimableAirdrops = airdrops.value.filter((item) => item.eligibility === AirdropEligibilityStatus.CLAIMABLE);
  return claimableAirdrops.length;
});

const showConnectWalletBanner = computed(() => {
  return isDemoAccount.value && !airdropsLoading.value && props.activeFilter !== 'mine';
});

const showClaimNowBanner = computed(() => {
  return !isDemoAccount.value && !airdropsLoading.value && !noAirdropsToClaim.value && props.activeFilter !== 'mine';
});

const showNoAirdropsToClaimBanner = computed(() => {
  return (
    !isDemoAccount.value &&
    !airdropsLoading.value &&
    noAirdropsToClaim.value &&
    (props.activeFilter === 'mine' || props.activeFilter === 'all')
  );
});

const goToUpcomingAirdrops = () => {
  emit('active-filter', 'upcoming');
};
</script>
