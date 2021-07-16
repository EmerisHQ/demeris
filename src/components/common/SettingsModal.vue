<template>
  <div class="settings-modal elevation-panel">
    <!-- basic settings -->
    <div v-if="!isAdvancedSettingsOpen" class="settings-modal-basic">
      <div class="connected-wallet">
        <div class="connected-wallet__label">
          {{ $t('components.settingsMenu.connectedWallet') }}
        </div>
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
      <div class="modal-header">
        <div class="modal-header__action" @click="toggleAdvancedSettings">
          <Icon name="ArrowLeftIcon" :icon-size="2" />
        </div>
        <div class="modal-header__title title-1-bold">{{ $t('components.settingsMenu.settings') }}</div>
        <div class="modal-header__action" />
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
        <button class="settings-modal__button" @click="toggleSetting('allowCustomSlippage')">
          <span>{{ $t('components.settingsMenu.customSlippage') }}</span>
          <Switch v-model="settings.allowCustomSlippage" class="settings-modal__button__switch" />
        </button>
        <button class="settings-modal__button" @click="toggleSetting('viewUnverified')">
          <span>{{ $t('components.settingsMenu.viewAllAssets') }}</span>
          <Switch v-model="settings.viewUnverified" class="settings-modal__button__switch" />
        </button>
        <button class="settings-modal__button" @click="toggleSetting('viewLPAssetPools')">
          <span>{{ $t('components.settingsMenu.lpAssetPool') }}</span>
          <Switch v-model="settings.viewLPAssetPools" class="settings-modal__button__switch" />
        </button>
      </div>
    </div>
    <!-- end advanced settings -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { useStore } from 'vuex';

import AvatarBalance from '@/components/account/AvatarBalance.vue';
import Icon from '@/components/ui/Icon.vue';
import Switch from '@/components/ui/Switch.vue';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';

export default defineComponent({
  name: 'SettingsModal',
  components: {
    Icon,
    Switch,
    AvatarBalance,
  },
  setup() {
    const store = useStore();
    const isAdvancedSettingsOpen = ref(false);
    const toggleAdvancedSettings = () => (isAdvancedSettingsOpen.value = !isAdvancedSettingsOpen.value);

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

    const toggleSetting = (key: string) => {
      settings[key] = !settings[key];
    };

    const disconnectWallet = () => {
      window.alert('TODO: Disconnect wallet');
    };

    return {
      settings,
      toggleSetting,
      isAdvancedSettingsOpen,
      toggleAdvancedSettings,
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
    padding: 1.2rem 2.4rem;
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
    padding: 1.2rem 2.4rem;
    font-size: 1.2rem;
    color: var(--muted);
  }

  &__divider {
    margin: 0.4rem 0;
    border-top: 1px solid var(--border-trans);
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
.connected-wallet__label {
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--muted);
  line-height: 1.6rem;
  padding: 1.6rem 2.4rem 0.4rem;
}
.modal-header {
  display: flex;
  align-items: center;
  height: 6.4rem;
  padding: 0.8rem;
}
.modal-header__title {
  flex: 1;
  text-align: center;
}
.modal-header__action {
  height: 4.8rem;
  width: 4.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
