<template>
  <AppLayout>
    <div class="md:flex justify-between">
      <aside class="lg:w-4/12 md:w-3/12 md:mr-10 lg:mr-0 sm:w-full">
        <div class="lg:w-3/4 sm:w-full">
          <AirdropsFilter @active-filter="(value) => (activeFilter = value)" />
          <AirdropsInfo />

          <!-- Quick Info -->
          <div class="mt-12 text-muted -text-1">
            <p class="mb-4">
              {{ $t('context.airdrops.airdropContentDisclaimer') }}
            </p>
            <p class="text-text font-medium">{{ $t('context.airdrops.featureProjects') }}</p>
          </div>
        </div>
      </aside>

      <div class="lg:w-8/12 md:w-9/12 sm:w-full sm:mt-8 mb-16 md:mb-0">
        <AirdropsTableSection
          v-if="activeFilter !== 'mine'"
          :active-filter="activeFilter"
          @active-filter="(value) => (activeFilter = value)"
        />

        <div v-else>
          <AirdropsTableSection
            v-if="!isDemoAccount"
            :active-filter="activeFilter"
            @active-filter="(value) => (activeFilter = value)"
          />
          <div v-else class="w-full text-center">
            <img src="~@/assets/images/my-airdrops-wallet-not-connected.png" alt="Wallet not connected" />
            <div class="w-3/5 mx-auto">
              <div class="text-1 sm:text-2 lg:text-3 font-bold">
                {{ $t('context.airdrops.claimablepanel.findOutEligibleAirdrops') }}
              </div>
              <p class="text-muted mt-6">
                {{ $t('context.airdrops.claimablepanel.connectWalletToCheck') }}
              </p>
              <Button
                :animate="false"
                name="Connect wallet"
                variant="primary"
                class="rounded-lg w-1/2 mx-auto mt-6"
                @click="toggleConnectWalletModal"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConnectWalletModal :open="isWalletModalOpen" @close="toggleConnectWalletModal" />
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';

import ConnectWalletModal from '@/components/account/ConnectWalletModal.vue';
import AirdropsFilter from '@/components/airdrops/AirdropsFilter';
import AirdropsInfo from '@/components/airdrops/AirdropsInfo';
import AirdropsTableSection from '@/components/airdrops/AirdropsTableSection';
import AppLayout from '@/components/layout/AppLayout.vue';
import Button from '@/components/ui/Button.vue';
import { GlobalGetterTypes } from '@/store';
import { typedstore } from '@/store/setup';
import { pageview } from '@/utils/analytics';

const { t } = useI18n({ useScope: 'global' });
pageview({ page_title: 'Airdrops', page_path: '/' });
useMeta(
  computed(() => ({
    title: t('navbar.airdrops'),
  })),
);

const activeFilter = ref('all');
const isWalletModalOpen = ref(false);

const isDemoAccount = computed(() => {
  return (
    !typedstore.getters[GlobalGetterTypes.USER.isSignedIn] || typedstore.getters[GlobalGetterTypes.USER.isDemoAccount]
  );
});

const toggleConnectWalletModal = () => {
  isWalletModalOpen.value = !isWalletModalOpen.value;
};
</script>
