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
      <h1 class="w-full font-medium text-2 text-center">How to claim</h1>
    </template>

    <!-- Content Area -->
    <div class="w-full px-16 py-8">
      <div
        v-for="(item, index) in [1, 2, 3, 4, 5]"
        :key="index"
        class="flex justify-between items-center text-muted border border-border rounded-xl px-6 py-4 mb-4"
      >
        <div class="w-6 h-6 rounded-md bg-black pt-1 text-white text-center -text-1 mr-4">{{ item }}</div>
        <p class="w-96 -text-1 mr-6">
          Airdrop is not financial advice. Eligibility, claim action can change based on the project.
        </p>
        <div class="w-40 flex items-center text-right">
          <div>
            <p class="-text-1 font-medium">Completed</p>
            <p class="uppercase -text-2">200 LIKE (Unlock 20%)</p>
          </div>
        </div>
        <div class="w-6">
          <ClaimedIcon />
        </div>
      </div>

      <!-- Quick Info -->
      <div class="flex items-center text-muted border border-border rounded-xl px-6 py-4 mt-12">
        <WarningCircleIcon class="mr-4" />
        <p class="-text-1">
          Airdrop is not financial advice. Eligibility, claim action can change based on the project.
        </p>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ClaimedIcon from '@/components/common/Icons/ClaimedIcon.vue';
import WarningCircleIcon from '@/components/common/Icons/WarningCircleIcon.vue';
import Modal from '@/components/ui/Modal.vue';

export default defineComponent({
  name: 'AirdropClaimModal',
  components: {
    Modal,
    WarningCircleIcon,
    ClaimedIcon,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close'],

  setup(_, { emit }) {
    const closeClaimModal = () => {
      emit('close');
    };
    return {
      closeClaimModal,
    };
  },
});
</script>

<style lang="scss" scoped>
.bg-black {
  background: black;
}
.text-white {
  color: white;
}
</style>
