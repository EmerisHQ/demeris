<template>
  <div>
    <div class="settings-modal absolute right-0 bg-surface rounded-2xl w-full sm:w-72 z-50 shadow-panel">
      <!-- basic settings -->
      <div v-if="!isAdvancedSettingsOpen" class="settings-modal-basic">
        <div class="py-2">
          <p class="pt-3 px-6 pb-1 -text-1 text-muted">
            {{ $t('components.settingsMenu.connectedWallet') }}
          </p>
          <AvatarBalance wallet-name="Keplr" />
          <div
            class="flex items-center justify-between h-10 py-2 px-6 w-full cursor-pointer hover:bg-fg"
            @click="disconnectWallet"
          >
            <span>{{ $t('components.settingsMenu.disconnectWallet') }}</span>
          </div>
        </div>

        <hr class="border-t border-border" />

        <div class="py-2">
          <div
            class="flex items-center justify-between h-10 py-2 px-6 w-full cursor-pointer hover:bg-fg"
            @click="toggleAdvancedSettings"
          >
            <span>{{ $t('components.settingsMenu.settings') }}</span>
            <Icon class="text-muted" name="CaretRightIcon" :icon-size="1" />
          </div>
        </div>

        <hr class="border-t border-border" />

        <div class="py-2">
          <a
            href="https://t.me/EmerisHQ"
            target="_blank"
            class="flex items-center justify-between h-10 py-2 px-6 w-full cursor-pointer hover:bg-fg"
          >
            <span>{{ $t('components.settingsMenu.support') }}</span>
            <span>&#8599;</span>
          </a>

          <a
            href="https://twitter.com/emerisHQ"
            target="_blank"
            class="flex items-center justify-between h-10 py-2 px-6 w-full cursor-pointer hover:bg-fg"
          >
            <span>{{ $t('components.settingsMenu.twitter') }}</span>
            <span>&#8599;</span>
          </a>

          <a
            href="https://emeris.com"
            target="_blank"
            class="flex items-center justify-between h-10 py-2 px-6 w-full cursor-pointer hover:bg-fg"
          >
            <span>emeris.com</span>
            <span>&#8599;</span>
          </a>
          <div class="flex items-center justify-center pt-3 pl-6 pr-4 pb-2.5 -text-1 text-muted">
            <router-link to="/" class="settings-modal__list-item white-space-nowrap hover:text-text">
              {{ $t('components.settingsMenu.privacy') }}
            </router-link>
            <router-link to="/" class="settings-modal__list-item white-space-nowrap hover:text-text">
              {{ $t('components.settingsMenu.termsOfUse') }}
            </router-link>
            <router-link to="/" class="settings-modal__list-item white-space-nowrap hover:text-text">
              {{ $t('components.settingsMenu.cookiesPolicy') }}
            </router-link>
          </div>
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
          <div class="flex-grow text-center text-1 font-bold">{{ $t('components.settingsMenu.settings') }}</div>
        </div>
        <label class="flex items-center justify-between h-10 py-2 px-6 w-full">
          <span>{{ $t('components.settingsMenu.theme') }}</span>

          <select v-model="settings.theme" class="bg-transparent font-medium appearance-none outline-none">
            <option value="system">{{ $t('components.settingsMenu.system') }}</option>
            <option value="light">{{ $t('components.settingsMenu.light') }}</option>
          </select>
        </label>
        <hr class="border-t border-border" />
        <div class="py-2">
          <p class="py-3 px-6 -text-1 text-muted">{{ $t('components.settingsMenu.advancedSettings') }}</p>
          <button
            class="flex items-center justify-between h-10 py-2 px-6 w-full cursor-pointer hover:bg-fg"
            @click="confirmToggleSetting('allowCustomSlippage')"
          >
            <span>{{ $t('components.settingsMenu.allowCustomSlippage') }}</span>
            <Switch v-model="settings.allowCustomSlippage" class="pointer-events-none" />
          </button>
          <!--
          <button class="flex items-center justify-between h-10 py-2 px-6 w-full cursor-pointer hover:bg-fg" @click="confirmToggleSetting('viewUnverified')">
            <span>{{ $t('components.settingsMenu.viewAllAssets') }}</span>
            <Switch v-model="settings.viewUnverified" class="pointer-events-none" />
          </button>
          <button class="flex items-center justify-between h-10 py-2 px-6 w-full cursor-pointer hover:bg-fg" @click="confirmToggleSetting('viewLPAssetPools')">
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
      v-show="isWarningCustomSlippageOpen"
      class="warning-modal"
      variant="dialog"
      fullscreen
      :show-close-button="false"
      :close-on-overlay-click="true"
      max-width-class="max-w-xs"
      @close="toggleWarningCustomSlippage"
    >
      <div class="warning-modal__icon">
        <Icon name="ExclamationDiskIcon" :icon-size="1.5" />
      </div>
      <div class="warning-modal__title text-1 font-bold">
        {{ $t('components.settingsMenu.allowCustomSlippage') }}
      </div>
      <div class="warning-modal__body">
        <p>{{ $t('components.settingsMenu.warningCustomSlippage') }}</p>
        <p>{{ $t('components.settingsMenu.warningSignificantLoss') }}</p>
      </div>
      <div class="warning-modal__actions">
        <div class="warning-modal__action" @click="toggleWarningCustomSlippage">Cancel</div>
        <div class="warning-modal__action" @click="toggleSetting('allowCustomSlippage')">Proceed</div>
      </div>
    </Modal>

    <!-- warning modal - view unverified assets -->
    <Modal
      v-show="isWarningViewUnverifiedOpen"
      class="warning-modal"
      variant="dialog"
      fullscreen
      :show-close-button="false"
      :close-on-overlay-click="true"
      max-width-class="max-w-xs"
      @close="toggleWarningViewUnverified"
    >
      <div class="warning-modal__icon">
        <Icon name="ExclamationDiskIcon" :icon-size="1.5" />
      </div>
      <div class="warning-modal__title text-1 font-bold">
        {{ $t('components.settingsMenu.viewAllAssets') }}
      </div>
      <div class="warning-modal__body">
        <p>{{ $t('components.settingsMenu.warningViewUnverified') }}</p>
        <p>{{ $t('components.settingsMenu.warningSignificantLoss') }}</p>
      </div>
      <div class="warning-modal__actions">
        <div class="warning-modal__action" @click="toggleWarningViewUnverified">Cancel</div>
        <div class="warning-modal__action" @click="toggleSetting('viewUnverified')">Proceed</div>
      </div>
    </Modal>

    <!-- warning modal - view lp asset pools -->
    <Modal
      v-show="isWarningViewLPAssetPoolsOpen"
      class="warning-modal"
      variant="dialog"
      fullscreen
      :show-close-button="false"
      :close-on-overlay-click="true"
      max-width-class="max-w-xs"
      @close="toggleWarningViewLPAssetPools"
    >
      <div class="warning-modal__icon">
        <Icon name="ExclamationDiskIcon" :icon-size="1.5" />
      </div>
      <div class="warning-modal__title text-1 font-bold">
        {{ $t('components.settingsMenu.viewLPAssetPools') }}
      </div>
      <div class="warning-modal__body">
        <p>{{ $t('components.settingsMenu.warningLPAssetPools') }}</p>
        <p>{{ $t('components.settingsMenu.warningSignificantLoss') }}</p>
      </div>
      <div class="warning-modal__actions">
        <div class="warning-modal__action" @click="toggleWarningViewLPAssetPools">Cancel</div>
        <div class="warning-modal__action" @click="toggleSetting('viewLPAssetPools')">Proceed</div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { useStore } from 'vuex';

import AvatarBalance from '@/components/account/AvatarBalance.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import Modal from '@/components/ui/Modal.vue';
import Switch from '@/components/ui/Switch.vue';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';

export default defineComponent({
  name: 'SettingsModal',
  components: {
    Button,
    Icon,
    Modal,
    Switch,
    AvatarBalance,
  },
  setup() {
    const store = useStore();
    const isAdvancedSettingsOpen = ref(false);
    const isWarningCustomSlippageOpen = ref(false);
    const isWarningViewUnverifiedOpen = ref(false);
    const isWarningViewLPAssetPoolsOpen = ref(false);

    const toggleAdvancedSettings = () => (isAdvancedSettingsOpen.value = !isAdvancedSettingsOpen.value);
    const toggleWarningCustomSlippage = () => (isWarningCustomSlippageOpen.value = !isWarningCustomSlippageOpen.value);
    const toggleWarningViewUnverified = () => (isWarningViewUnverifiedOpen.value = !isWarningViewUnverifiedOpen.value);
    const toggleWarningViewLPAssetPools = () =>
      (isWarningViewLPAssetPoolsOpen.value = !isWarningViewLPAssetPoolsOpen.value);

    const updateSession = (key: string, value: any) => {
      store.dispatch(GlobalDemerisActionTypes.SET_SESSION_DATA, { data: { [key]: value } });
    };

    const settings = reactive({
      theme: 'system',
      allowCustomSlippage: computed({
        get: () => store.getters['demeris/allowCustomSlippage'],
        set: (value: boolean) => updateSession('customSlippage', value),
      }),
      viewUnverified: computed({
        get: () => store.getters['demeris/viewUnverified'],
        set: (value: boolean) => updateSession('viewUnverified', value),
      }),
      viewLPAssetPools: computed({
        get: () => store.getters['demeris/viewLPAssetPools'],
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
      window.localStorage.setItem('lastEmerisSession', '');
      location.reload();
    };

    return {
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
    };
  },
});
</script>

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
.modal.warning-modal {
  z-index: 51;
}
.warning-modal__icon {
  height: 4rem;
  display: flex;
  justify-content: center;
  margin: 0.5rem 0 1rem;
}
.warning-modal__title {
  margin-bottom: 1.5rem;
}
.warning-modal__title,
.warning-modal__body {
  text-align: center;
  margin-bottom: 1rem;
}
.warning-modal__body p {
  margin-bottom: 1rem;
  line-height: 162.5%;
  color: var(--muted);
}
.warning-modal__actions {
  border-top: 1px solid var(--border);
  height: 4rem;
  display: flex;
  margin: 2rem -1.5rem -1.5rem;
}
.warning-modal__action {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.warning-modal__action:hover {
  cursor: pointer;
}
.warning-modal__action:not(:last-child) {
  border-right: 1px solid var(--border);
}
</style>
