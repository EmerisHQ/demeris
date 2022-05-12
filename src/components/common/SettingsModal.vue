<template>
  <div>
    <div class="settings-modal absolute right-0 bg-surface rounded-2xl w-full sm:w-72 z-40 shadow-panel">
      <!-- basic settings -->
      <div v-if="!isAdvancedSettingsOpen" class="settings-modal-basic">
        <div class="py-2">
          <p class="pt-3 px-6 pb-1 -text-1 text-muted">
            {{ $t('components.settingsMenu.connectedWallet') }}
          </p>
          <AvatarBalance wallet-name="Keplr" />
          <div class="menu-item" @click="disconnectWallet">
            <span v-if="isDemoAccount">{{ $t('components.settingsMenu.connectWallet') }}</span>
            <span v-else>{{ $t('components.settingsMenu.disconnectWallet') }}</span>
          </div>
        </div>

        <hr class="border-t border-border" />

        <div class="py-2">
          <div class="menu-item" @click="toggleAdvancedSettings">
            <span>{{ $t('components.settingsMenu.settings') }}</span>
            <Icon class="text-muted" name="CaretRightIcon" :icon-size="1" />
          </div>
        </div>

        <hr class="border-t border-border" />

        <div class="py-2">
          <a href="https://support.emeris.com" target="_blank" class="menu-item">
            <span>{{ $t('components.settingsMenu.support') }}</span>
            <span>&#8599;</span>
          </a>

          <a href="https://t.me/EmerisHQ" target="_blank" class="menu-item">
            <span>{{ $t('components.settingsMenu.telegram') }}</span>
            <span>&#8599;</span>
          </a>

          <a href="https://twitter.com/emerisHQ" target="_blank" class="menu-item">
            <span>{{ $t('components.settingsMenu.twitter') }}</span>
            <span>&#8599;</span>
          </a>

          <a href="https://emeris.com" target="_blank" class="menu-item">
            <span>emeris.com</span>
            <span>&#8599;</span>
          </a>
        </div>

        <hr class="border-t border-border" />

        <div class="py-2">
          <span class="flex items-center justify-between h-10 py-2 px-6 w-full">
            <span>{{ $t('components.settingsMenu.version') }}</span>
            <span class="text-muted -text-1">v{{ appVersion }}-{{ gitVersion }}</span>
          </span>
        </div>

        <div class="flex items-center justify-center pt-3 pl-6 pr-4 pb-2.5 -text-1 text-muted">
          <a
            href="https://emeris.com/privacy"
            class="settings-modal__list-item white-space-nowrap hover:text-text"
            rel="noopener noreferrer"
            target="_blank"
          >
            {{ $t('components.settingsMenu.privacy') }}
          </a>
          <a
            href="https://emeris.com/terms"
            class="settings-modal__list-item white-space-nowrap hover:text-text"
            rel="noopener noreferrer"
            target="_blank"
          >
            {{ $t('components.settingsMenu.tos') }}
          </a>
          <!--
          <a
            href="https://www.cookiesandyou.com/"
            class="settings-modal__list-item white-space-nowrap hover:text-text"
            rel="noopener noreferrer"
            target="_blank"
          >
            {{ $t('components.settingsMenu.cookiesPolicy') }}
          </a>
          -->
        </div>
      </div>
      <!-- end settings-basic-->

      <!-- advanced settings -->
      <div v-else class="settings-modal-advanced pb-2">
        <div class="flex items-center h-16 py-2 pl-6 pr-12">
          <Button
            :click-function="
              () => {
                toggleAdvancedSettings();
              }
            "
            variant="link"
          >
            <Icon name="ArrowLeftIcon" :icon-size="1.5" />
          </Button>
          <div class="grow text-center text-1 font-bold">{{ $t('components.settingsMenu.settings') }}</div>
        </div>
        <label class="flex items-center justify-between h-10 py-2 px-6 w-full">
          <span>{{ $t('components.settingsMenu.theme') }}</span>

          <select
            v-model="settings.theme"
            class="bg-transparent font-medium appearance-none outline-none dark:bg-surface"
          >
            <option value="system">{{ $t('components.settingsMenu.system') }}</option>
            <option value="light">{{ $t('components.settingsMenu.light') }}</option>
            <option value="dark">{{ $t('components.settingsMenu.dark') }}</option>
          </select>
        </label>
        <hr class="border-t border-border" />
        <div class="py-2">
          <p class="py-3 px-6 -text-1 text-muted">{{ $t('components.settingsMenu.advancedSettings') }}</p>
          <div class="flex items-center justify-between h-10 py-2 px-6 w-full">
            <span>{{ $t('components.settingsMenu.setGasLimit') }}</span>
            <AmountInput v-model="settings.gasLimit" :max-decimals="0" class="w-1/2 text-right bg-transparent" />
          </div>
          <button class="menu-item" @click="confirmToggleSetting('allowCustomSlippage')">
            <span>{{ $t('components.settingsMenu.allowCustomSlippage') }}</span>
            <Switch v-model="settings.allowCustomSlippage" class="pointer-events-none" />
          </button>
          <!--
          <button class="menu-item" @click="confirmToggleSetting('viewUnverified')">
            <span>{{ $t('components.settingsMenu.viewAllAssets') }}</span>
            <Switch v-model="settings.viewUnverified" class="pointer-events-none" />
          </button>
          <button class="menu-item" @click="confirmToggleSetting('viewLPAssetPools')">
            <span>{{ $t('components.settingsMenu.viewLPAssetPools') }}</span>
            <Switch v-model="settings.viewLPAssetPools" class="pointer-events-none" />
          </button>
          -->
        </div>
      </div>
      <!-- end advanced settings -->
    </div>

    <!-- warning modal - custom slippage -->
    <Modal
      v-if="isWarningCustomSlippageOpen"
      class="text-center z-40"
      variant="dialog"
      fullscreen
      :show-close-button="false"
      :close-on-overlay-click="true"
      @close="toggleWarningCustomSlippage"
    >
      <Icon name="ExclamationIcon" :icon-size="2" class="mb-8 text-warning" />
      <div class="text-1 font-bold">
        {{ $t('components.settingsMenu.allowCustomSlippage') }}
      </div>
      <div class="mt-4 text-0 leading-copy text-muted space-y-4">
        <p>{{ $t('components.settingsMenu.warningCustomSlippage') }}</p>
        <p>{{ $t('components.settingsMenu.warningSignificantLoss') }}</p>
      </div>
      <template #buttons>
        <ModalButton
          name="Cancel"
          :click-function="
            () => {
              toggleWarningCustomSlippage();
            }
          "
        />
        <ModalButton
          name="Proceed"
          :click-function="
            () => {
              toggleSetting('allowCustomSlippage');
            }
          "
        />
      </template>
    </Modal>

    <!-- warning modal - view unverified assets -->
    <Modal
      v-if="isWarningViewUnverifiedOpen"
      class="text-center z-40"
      variant="dialog"
      fullscreen
      :show-close-button="false"
      :close-on-overlay-click="true"
      @close="toggleWarningViewUnverified"
    >
      <Icon name="ExclamationIcon" :icon-size="2" class="mb-8 text-warning" />
      <div class="text-1 font-bold">
        {{ $t('components.settingsMenu.viewAllAssets') }}
      </div>
      <div class="mt-4 text-0 leading-copy text-muted space-y-4">
        <p>{{ $t('components.settingsMenu.warningViewUnverified') }}</p>
        <p>{{ $t('components.settingsMenu.warningSignificantLoss') }}</p>
      </div>
      <template #buttons>
        <ModalButton
          name="Cancel"
          :click-function="
            () => {
              toggleWarningViewUnverified();
            }
          "
        />
        <ModalButton
          name="Proceed"
          :click-function="
            () => {
              toggleSetting('viewUnverified');
            }
          "
        />
      </template>
    </Modal>

    <!-- warning modal - view lp asset pools -->
    <Modal
      v-if="isWarningViewLPAssetPoolsOpen"
      class="text-center z-40"
      variant="dialog"
      fullscreen
      :show-close-button="false"
      :close-on-overlay-click="true"
      @close="toggleWarningViewLPAssetPools"
    >
      <Icon name="ExclamationIcon" :icon-size="2" class="mb-8 text-warning" />
      <div class="text-1 font-bold">
        {{ $t('components.settingsMenu.viewLPAssetPools') }}
      </div>
      <div class="mt-4 text-0 leading-copy text-muted space-y-4">
        <p>{{ $t('components.settingsMenu.warningLPAssetPools') }}</p>
        <p>{{ $t('components.settingsMenu.warningSignificantLoss') }}</p>
      </div>
      <template #buttons>
        <ModalButton
          name="Cancel"
          :click-function="
            () => {
              toggleWarningViewLPAssetPools();
            }
          "
        />
        <ModalButton
          name="Proceed"
          :click-function="
            () => {
              toggleSetting('viewLPAssetPools');
            }
          "
        />
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { computed, defineComponent, reactive, ref } from 'vue';

import AvatarBalance from '@/components/account/AvatarBalance.vue';
import AmountInput from '@/components/ui/AmountInput.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import Modal from '@/components/ui/Modal.vue';
import ModalButton from '@/components/ui/ModalButton.vue';
import Switch from '@/components/ui/Switch.vue';
import useTheme from '@/composables/useTheme';
import { walletActionHandler } from '@/features/extension/WalletActionHandler';
import { GlobalActionTypes, GlobalGetterTypes } from '@/store';
import { featureRunning } from '@/utils/FeatureManager';
import { useStore } from '@/utils/useStore';

export default defineComponent({
  name: 'SettingsModal',
  components: {
    AmountInput,
    AvatarBalance,
    Button,
    Icon,
    Modal,
    ModalButton,
    Switch,
  },
  emits: ['disconnect', 'connect'],
  setup(_, { emit }) {
    const gitVersion = import.meta.env.VITE_GIT_VERSION;
    const appVersion = import.meta.env.VITE_VERSION;

    const store = useStore();
    const theme = useTheme();

    const isAdvancedSettingsOpen = ref(false);
    const isWarningCustomSlippageOpen = ref(false);
    const isWarningViewUnverifiedOpen = ref(false);
    const isWarningViewLPAssetPoolsOpen = ref(false);
    const isDemoAccount = computed(() => {
      return store.getters[GlobalGetterTypes.USER.isDemoAccount];
    });
    const toggleAdvancedSettings = () => (isAdvancedSettingsOpen.value = !isAdvancedSettingsOpen.value);
    const toggleWarningCustomSlippage = () => (isWarningCustomSlippageOpen.value = !isWarningCustomSlippageOpen.value);
    const toggleWarningViewUnverified = () => (isWarningViewUnverifiedOpen.value = !isWarningViewUnverifiedOpen.value);
    const toggleWarningViewLPAssetPools = () =>
      (isWarningViewLPAssetPoolsOpen.value = !isWarningViewLPAssetPoolsOpen.value);

    const updateSession = (key: string, value: any) => {
      store.dispatch(GlobalActionTypes.USER.SET_SESSION_DATA, { data: { [key]: value } });
    };

    const settings = reactive({
      theme,
      gasLimit: computed({
        get: () => store.getters[GlobalGetterTypes.USER.getGasLimit],
        set: (value: number) => {
          store.dispatch(GlobalActionTypes.USER.SET_GAS_LIMIT, { gasLimit: value });
        },
      }),
      allowCustomSlippage: computed({
        get: () => store.getters[GlobalGetterTypes.USER.allowCustomSlippage],
        set: (value: boolean) => updateSession('allowCustomSlippage', value),
      }),
      viewUnverified: computed({
        get: () => store.getters[GlobalGetterTypes.USER.viewUnverified],
        set: (value: boolean) => updateSession('viewUnverified', value),
      }),
      viewLPAssetPools: computed({
        get: () => store.getters[GlobalGetterTypes.USER.viewLPAssetPools],
        set: (value: boolean) => updateSession('viewLPAssetPools', value),
      }),
    });

    const toggleWarningModals = (key: string) => {
      switch (key) {
        case 'allowCustomSlippage':
          toggleWarningCustomSlippage();
          break;
        case 'viewUnverified':
          toggleWarningViewUnverified();
          break;
        case 'viewLPAssetPools':
          toggleWarningViewLPAssetPools();
          break;
        default:
          break;
      }
    };

    const confirmToggleSetting = (key: string) => {
      if (!settings[key]) {
        toggleWarningModals(key);
      } else {
        settings[key] = !settings[key];
      }
    };

    const toggleSetting = (key: string) => {
      toggleWarningModals(key);
      settings[key] = !settings[key];
    };

    const disconnectWallet = () => {
      if (isDemoAccount.value) {
        emit('connect');
      } else {
        emit('disconnect');
        walletActionHandler.disconnect();
        if (featureRunning('USE_EMERIS_EXTENSION')) {
          walletActionHandler.clearLastSession();
        } else {
          window.localStorage.setItem('lastEmerisSession', '');
        }
        store.dispatch(GlobalActionTypes.USER.SIGN_IN_WITH_WATCHER);
      }
    };

    return {
      appVersion,
      gitVersion,
      settings,
      confirmToggleSetting,
      toggleSetting,
      isAdvancedSettingsOpen,
      isWarningCustomSlippageOpen,
      isWarningViewUnverifiedOpen,
      isWarningViewLPAssetPoolsOpen,
      toggleAdvancedSettings,
      toggleWarningCustomSlippage,
      toggleWarningViewUnverified,
      toggleWarningViewLPAssetPools,
      disconnectWallet,
      isDemoAccount,
    };
  },
});
</script>

<style>
.menu-item {
  @apply flex items-center justify-between h-10 py-2 px-6 w-full cursor-pointer hover:bg-fg;
}
</style>

<style lang="scss">
.settings-modal {
  min-height: 3rem;
  // transform: translate(-8.75rem, 0.5rem);

  &__list-item {
    &:after {
      padding: 0 0.25rem;
      content: '\00b7';
    }
    &:last-child:after {
      content: none;
    }
  }
}
</style>
