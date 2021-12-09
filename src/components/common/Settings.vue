<template>
  <div ref="menuRef" class="settings-wrapper flex sm:pl-3 sm:relative">
    <div
      v-if="isSignedIn"
      class="settings -mr-2 sm:mr-0 py-1 px-2 h-12 flex items-center rounded-lg cursor-pointer"
      :class="{ 'settings--open': isSettingsModalOpen }"
      @click="toggleSettingsModal"
    >
      <AvatarBalance />
    </div>

    <Button v-if="!isSignedIn || isDemoAccount" :name="$t('wallet.connect.button')" @click="toggleWalletModal" />

    <SettingsModal v-show="isSettingsModalOpen" @disconnect="toggleSettingsModal" @connect="toggleWalletModal" />
    <ConnectWalletModal :open="isWalletModalOpen" @close="toggleWalletModal" />
  </div>
</template>

<script lang="ts">
import MD5 from 'crypto-js/md5';
import avatar from 'gradient-avatar';
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';

import AvatarBalance from '@/components/account/AvatarBalance.vue';
import ConnectWalletModal from '@/components/account/ConnectWalletModal.vue';
import SettingsModal from '@/components/common/SettingsModal.vue';
import Button from '@/components/ui/Button.vue';
import useAccount from '@/composables/useAccount';
import useEmitter from '@/composables/useEmitter';

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

    const isDemoAccount = computed(() => {
      return store.getters['demeris/isDemoAccount'];
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
      isDemoAccount,
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
  &--open {
    background: var(--fg);
  }
}
</style>
