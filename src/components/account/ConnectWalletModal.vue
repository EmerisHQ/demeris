<template>
  <teleport to="body">
    <Modal
      v-if="isKeplrInstalled && isWarningAgreed"
      :open="open"
      class="connect-wallet-modal"
      body-class="elevation-panel"
      width="72rem"
      @close="closeConnectKeplr"
    >
      <ConnectKeplr ref="connectKeplrRef" @cancel="closeConnectKeplr" @connect="closeConnectKeplr" />
    </Modal>

    <Modal
      v-else-if="isKeplrInstalled && !isWarningAgreed"
      :open="open"
      class="connect-wallet-modal"
      body-class="elevation-panel"
      width="72rem"
      @close="closeAgreeWarning"
    >
      <AgreeWarning ref="agreeWarningRef" @cancel="closeAgreeWarning" @agree="agreeWarning" />
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
      <GetBrowser ref="getBrowserRef" :is-loading="isLoading" @cancel="closeGetBrowser" />
    </Modal>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from 'vue';

import Modal from '@/components/ui/Modal.vue';

import AgreeWarning from './AgreeWarning.vue';
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
    AgreeWarning,
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
    const agreeWarningRef = ref(null);
    const getKeplrRef = ref(null);
    const getBrowserRef = ref(null);
    const isWarningAgreed = ref(null);
    const isKeplrSupported = ref(null);
    const isKeplrInstalled = ref(null);
    const isLoading = ref(true);

    const closeConnectKeplr = () => {
      connectKeplrRef.value.cancel();
      emit('close');
    };
    const closeAgreeWarning = () => {
      emit('close');
    };
    const closeGetKeplr = () => {
      emit('close');
    };
    const closeGetBrowser = () => {
      emit('close');
    };

    const agreeWarning = () => {
      console.log('agreeing to warning');
      isWarningAgreed.value = true;
    };

    onMounted(async () => {
      // dont load forever if not Chrome
      // @ts-ignore
      if (!window.chrome) {
        isLoading.value = false;
      }

      await getKeplrInstance();
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
      agreeWarning,
      connectKeplrRef,
      agreeWarningRef,
      getKeplrRef,
      getBrowserRef,
      isWarningAgreed,
      isKeplrSupported,
      isKeplrInstalled,
      closeAgreeWarning,
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

.connect-wallet {
  min-height: inherit;

  &__wrapper {
    display: flex;
    min-height: inherit;
  }

  &__loading {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__content {
    width: 50%;
    min-height: inherit;
    padding: 4.8rem;
    text-align: center;
  }

  &__controls {
    display: flex;
    flex-direction: column;
    margin-top: 5rem;

    div + div {
      margin-top: 1.6rem;
    }
  }

  &__description {
    margin-top: 4rem;
    line-height: 1.8;
    color: var(--muted);

    p:first-child {
      margin-bottom: 1.8rem;
    }
  }

  &__title {
    font-size: 2.8rem;
    font-weight: 600;
  }
}
</style>
