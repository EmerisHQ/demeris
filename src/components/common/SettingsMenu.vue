<template>
  <div ref="menuRef" class="settings-menu" :class="{ 'settings-menu--open': isOpen }">
    <button class="settings-menu__button" @click="toggleOpen">
      <Icon name="MenuIcon" :icon-size="1" class="settings-menu__button__icon" />
    </button>

    <div v-show="isOpen" class="settings-menu__dropdown shadow-panel rounded-2xl">
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
          <Icon name="ArrowUpIcon" :icon-size="1" class="external-icon" />
        </a>

        <a href="https://twitter.com/emerisHQ" target="_blank" class="settings-menu__dropdown__button">
          <span>{{ $t('components.settingsMenu.twitter') }}</span>
          <Icon name="ArrowUpIcon" :icon-size="1" class="external-icon" />
        </a>

        <a href="https://emeris.com" target="_blank" class="settings-menu__dropdown__button">
          <span>emeris.com</span>
          <Icon name="ArrowUpIcon" :icon-size="1" class="external-icon" />
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useStore } from 'vuex';

import Icon from '@/components/ui/Icon.vue';
import Switch from '@/components/ui/Switch.vue';
import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';

export default defineComponent({
  components: {
    Icon,
    Switch,
  },
  setup() {
    const store = useStore() as RootStoreTyped;
    const menuRef = ref(null);

    const isOpen = ref(false);
    const toggleOpen = () => (isOpen.value = !isOpen.value);

    const updateSession = (key: string, value: any) => {
      store.dispatch(GlobalActionTypes.USER.SET_SESSION_DATA, { data: { [key]: value } });
    };

    const settings = reactive({
      theme: 'system',
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

    const toggleSetting = (key: string) => {
      settings[key] = !settings[key];
    };

    const clickOutsideListener = (event: Event) => {
      if (event.composedPath().includes(menuRef.value)) {
        return;
      }

      isOpen.value = false;
    };

    onMounted(() => {
      window.addEventListener('pointerdown', clickOutsideListener);
    });

    onUnmounted(() => {
      window.removeEventListener('pointerdown', clickOutsideListener);
    });

    return {
      isOpen,
      menuRef,
      settings,
      toggleOpen,
      toggleSetting,
    };
  },
});
</script>

<style lang="scss">
.settings-menu {
  &--open &__button {
    background: var(--fg);
  }

  &__button {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 100ms linear;

    &:hover {
      background: var(--fg);
    }
  }

  &__dropdown {
    position: absolute;
    background: var(--bg);
    border-radius: 0.625rem;
    min-width: min-content;
    min-height: 3rem;
    transform: translate(-9.375rem, 1rem);
    z-index: 50;

    &__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.5rem;
      width: 100%;
    }

    &__button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.5rem;
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
      padding: 0.75rem 1.5rem;
      font-size: 0.8125rem;
      color: var(--muted);
    }

    &__divider {
      margin: 0.3125rem 0;
      border-top: 1px solid var(--border);
    }

    &__list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.5rem;
      font-size: 0.8125rem;
      color: var(--muted);

      &__item {
        white-space: nowrap;

        &:hover {
          color: var(--text);
        }

        &:after {
          padding: 0 0.4375rem;
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
