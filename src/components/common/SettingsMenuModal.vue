<template>
  <div class="settings-menu__dropdown elevation-panel">
    <div class="settings-menu__dropdown__item">
      <span>{{ $t('components.settingsMenu.theme') }}</span>

      <select v-model="settings.theme" class="settings-menu__dropdown__button__select">
        <option value="system">{{ $t('components.settingsMenu.system') }}</option>
        <option value="light">{{ $t('components.settingsMenu.light') }}</option>
      </select>
    </div>

    <hr class="settings-menu__dropdown__divider" />

    <div>
      <p class="settings-menu__dropdown__label">{{ $t('components.settingsMenu.advancedSettings') }}</p>
      <button class="settings-menu__dropdown__button" @click="toggleSetting('allowCustomSlippage')">
        <span>{{ $t('components.settingsMenu.customSlippage') }}</span>
        <Switch v-model="settings.allowCustomSlippage" class="settings-menu__dropdown__button__switch" />
      </button>
      <button class="settings-menu__dropdown__button" @click="toggleSetting('viewUnverified')">
        <span>{{ $t('components.settingsMenu.viewAllAssets') }}</span>
        <Switch v-model="settings.viewUnverified" class="settings-menu__dropdown__button__switch" />
      </button>
      <button class="settings-menu__dropdown__button" @click="toggleSetting('viewLPAssetPools')">
        <span>{{ $t('components.settingsMenu.lpAssetPool') }}</span>
        <Switch v-model="settings.viewLPAssetPools" class="settings-menu__dropdown__button__switch" />
      </button>
    </div>

    <hr class="settings-menu__dropdown__divider" />

    <div>
      <a href="https://cosmos.network" target="_blank" class="settings-menu__dropdown__button">
        <span>{{ $t('components.settingsMenu.support') }}</span>
        <Icon name="ArrowUpIcon" :icon-size="1.5" class="external-icon" />
      </a>

      <a href="https://twitter.com/emerisHQ" target="_blank" class="settings-menu__dropdown__button">
        <span>{{ $t('components.settingsMenu.twitter') }}</span>
        <Icon name="ArrowUpIcon" :icon-size="1.5" class="external-icon" />
      </a>

      <a href="https://emeris.com" target="_blank" class="settings-menu__dropdown__button">
        <span>emeris.com</span>
        <Icon name="ArrowUpIcon" :icon-size="1.5" class="external-icon" />
      </a>
    </div>

    <div class="settings-menu__dropdown__list">
      <router-link to="/" class="settings-menu__dropdown__list__item">
        {{ $t('components.settingsMenu.privacy') }}
      </router-link>
      <router-link to="/" class="settings-menu__dropdown__list__item">
        {{ $t('components.settingsMenu.termsOfUse') }}
      </router-link>
      <router-link to="/" class="settings-menu__dropdown__list__item">
        {{ $t('components.settingsMenu.cookiesPolicy') }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { useStore } from 'vuex';

import Icon from '@/components/ui/Icon.vue';
import Switch from '@/components/ui/Switch.vue';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';

export default defineComponent({
  components: {
    Icon,
    Switch,
  },
  setup() {
    const store = useStore();
    const menuRef = ref(null);

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

    return {
      menuRef,
      settings,
      toggleSetting,
    };
  },
});
</script>

<style lang="scss">
.settings-menu {
  &--open &__button {
    background: var(--fg-trans);
  }

  &__button {
    width: 4rem;
    height: 4rem;
    border-radius: 2.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 100ms linear;

    &:hover {
      background: var(--fg-trans);
    }
  }

  &__dropdown {
    position: absolute;
    background: var(--bg);
    border-radius: 1rem;
    min-width: min-content;
    min-height: 4.8rem;
    transform: translate(-15rem, 1.6rem);
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
    }

    &__label {
      padding: 1.2rem 2.4rem;
      font-size: 1.2rem;
      color: var(--muted);
    }

    &__divider {
      margin: 0.5rem 0;
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
}
</style>
