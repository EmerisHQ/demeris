<template>
  <teleport to="body">
    <Modal :open="open" class="connect-wallet-modal" body-class="elevation-panel" width="72rem" @close="close">
      <ConnectKeplr ref="connectKeplrRef" @cancel="close" @connect="close" />
    </Modal>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import Modal from '@/components/ui/Modal.vue';

import ConnectKeplr from './ConnectKeplr.vue';

export default defineComponent({
  name: 'ConnectWalletModal',

  components: {
    Modal,
    ConnectKeplr,
  },

  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close'],

  setup(_, { emit }) {
    const connectKeplrRef = ref(null);

    const close = () => {
      connectKeplrRef.value.cancel();
      emit('close');
    };

    return { connectKeplrRef, close };
  },
});
</script>

<style lang="scss">
.connect-wallet-modal {
  .modal__body {
    position: relative;
    overflow: hidden;
    padding: 0;
    min-height: 48rem;
  }

  .modal__close {
    position: absolute;
    top: 2rem;
    right: 2rem;
    z-index: 40;
  }
}
</style>
