<template>
  <div id="welcome">
    <img class="portal" src="@/assets/svg/portal.svg" />
    <img class="surfer" src="@/assets/images/surfer.png" />

    <div v-if="isMobile" class="connect-wallet-panel">
      <GetDesktop ref="getDesktopRef" />
    </div>

    <div v-else-if="(isKeplrInstalled && !isWarningNeeded) || isWarningAgreed" class="connect-wallet-panel">
      <ConnectKeplr
        ref="connectKeplrRef"
        type="welcome"
        @connect="cancelConnectKeplr"
        @warning="showWarning"
        @try-demo="tryDemo"
      />
    </div>
    <div v-if="(isKeplrInstalled && !isWarningNeeded) || isWarningAgreed" class="connect-wallet-panel">
      <ConnectKeplr
        ref="connectKeplrRef"
        type="welcome"
        @connect="cancelConnectKeplr"
        @warning="showWarning"
        @try-demo="tryDemo"
      />
    </div>

    <div v-else-if="isWarningNeeded && !isWarningAgreed" class="connect-wallet-panel">
      <AgreeWarning ref="agreeWarningRef" @cancel="cancelAgreeWarning" @agree="agreeWarning" />
    </div>

    <div v-else-if="isKeplrSupported && !isKeplrInstalled" class="connect-wallet-panel">
      <GetKeplr ref="getKeplrRef" type="welcome" @try-demo="tryDemo" />
    </div>

    <div v-else class="connect-wallet-panel">
      <GetBrowser ref="getBrowserRef" :is-loading="isLoading" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import AgreeWarning from '@/components/account/AgreeWarning.vue';
import ConnectKeplr from '@/components/account/ConnectKeplr.vue';
import GetBrowser from '@/components/account/GetBrowser.vue';
import GetDesktop from '@/components/account/GetDesktop.vue';
import GetKeplr from '@/components/account/GetKeplr.vue';

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
    GetDesktop,
    GetBrowser,
  },

  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const router = useRouter();
    const connectKeplrRef = ref(null);
    const agreeWarningRef = ref(null);
    const getKeplrRef = ref(null);
    const getBrowserRef = ref(null);
    const isKeplrSupported = ref(null);
    const isKeplrInstalled = ref(null);
    const isLoading = ref(true);
    const isMobile = ref(null);
    const isReturnUser = ref(null);
    const isWarningAgreed = ref(null);
    const isWarningNeeded = ref(null);

    const cancelConnectKeplr = () => {
      connectKeplrRef.value.cancel();
      isReturnUser.value = true;
      router.push('/');
    };
    const cancelAgreeWarning = () => {
      isWarningNeeded.value = null;
    };

    const agreeWarning = () => {
      isWarningNeeded.value = false;
      isWarningAgreed.value = true;
    };
    const showWarning = () => {
      isWarningNeeded.value = true;
    };

    // TODO: Implement demo account
    // right now it skips past the welcome flow
    const tryDemo = () => {
      isReturnUser.value = true;
      router.push('/');
    };

    onMounted(async () => {
      isMobile.value = window.matchMedia('only screen and (max-width: 480px)').matches;
      isReturnUser.value = window.localStorage.getItem('isReturnUser');
      isWarningAgreed.value = window.localStorage.getItem('isWarningAgreed');
      isWarningNeeded.value = window.localStorage.getItem('isWarningNeeded');

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
    watch(isWarningNeeded, (newVal: string) => {
      window.localStorage.setItem('isWarningNeeded', newVal);
    });
    watch(isReturnUser, (newVal: string) => {
      window.localStorage.setItem('isReturnUser', newVal);
    });

    return {
      agreeWarning,
      showWarning,
      connectKeplrRef,
      agreeWarningRef,
      getKeplrRef,
      getBrowserRef,
      isLoading,
      isKeplrSupported,
      isKeplrInstalled,
      isMobile,
      isReturnUser,
      isWarningAgreed,
      isWarningNeeded,
      cancelAgreeWarning,
      cancelConnectKeplr,
      tryDemo,
    };
  },
});
</script>

<style lang="scss">
#welcome {
  position: relative;
  overflow: hidden;
  height: 100vh;

  .connect-wallet-panel {
    position: relative;
  }

  .connect-wallet {
    &__wrapper {
      height: 100vh;
      width: 100vw;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__loading {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__content {
      max-width: 512px;
      padding: 4.8rem;
      text-align: center;
    }

    &__controls {
      display: flex;
      flex-direction: column;
      margin-top: 5rem;
      align-items: center;

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
      font-size: 3.4rem;
      line-height: 124.7%;
      font-weight: 700;
      margin-bottom: 1.6rem;
      white-space: normal;
    }

    &.agree-warning {
      .connect-wallet__content {
        padding-left: 0;
        padding-right: 0;
      }
      .connect-wallet__controls {
        flex-direction: row;
        justify-content: space-between;
        margin-top: 3.2rem;

        div + div {
          margin-top: 0;
        }
      }
      .scrollable {
        height: auto;
        border: none;
        padding: 0;
        &:after {
          display: none;
        }
      }
    }
  }

  .connect-banner {
    display: none !important;
  }
  .surfer {
    position: absolute;
    top: 0;
    margin-top: 30vh;
    right: 5vh;
    width: 40vh;
    height: 40vh;
  }

  .portal {
    position: absolute;
    top: 2vh;
    right: 0;
    width: 60vh;
    height: 100vh;
  }
}
@media only screen and (max-width: 768px) {
  #welcome {
    .surfer {
      right: -10vh;
    }
    .portal {
      right: -20vh;
    }
  }
}
@media only screen and (max-width: 480px) {
  #welcome {
    .connect-wallet__content {
      max-width: 100%;
    }
    .surfer {
      margin-top: -3.5vh;
      width: 35vh;
      height: 35vh;
      right: 5vh;
    }
    .portal {
      top: -45vh;
      right: -1vh;
    }
  }
}
</style>
