<template>
  <div ref="menuRef" class="settings-wrapper">
    <div
      v-if="isSignedIn"
      class="settings"
      :class="{ 'settings--open': isSettingsModalOpen }"
      @click="toggleSettingsModal"
    >
      <div class="settings__avatar">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="settings__avatar__gradient" v-html="getAvatar(keplrAccountName)"></div>
        <div class="settings__avatar__glow" />
      </div>
      <div class="settings__details">
        <div class="settings__details__account-name">{{ keplrAccountName }}</div>
        <div class="settings__details__value">
          <TotalPrice :balances="balances" variant="none" />
        </div>
      </div>
    </div>

    <Button v-else :name="$t('wallet.connect.button')" @click="toggleWalletModal" />

    <SettingsModal v-show="isSettingsModalOpen" />
    <ConnectWalletModal :open="isWalletModalOpen" @close="toggleWalletModal" />
  </div>
</template>

<script lang="ts">
import MD5 from 'crypto-js/md5';
import avatar from 'gradient-avatar';
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';

import ConnectWalletModal from '@/components/account/ConnectWalletModal.vue';
import SettingsModal from '@/components/common/SettingsModal.vue';
import TotalPrice from '@/components/common/TotalPrice.vue';
import Button from '@/components/ui/Button.vue';
import useAccount from '@/composables/useAccount';
import { useStore } from '@/store';

export default defineComponent({
  name: 'Settings',

  components: {
    Button,
    ConnectWalletModal,
    SettingsModal,
    TotalPrice,
  },

  setup() {
    // wallet stuff
    const isWalletModalOpen = ref(false);
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

    const toggleWalletModal = () => {
      isWalletModalOpen.value = !isWalletModalOpen.value;
    };

    // settings menu stuff
    const menuRef = ref(null);

    const isSettingsModalOpen = ref(false);
    const toggleSettingsModal = () => (isSettingsModalOpen.value = !isSettingsModalOpen.value);

    const clickOutsideListener = (event: Event) => {
      if (event.composedPath().includes(menuRef.value)) {
        return;
      }

      isSettingsModalOpen.value = false;
    };

    onMounted(() => {
      window.addEventListener('pointerdown', clickOutsideListener);
    });

    onUnmounted(() => {
      window.removeEventListener('pointerdown', clickOutsideListener);
    });

    return {
      balances,
      isSignedIn,
      isWalletModalOpen,
      toggleWalletModal,
      isSettingsModalOpen,
      toggleSettingsModal,
      keplrAccountName,
      keplrAddress,
      menuRef,
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
.settings-wrapper {
  height: 4.8rem;
  padding: 0.4rem;
}

.settings {
  display: flex;
  align-items: center;
  border-radius: 0.8rem;
  padding: 0.4rem 0.8rem;

  &--open {
    background: var(--fg-trans);
  }

  &:hover {
    background: var(--fg-trans);
    cursor: pointer;
  }

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
    &__account-name {
      font-size: 1.3rem;
      line-height: 100%;
      font-feature-settings: 'zero' on;
      margin-bottom: 0.3rem;
    }
    &__value {
      font-size: 1.6rem;
      line-height: 100%;
      font-weight: bold;
    }
  }
}
</style>
