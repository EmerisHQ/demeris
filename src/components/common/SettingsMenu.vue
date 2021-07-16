<template>
  <div v-if="isSignedIn" class="header__wallet-badge">
    <div ref="menuRef" class="settings-menu" :class="{ 'settings-menu--open': isOpen }" @click="toggleOpen">
      <div class="header__wallet-badge__avatar">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="header__wallet-badge__avatar__gradient" v-html="getAvatar(keplrAccountName)"></div>
        <div class="header__wallet-badge__avatar__glow" />
      </div>
      <div class="header__wallet-badge__details">
        <div class="header__wallet-badge__details__account-name">{{ keplrAccountName }}</div>
        <div class="header__wallet-badge__details__value">
          <TotalPrice :balances="balances" variant="none" />
        </div>
      </div>
    </div>
    <SettingsMenuModal v-show="isOpen" />
  </div>

  <div v-else>
    <Button :name="$t('wallet.connect.button')" @click="toggleModal" />
    <ConnectWalletModal :open="isModalOpen" @close="toggleModal" />
  </div>
</template>

<script lang="ts">
import MD5 from 'crypto-js/md5';
import avatar from 'gradient-avatar';
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';

import ConnectWalletModal from '@/components/account/ConnectWalletModal.vue';
import SettingsMenuModal from '@/components/common/SettingsMenuModal.vue';
import TotalPrice from '@/components/common/TotalPrice.vue';
import Button from '@/components/ui/Button.vue';
import useAccount from '@/composables/useAccount';
import { useStore } from '@/store';

export default defineComponent({
  name: 'SettingsMenu',

  components: {
    Button,
    ConnectWalletModal,
    SettingsMenuModal,
    TotalPrice,
  },

  setup() {
    // wallet stuff
    const isModalOpen = ref(false);
    const store = useStore();

    const { balances } = useAccount();

    const isSignedIn = computed(() => {
      return store.getters['demeris/isSignedIn'];
    });

    const keplrAccountName = computed(() => {
      return store.getters['demeris/getKeplrAccountName'];
    });
    const keplrAddress = computed(() => {
      return store.getters['demeris/getKeplrAddress'];
    });

    const toggleModal = () => {
      isModalOpen.value = !isModalOpen.value;
    };

    // settings menu stuff
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
      balances,
      isModalOpen,
      toggleModal,
      isSignedIn,
      keplrAccountName,
      keplrAddress,
      isOpen,
      menuRef,
      toggleOpen,
    };
  },
  methods: {
    getAvatar: function (name: string): string {
      return avatar(MD5(name) + '', 64);
    },
  },
});
</script>

<style lang="scss">
// wallet component
.header {
  &__wallet-badge {
    display: flex;
    align-items: center;

    &__avatar {
      width: 3.2rem;
      height: 3.2rem;
      border-radius: 1.6rem;
      position: relative;

      &__gradient {
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 1.6rem;
        overflow: hidden;
        z-index: 1;
        position: relative;

        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
    &__details {
      margin-left: 1.2rem;
      display: flex;
      flex-direction: column;
      &__account-name {
        font-size: 1.3rem;
        line-height: 1.7rem;
        font-feature-settings: 'zero' on;
      }
      &__value {
        margin-top: 0.2rem;
        font-size: 1.6rem;
        line-height: 2rem;
        font-weight: bold;
      }
    }
  }
}

// settings component
.settings-menu {
  &--open {
    background: var(--fg-trans);
  }

  &:hover {
    background: var(--fg-trans);
  }
}
</style>
