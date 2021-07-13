<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

import Icon from '@/components/ui/Icon.vue';
import Switch from '@/components/ui/Switch.vue';

export default defineComponent({
  components: {
    Icon,
    Switch,
  },
  setup() {
    const isOpen = ref(false);
    const toggleOpen = () => (isOpen.value = !isOpen.value);

    const settings = reactive({
      theme: 'system',
      customSlippage: false,
      viewAllAssets: false,
      lpAssetPool: false,
    });

    const toggleSetting = (key: string) => {
      settings[key] = !settings[key];
    };

    return {
      isOpen,
      toggleOpen,
      toggleSetting,
      settings,
    };
  },
});
</script>

<template>
  <div class="settings-menu" :class="{ 'settings-menu--open': isOpen }">
    <button class="settings-menu__button" @click="toggleOpen">
      <Icon name="MenuIcon" :icon-size="2.2" class="settings-menu__button__icon" />
    </button>

    <div v-show="isOpen" class="settings-menu__dropdown elevation-panel">
      <div class="settings-menu__dropdown__item">
        <span>Theme</span>

        <select v-model="settings.theme" class="settings-menu__dropdown__button__select">
          <option value="system">System</option>
          <option value="light">Light</option>
        </select>
      </div>

      <hr class="settings-menu__dropdown__divider" />

      <div>
        <p class="settings-menu__dropdown__label">Advanced settings</p>
        <button class="settings-menu__dropdown__button" @click="toggleSetting('customSlippage')">
          <span>Custom slippage</span>
          <Switch v-model="settings.customSlippage" class="settings-menu__dropdown__button__switch" />
        </button>
        <button class="settings-menu__dropdown__button" @click="toggleSetting('viewAllAssets')">
          <span>View all assets</span>
          <Switch v-model="settings.viewAllAssets" class="settings-menu__dropdown__button__switch" />
        </button>
        <button class="settings-menu__dropdown__button" @click="toggleSetting('lpAssetPool')">
          <span>LP Asset pool</span>
          <Switch v-model="settings.lpAssetPool" class="settings-menu__dropdown__button__switch" />
        </button>
      </div>

      <hr class="settings-menu__dropdown__divider" />

      <div>
        <a href="https://cosmos.network" target="_blank" class="settings-menu__dropdown__button">
          <span>Support</span>
          <Icon name="ArrowUpIcon" :icon-size="1.5" class="external-icon" />
        </a>

        <a href="https://twitter.com/emerisHQ" target="_blank" class="settings-menu__dropdown__button">
          <span>Twitter</span>
          <Icon name="ArrowUpIcon" :icon-size="1.5" class="external-icon" />
        </a>

        <a href="https://emeris.com" target="_blank" class="settings-menu__dropdown__button">
          <span>emeris.com</span>
          <Icon name="ArrowUpIcon" :icon-size="1.5" class="external-icon" />
        </a>
      </div>

      <div class="settings-menu__dropdown__list">
        <router-link to="/" class="settings-menu__dropdown__list__item">Privacy</router-link>
        <router-link to="/" class="settings-menu__dropdown__list__item">Terms of use</router-link>
        <router-link to="/" class="settings-menu__dropdown__list__item">Cookies policy</router-link>
      </div>
    </div>
  </div>
</template>

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
