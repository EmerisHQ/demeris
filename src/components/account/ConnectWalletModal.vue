<template>
  <teleport to="body">
    <Modal
      v-show="isKeplrInstalled && isWarningAgreed"
      :open="open"
      variant="center"
      fullscreen
      show-close-button
      class="connect-wallet-modal"
      max-width-class="max-w-sm"
      @close="closeConnectWallet"
    >
      <ConnectWallet ref="connectKeplrRef" @cancel="closeConnectWallet" @connect="closeConnectWallet" />
    </Modal>

    <Modal
      v-show="isKeplrInstalled && !isWarningAgreed"
      :open="open"
      variant="center"
      fullscreen
      show-close-button
      class="connect-wallet-modal"
      max-width-class="max-w-sm"
      @close="closeAgreeWarning"
    >
      <AgreeWarning ref="agreeWarningRef" @cancel="closeAgreeWarning" @agree="agreeWarning" />
    </Modal>

    <Modal
      v-show="isKeplrSupported && !isKeplrInstalled"
      :open="open"
      variant="center"
      fullscreen
      show-close-button
      class="connect-wallet-modal"
      max-width-class="max-w-sm"
      @close="closeGetKeplr"
    >
      <GetKeplr ref="getKeplrRef" @cancel="closeGetKeplr" @try-demo="tryDemo" />
    </Modal>

    <Modal
      v-show="!isKeplrSupported"
      :open="open"
      variant="center"
      fullscreen
      show-close-button
      class="connect-wallet-modal"
      max-width-class="max-w-sm"
      @close="closeGetBrowser"
    >
      <GetBrowser ref="getBrowserRef" :is-loading="isLoading" @cancel="closeGetBrowser" @try-demo="tryDemo" />
    </Modal>
  </teleport>
</template>

<script setup lang="ts">
/* eslint-disable max-lines-per-function */
import { nextTick, onMounted, ref, watch } from 'vue';

import AgreeWarning from '@/components/account/AgreeWarning.vue';
import ConnectWallet from '@/components/account/ConnectWallet.vue';
import GetBrowser from '@/components/account/GetBrowser.vue';
import GetKeplr from '@/components/account/GetKeplr.vue';
import Modal from '@/components/ui/Modal.vue';

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

interface Props {
  open?: boolean;
}

withDefaults(defineProps<Props>(), { open: false });

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const connectKeplrRef = ref(null);
const agreeWarningRef = ref(null);
const getKeplrRef = ref(null);
const getBrowserRef = ref(null);
const isWarningAgreed = ref(null);
const isKeplrSupported = ref(null);
const isKeplrInstalled = ref(null);
const isLoading = ref(true);

const closeConnectWallet = () => {
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
  isWarningAgreed.value = true;
  connectKeplrRef.value.signIn();
};

// TODO: Implement demo account
const tryDemo = () => {
  emit('close');
};

onMounted(async () => {
  isWarningAgreed.value = window.localStorage.getItem('isWarningAgreed');

  // dont present spinner forever if not Chrome
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

watch(isWarningAgreed, () => {
  window.localStorage.setItem('isWarningAgreed', 'true');
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
      padding: 3rem;
      text-align: center;
    }

    &__controls {
      display: flex;
      flex-direction: column;
      margin-top: 3rem;

      div + div {
        margin-top: 1rem;
      }
    }

    &__description {
      margin-top: 2.5rem;
      line-height: 1.8;
      color: var(--muted);

      p:first-child {
        margin-bottom: 1.125rem;
      }
    }

    &__title {
      font-size: 1.75rem;
      font-weight: 600;
    }
  }
}
</style>
