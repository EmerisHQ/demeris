<template>
  <div ref="menuRef" class="settings-menu" :class="{ 'settings-menu--open': isOpen }">
    <button class="settings-menu__button" @click="toggleOpen">
      <Icon name="MenuIcon" :icon-size="2.2" class="settings-menu__button__icon" />
    </button>

    <SettingsMenuModal v-show="isOpen" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';

import SettingsMenuModal from '@/components/common/SettingsMenuModal.vue';
import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  components: {
    Icon,
    SettingsMenuModal,
  },
  setup() {
    const menuRef = ref(null);

    const isOpen = ref(false);
    const toggleOpen = () => (isOpen.value = !isOpen.value);

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
      toggleOpen,
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
