<template>
  <teleport to="body">
    <Modal
      v-if="isKeplrInstalled"
      :open="open"
      class="connect-wallet-modal"
      body-class="shadow-panel rounded-2xl"
      width="45rem"
      @close="closeConnectKeplr"
    >
      <ConnectKeplr ref="connectKeplrRef" @cancel="closeConnectKeplr" @connect="closeConnectKeplr" />
    </Modal>

    <Modal
      v-else-if="isKeplrSupported && !isKeplrInstalled"
      :open="open"
      class="connect-wallet-modal"
      body-class="shadow-panel rounded-2xl"
      width="45rem"
      @close="closeGetKeplr"
    >
      <GetKeplr ref="getKeplrRef" @cancel="closeGetKeplr" />
    </Modal>

    <Modal
      v-else
      :open="open"
      class="connect-wallet-modal"
      body-class="shadow-panel rounded-2xl"
      width="45rem"
      @close="closeGetBrowser"
    >
      <GetBrowser ref="getBrowserRef" :is-loading="isLoading" @cancel="closeGetBrowser" />
    </Modal>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from 'vue';

import Modal from '@/components/ui/Modal.vue';

import ConnectKeplr from './ConnectKeplr.vue';
import GetBrowser from './GetBrowser.vue';
import GetKeplr from './GetKeplr.vue';

async function getKeplrInstance() {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === 'complete') {
    return window.keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event: Event) => {
      if (event.target && (event.target as Document).readyState === 'complete') {
        resolve(window.keplr);
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
}

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
    const isLoading = ref(true);

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

    onMounted(async () => {
      const keplr = await getKeplrInstance();
      await nextTick();

      // @ts-ignore
      isKeplrSupported.value = !!window.chrome;

      nextTick(() => {
        // detect keplr installed
        // @ts-ignore
        isKeplrInstalled.value = !!window.keplr;
      });
    });

    return {
      isLoading,
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
    min-height: 30rem;
  }

  .modal__close {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    z-index: 40;
  }
}
</style>
