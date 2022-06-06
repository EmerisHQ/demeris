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

    <div v-if="isMobile" class="welcome-modal__bg">
      <img class="portal" src="@/assets/svg/portal.svg" />
      <img class="surfer" src="@/assets/images/surfer.png" />
      <div class="welcome-modal__fg">
        <GetDesktop ref="getDesktopRef" />
      </div>
    </div>

    <div
      v-show="
        ((isEmerisSupported && isKeplrInstalled && !isWarningNeeded) ||
          (isEmerisSupported && isKeplrInstalled && isWarningAgreed)) &&
        !isMobile
      "
      class="welcome-modal__bg"
    >
      <img class="portal" src="@/assets/svg/portal.svg" />
      <img class="surfer" src="@/assets/images/surfer.png" />
      <div class="welcome-modal__fg">
        <ConnectWallet
          ref="connectKeplrRef"
          type="welcome"
          @connect="cancelConnectWallet"
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

    <div v-show="isEmerisSupported && !isKeplrInstalled && !isMobile" class="welcome-modal__bg">
      <img class="portal" src="@/assets/svg/portal.svg" />
      <img class="surfer" src="@/assets/images/surfer.png" />
      <div class="welcome-modal__fg">
        <GetKeplr ref="getKeplrRef" type="welcome" @try-demo="tryDemo" @connect="cancelConnectWallet" />
      </div>
    </div>

    <div v-show="!isEmerisSupported && !isMobile" class="welcome-modal__bg">
      <img class="portal" src="@/assets/svg/portal.svg" />
      <img class="surfer" src="@/assets/images/surfer.png" />
      <div class="welcome-modal__fg">
        <GetBrowser ref="getBrowserRef" type="welcome" :is-loading="isLoading" @try-demo="tryDemo" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, toRefs, watch } from 'vue';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';

import AgreeWarning from '@/components/account/AgreeWarning.vue';
import ConnectWallet from '@/components/account/ConnectWallet.vue';
import GetBrowser from '@/components/account/GetBrowser.vue';
import GetDesktop from '@/components/account/GetDesktop.vue';
import GetKeplr from '@/components/account/GetKeplr.vue';
import Brandmark from '@/components/common/Brandmark.vue';
import { pageview } from '@/utils/analytics';

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
  originUrl: string;
}

const props = withDefaults(defineProps<Props>(), { open: false });

useMeta({ title: '' });
pageview({ page_title: 'Welcome Page', page_path: '/welcome' });
const router = useRouter();
const { originUrl } = toRefs(props);
const connectKeplrRef = ref(null);
const connectWalletType = ref(null);
const agreeWarningRef = ref(null);
const getKeplrRef = ref(null);
const getBrowserRef = ref(null);
const isEmerisSupported = ref(null);
const isKeplrInstalled = ref(null);
const isLoading = ref(true);
const isMobile = ref(null);
const isReturnUser = ref(null);
const isWarningAgreed = ref(null);
const isWarningNeeded = ref(null);

const goBackToOrigin = () => {
  router.push(originUrl.value ?? '/');
};

const cancelConnectWallet = () => {
  connectKeplrRef.value?.cancel();
  isReturnUser.value = true;
  goBackToOrigin();
};
const cancelAgreeWarning = () => {
  isWarningNeeded.value = null;
};

const agreeWarning = () => {
  isWarningNeeded.value = false;
  isWarningAgreed.value = true;
  connectKeplrRef.value.signIn(connectWalletType.value);
};

const showWarning = (walletType) => {
  connectWalletType.value = walletType;
  isWarningNeeded.value = true;
};

// TODO: Implement demo account
// right now it skips past the welcome flow
const tryDemo = () => {
  isReturnUser.value = true;
  goBackToOrigin();
};

onMounted(async () => {
  isMobile.value = window.matchMedia('only screen and (max-width: 480px)').matches;
  isReturnUser.value = window.localStorage.getItem('isReturnUser');
  isWarningAgreed.value = window.localStorage.getItem('isWarningAgreed');
  isWarningNeeded.value = window.localStorage.getItem('isWarningNeeded');

  // @ts-ignore
  let isChromium = window.chrome;
  let winNav = window.navigator;
  let vendorName = winNav.vendor;
  // @ts-ignore
  // let isBrave = typeof navigator.brave !== 'undefined';
  // @ts-ignore
  let isOpera = typeof window.opr !== 'undefined';
  // let isIEedge = winNav.userAgent.indexOf('Edg') > -1;

  isEmerisSupported.value =
    isChromium !== null &&
    typeof isChromium !== 'undefined' &&
    vendorName === 'Google Inc.' &&
    // isBrave === false &&
    // isIEedge === false &&
    isOpera === false;

  // dont present spinner forever if not Chromium
  if (!isEmerisSupported.value) {
    isLoading.value = false;
  }

  await getKeplrInstance();
  await nextTick();

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
