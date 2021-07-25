<template>
  <div>
    <div class="settings-modal elevation-panel">
      <!-- basic settings -->
      <div v-if="!isAdvancedSettingsOpen" class="settings-modal-basic">
        <p class="settings-modal__label">
          {{ $t('components.settingsMenu.connectedWallet') }}
        </p>
        <div class="connected-wallet">
          <AvatarBalance wallet-name="Keplr" />
          <div class="settings-modal__button" @click="disconnectWallet">
            <span>{{ $t('components.settingsMenu.disconnectWallet') }}</span>
          </div>
        </div>

        <hr class="settings-modal__divider" />

        <div class="settings-modal__button" @click="toggleAdvancedSettings">
          <span>{{ $t('components.settingsMenu.settings') }}</span>
          <Icon name="CaretRightIcon" :icon-size="1.5" />
        </div>

        <hr class="settings-modal__divider" />

        <div>
          <a href="https://t.me/EmerisHQ" target="_blank" class="settings-modal__button">
            <span>{{ $t('components.settingsMenu.support') }}</span>
            <Icon name="ArrowUpIcon" :icon-size="1.5" class="external-icon" />
          </a>

          <a href="https://twitter.com/emerisHQ" target="_blank" class="settings-modal__button">
            <span>{{ $t('components.settingsMenu.twitter') }}</span>
            <Icon name="ArrowUpIcon" :icon-size="1.5" class="external-icon" />
          </a>

          <a href="https://emeris.com" target="_blank" class="settings-modal__button">
            <span>emeris.com</span>
            <Icon name="ArrowUpIcon" :icon-size="1.5" class="external-icon" />
          </a>
        </div>

        <div class="settings-modal__list">
          <router-link to="/" class="settings-modal__list__item">
            {{ $t('components.settingsMenu.privacy') }}
          </router-link>
          <router-link to="/" class="settings-modal__list__item">
            {{ $t('components.settingsMenu.termsOfUse') }}
          </router-link>
          <router-link to="/" class="settings-modal__list__item">
            {{ $t('components.settingsMenu.cookiesPolicy') }}
          </router-link>
        </div>
      </div>
      <!-- end settings-basic-->

      <!-- advanced settings -->
      <div v-else class="settings-modal-advanced">
        <div class="settings-header">
          <div class="settings-header__action" @click="toggleAdvancedSettings">
            <Icon name="ArrowLeftIcon" :icon-size="2" />
          </div>
          <div class="settings-header__title title-1-bold">{{ $t('components.settingsMenu.settings') }}</div>
          <div class="settings-header__action" />
        </div>
        <div class="settings-modal__item">
          <span>{{ $t('components.settingsMenu.theme') }}</span>

          <select v-model="settings.theme" class="settings-modal__button__select">
            <option value="system">{{ $t('components.settingsMenu.system') }}</option>
            <option value="light">{{ $t('components.settingsMenu.light') }}</option>
          </select>
        </div>
        <hr class="settings-modal__divider" />
        <div>
          <p class="settings-modal__label">{{ $t('components.settingsMenu.advancedSettings') }}</p>
          <button class="settings-modal__button" @click="confirmToggleSetting('allowCustomSlippage')">
            <span>{{ $t('components.settingsMenu.allowCustomSlippage') }}</span>
            <Switch v-model="settings.allowCustomSlippage" class="settings-modal__button__switch" />
          </button>
          <!--
          <button class="settings-modal__button" @click="confirmToggleSetting('viewUnverified')">
            <span>{{ $t('components.settingsMenu.viewAllAssets') }}</span>
            <Switch v-model="settings.viewUnverified" class="settings-modal__button__switch" />
          </button>
          <button class="settings-modal__button" @click="confirmToggleSetting('viewLPAssetPools')">
            <span>{{ $t('components.settingsMenu.viewLPAssetPools') }}</span>
            <Switch v-model="settings.viewLPAssetPools" class="settings-modal__button__switch" />
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
      :show-close-button="false"
      :close-on-overlay-click="true"
      width="320px"
      @close="toggleWarningCustomSlippage"
    >
      <div class="warning-modal__icon">
        <Icon name="ExclamationDiskIcon" :icon-size="3.2" />
      </div>
      <div class="warning-modal__title title-1-bold">
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
      :show-close-button="false"
      :close-on-overlay-click="true"
      width="320px"
      @close="toggleWarningViewUnverified"
    >
      <div class="warning-modal__icon">
        <Icon name="ExclamationDiskIcon" :icon-size="3.2" />
      </div>
      <div class="warning-modal__title title-1-bold">
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
      :show-close-button="false"
      :close-on-overlay-click="true"
      width="320px"
      @close="toggleWarningViewLPAssetPools"
    >
      <div class="warning-modal__icon">
        <Icon name="ExclamationDiskIcon" :icon-size="3.2" />
      </div>
      <div class="warning-modal__title title-1-bold">
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
import Icon from '@/components/ui/Icon.vue';
import Modal from '@/components/ui/Modal.vue';
import Switch from '@/components/ui/Switch.vue';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';

export default defineComponent({
  name: 'SettingsModal',
  components: {
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
  position: absolute;
  background: var(--bg);
  border-radius: 1rem;
  min-height: 4.8rem;
  transform: translate(-14rem, 0.8rem);
  width: 28rem;
  z-index: 50;

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.2rem 2.4rem;
    width: 100%;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem 2.4rem;
    width: 100%;
    transition: background ease-in-out 150ms;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 0, 0.03);
    }

    &__switch {
      pointer-events: none;
    }

    &__select {
      background: transparent;
      font-weight: 600;

      &:focus {
        outline: none;
      }
    }
    &:last-child {
      margin-bottom: 0.4rem;
    }
  }

  &__label {
    padding: 0.95rem 2.4rem;
    font-size: 1.3rem;
    font-weight: 400;
    color: var(--muted);
  }

  &__divider {
    margin: 0.4rem 0;
    border-top: 1px solid var(--border);
  }

  &__list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.2rem 2.4rem;
    font-size: 1.2rem;
    color: var(--muted);

    &__item {
      white-space: nowrap;

      &:hover {
        color: var(--text);
      }

      &:after {
        padding: 0 0.7rem;
        content: '\00b7';
      }
      &:last-child:after {
        content: none;
      }
    }
  }
}

.external-icon {
  transform: rotate(45deg);
}
.connected-wallet {
  margin-top: -0.8rem;
}
.settings-header {
  display: flex;
  align-items: center;
  height: 6.4rem;
  padding: 0.8rem;
}
.settings-header__title {
  flex: 1;
  text-align: center;
}
.settings-header__action {
  height: 4.8rem;
  width: 4.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.modal.warning-modal {
  z-index: 51;
}
.warning-modal__icon {
  height: 6.4rem;
  display: flex;
  justify-content: center;
  margin: 0.8rem 0 1.6rem;
}
.warning-modal__title {
  margin-bottom: 2.4rem;
}
.warning-modal__title,
.warning-modal__body {
  text-align: center;
  margin-bottom: 1.6rem;
}
.warning-modal__body p {
  margin-bottom: 1.6rem;
  line-height: 162.5%;
  color: var(--muted);
}
.warning-modal__actions {
  border-top: 1px solid var(--border);
  height: 6.4rem;
  display: flex;
  margin: 3.2rem -2.4rem -2.4rem;
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
