<template>
  <Modal
    :open="open"
    variant="center"
    fullscreen
    show-close-button
    class="connect-wallet-modal"
    max-width-class="max-w-3xl"
    @close="closeClaimModal"
  >
    <template #header>
      <h1 class="w-full font-medium text-2 text-center">{{ $t('context.airdrops.howToClaimModal.hotToClaim') }}</h1>
    </template>

    <!-- Content Area -->
    <div class="w-full px-16 py-8">
      <div
        v-for="(item, index) in selectedAirdrop.claimActions"
        :key="index"
        class="flex justify-between items-center text-muted border border-border rounded-xl px-6 py-4 mb-4"
      >
        <div class="w-6 h-6 bg-text text-inverse rounded-md pt-1 text-center -text-1 mr-4">{{ index + 1 }}</div>
        <p class="w-96 -text-1 mr-6">
          {{ item.desc }}
        </p>
        <div class="w-30 flex items-center text-right">
          <div>
            <p class="-text-1 font-medium">{{ $t('context.airdrops.howToClaimModal.completed') }}</p>
            <p v-if="selectedAirdrop.unanimousClaim" class="uppercase -text-2">
              ({{ $t('context.airdrops.howToClaimModal.unlock') }} {{ item.unlockPercentage }}%)
            </p>
          </div>
        </div>
        <div class="w-6">
          <ClaimedIcon />
        </div>
      </div>

      <!-- Quick Info -->
      <div class="flex items-center text-muted border border-border rounded-xl px-6 py-4 mt-12">
        <InformationIcon class="mr-4" />
        <p class="-text-1">
          {{ $t('context.airdrops.howToClaimModal.notFinancialAdvise') }}
        </p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { EmerisAirdrops } from '@emeris/types';

import ClaimedIcon from '@/components/common/Icons/ClaimedIcon.vue';
import InformationIcon from '@/components/common/Icons/InformationIcon.vue';
import Modal from '@/components/ui/Modal.vue';

interface Props {
  open?: boolean;
  selectedAirdrop?: EmerisAirdrops.Airdrop;
}

withDefaults(defineProps<Props>(), {
  open: false,
  selectedAirdrop: null,
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const closeClaimModal = () => {
  emit('close');
};
</script>
