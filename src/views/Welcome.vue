<template>
  <main class="welcome">
    <header class="welcome__header">
      <div class="welcome__header__logo">
        <Brandmark />
      </div>

      <div class="welcome__header__controls">
        <a title="Emeris" class="welcome__header__controls__link" href="https://emeris.com" target="_blank">
          emeris.com ↗️
        </a>
      </div>
    </header>

    <div v-show="isMobile" class="welcome-modal__bg">
      <img class="portal" src="@/assets/svg/portal.svg" />
      <img class="surfer" src="@/assets/images/surfer.png" />
      <div class="welcome-modal__fg">
        <GetDesktop ref="getDesktopRef" />
      </div>
    </div>

    <div
      v-show="((isKeplrInstalled && !isWarningNeeded) || (isKeplrInstalled && isWarningAgreed)) && !isMobile"
      class="welcome-modal__bg"
    >
      <img class="portal" src="@/assets/svg/portal.svg" />
      <img class="surfer" src="@/assets/images/surfer.png" />
      <div class="welcome-modal__fg">
        <ConnectKeplr
          ref="connectKeplrRef"
          type="welcome"
          @connect="cancelConnectKeplr"
          @warning="showWarning"
          @try-demo="tryDemo"
        />
      </div>
    </div>

    <div v-show="isWarningNeeded && !isWarningAgreed && !isMobile" class="welcome-modal__bg">
      <img class="portal" src="@/assets/svg/portal.svg" />
      <img class="surfer" src="@/assets/images/surfer.png" />
      <div class="welcome-modal__fg">
        <AgreeWarning ref="agreeWarningRef" @cancel="cancelAgreeWarning" @agree="agreeWarning" />
      </div>
    </div>

    <div v-show="isKeplrSupported && !isKeplrInstalled && !isMobile" class="welcome-modal__bg">
      <img class="portal" src="@/assets/svg/portal.svg" />
      <img class="surfer" src="@/assets/images/surfer.png" />
      <div class="welcome-modal__fg">
        <GetKeplr ref="getKeplrRef" type="welcome" @try-demo="tryDemo" />
      </div>
    </div>

    <div v-show="!isKeplrSupported && !isMobile" class="welcome-modal__bg">
      <img class="portal" src="@/assets/svg/portal.svg" />
      <img class="surfer" src="@/assets/images/surfer.png" />
      <div class="welcome-modal__fg">
        <GetBrowser ref="getBrowserRef" type="welcome" :is-loading="isLoading" @try-demo="tryDemo" />
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import AgreeWarning from '@/components/account/AgreeWarning.vue';
import ConnectKeplr from '@/components/account/ConnectKeplr.vue';
import GetBrowser from '@/components/account/GetBrowser.vue';
import GetDesktop from '@/components/account/GetDesktop.vue';
import GetKeplr from '@/components/account/GetKeplr.vue';
import Brandmark from '@/components/common/Brandmark.vue';

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
    Brandmark,
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
      connectKeplrRef.value.signIn();
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
.welcome {
  position: relative;

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

  &__header {
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;

    &__controls {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .welcome-modal__bg {
    position: relative;
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    overflow: hidden;
  }

  .welcome-modal__fg {
    max-width: 34rem;
    position: relative;
    z-index: 11;
    background: linear-gradient(to right, var(--bg), var(--transparent));

    .agree-warning {
      .scrollable {
        height: auto;
        border: none;
        padding: 0;
        &:after {
          display: none;
        }
        .scrollable-content {
          padding: 0;
        }
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .welcome {
    .surfer {
      right: -10vh;
    }
    .portal {
      right: -20vh;
    }
  }
}

@media only screen and (max-width: 480px) {
  .welcome {
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
