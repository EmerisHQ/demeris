<template>
  <teleport to="body">
    <Modal
      v-if="isKeplrInstalled"
      :open="open"
      class="connect-wallet-modal"
      body-class="elevation-panel"
      width="72rem"
      @close="closeConnectKeplr"
    >
      <ConnectKeplr ref="connectKeplrRef" @cancel="closeConnectKeplr" @connect="closeConnectKeplr" />
    </Modal>

    <Modal
      v-else-if="isKeplrSupported && !isKeplrInstalled"
      :open="open"
      class="connect-wallet-modal"
      body-class="elevation-panel"
      width="72rem"
      @close="closeGetKeplr"
    >
      <GetKeplr ref="getKeplrRef" @cancel="closeGetKeplr" />
    </Modal>

    <Modal
      v-else
      :open="open"
      class="connect-wallet-modal"
      body-class="elevation-panel"
      width="72rem"
      @close="closeGetBrowser"
    >
      <GetBrowser ref="getBrowserRef" @cancel="closeGetBrowser" />
    </Modal>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from 'vue';

import Modal from '@/components/ui/Modal.vue';

import ConnectKeplr from './ConnectKeplr.vue';
import GetBrowser from './GetBrowser.vue';
import GetKeplr from './GetKeplr.vue';

export default defineComponent({
  name: 'ConnectWalletModal',

  components: {
    Modal,
    ConnectKeplr,
    GetKeplr,
    GetBrowser,
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
    const getKeplrRef = ref(null);
    const getBrowserRef = ref(null);
    const isKeplrSupported = ref(null);
    const isKeplrInstalled = ref(null);

    const closeConnectKeplr = () => {
      connectKeplrRef.value.cancel();
      emit('close');
    };
    const closeGetKeplr = () => {
      emit('close');
    };
    const closeGetBrowser = () => {
      emit('close');
    };

    onMounted(() => {
      // detect chrome extension support
      // @ts-ignore
      isKeplrSupported.value = !!window.chrome;

      nextTick(() => {
        // detect keplr installed
        // @ts-ignore
        isKeplrInstalled.value = !!window.keplr;
      });
    });

    return {
      connectKeplrRef,
      getKeplrRef,
      getBrowserRef,
      isKeplrSupported,
      isKeplrInstalled,
      closeConnectKeplr,
      closeGetKeplr,
      closeGetBrowser,
    };
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
