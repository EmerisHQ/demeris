<template>
  <div id="welcome">
    <div
      v-if="isKeplrInstalled"
      class="connect-wallet-panel"
      body-class="elevation-panel"
      width="72rem"
      @close="closeConnectKeplr"
    >
      <ConnectKeplr ref="connectKeplrRef" @cancel="closeConnectKeplr" @connect="closeConnectKeplr" />
    </div>

    <div
      v-else-if="!isWarningAgreed"
      class="connect-wallet-panel"
      body-class="elevation-panel"
      width="72rem"
      @close="closeAgreeWarning"
    >
      <AgreeWarning ref="agreeWarningRef" @cancel="closeAgreeWarning" @agree="agreeWarning" />
    </div>

    <div
      v-else-if="isKeplrSupported && !isKeplrInstalled"
      class="connect-wallet-panel"
      body-class="elevation-panel"
      width="72rem"
      @close="closeGetKeplr"
    >
      <GetKeplr ref="getKeplrRef" @cancel="closeGetKeplr" />
    </div>

    <div v-else class="connect-wallet-panel" body-class="elevation-panel" width="72rem" @close="closeGetBrowser">
      <GetBrowser ref="getBrowserRef" :is-loading="isLoading" @cancel="closeGetBrowser" />
    </div>
    <GraphicPortal />
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';

import AgreeWarning from '@/components/account/AgreeWarning.vue';
import ConnectKeplr from '@/components/account/ConnectKeplr.vue';
import GetBrowser from '@/components/account/GetBrowser.vue';
import GetKeplr from '@/components/account/GetKeplr.vue';
import GraphicPortal from '@/components/account/GraphicPortal.vue';

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
    ConnectKeplr,
    AgreeWarning,
    GetKeplr,
    GetBrowser,
    GraphicPortal,
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
      isWarningAgreed.value = true;
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
#welcome {
  .connect-banner {
    display: none !important;
  }
  .connect-wallet-panel {
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
      font-size: 1.6rem;

      p:first-child {
        margin-bottom: 1.8rem;
      }
    }

    &__title {
      font-size: 2.8rem;
      font-weight: 600;
    }
  }
}
</style>
