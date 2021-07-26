<template>
  <div ref="menuRef" class="settings-wrapper h-12 pl-3">
    <div
      v-if="isSignedIn"
      class="settings"
      :class="{ 'settings--open': isSettingsModalOpen }"
      @click="toggleSettingsModal"
    >
      <AvatarBalance />
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

import AvatarBalance from '@/components/account/AvatarBalance.vue';
import ConnectWalletModal from '@/components/account/ConnectWalletModal.vue';
import SettingsModal from '@/components/common/SettingsModal.vue';
import Button from '@/components/ui/Button.vue';
import useAccount from '@/composables/useAccount';
import useEmitter from '@/composables/useEmitter';
import { useStore } from '@/store';

export default defineComponent({
  name: 'Settings',

  components: {
    AvatarBalance,
    Button,
    ConnectWalletModal,
    SettingsModal,
  },

  setup() {
    const emitter = useEmitter();

    // wallet stuff
    const isWalletModalOpen = ref(false);
    const store = useStore();

    const { balances } = useAccount();

    const isSignedIn = computed(() => {
      return store.getters['demeris/isSignedIn'];
    });

    const toggleWalletModal = () => {
      isWalletModalOpen.value = !isWalletModalOpen.value;
    };
    emitter.on('toggle-settings-modal', () => {
      toggleWalletModal();
    });

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
.settings {
  display: flex;
  align-items: center;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;

  &--open {
    background: var(--fg);
  }

  &:hover {
    background: var(--fg);
    cursor: pointer;
  }
}
</style>
