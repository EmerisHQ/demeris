<template>
  <div>
    <div v-if="isSignedIn" class="header__wallet-badge">
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
    <Button v-else name="Connect my wallet" @click="toggleModal" />
    <ConnectWalletModal :open="isModalOpen" @close="toggleModal" />
  </div>
</template>

<script lang="ts">
import MD5 from 'crypto-js/md5';
import avatar from 'gradient-avatar';
import { computed, defineComponent, ref } from 'vue';

import ConnectWalletModal from '@/components/account/ConnectWalletModal.vue';
import TotalPrice from '@/components/common/TotalPrice.vue';
import Button from '@/components/ui/Button.vue';
import useAccount from '@/composables/useAccount';
import { useStore } from '@/store';

export default defineComponent({
  name: 'Wallet',

  components: {
    Button,
    ConnectWalletModal,
    TotalPrice,
  },

  setup() {
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

    return {
      balances,
      isModalOpen,
      toggleModal,
      isSignedIn,
      keplrAccountName,
      keplrAddress,
    };
  },
  methods: {
    getAvatar: function (name: string): string {
      return avatar(MD5(name) + '', 64);
    },
  },
});
</script>

<style lang="scss" scoped>
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

      &__glow {
        position: absolute;
        content: '';
        width: 100%;
        height: 100%;
        top: 0.6rem;
        right: -0.2rem;
        border-radius: 1.6rem;
        background: radial-gradient(144.8% 78% at 90.48% 100%, #fffd38 25.95%, rgba(158, 255, 185, 0) 100%),
          linear-gradient(153.31deg, #64dafb 5.41%, #30ffdf 30.23%, #b0ff94 54.73%);
        opacity: 0.5;
        filter: blur(12.8px);
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
</style>
