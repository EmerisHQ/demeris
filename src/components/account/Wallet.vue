<template>
  <div>
    <div v-if="isSignedIn" class="header__wallet-badge">
      <div class="header__wallet-badge__avatar">
        <div class="header__wallet-badge__avatar__gradient" v-html="getAvatar(keplrAccountName)"></div>
        <div class="header__wallet-badge__avatar__glow">
          <!-- TODO: Glow SVG //-->
        </div>
      </div>
      <div class="header__wallet-badge__details">
        <div class="header__wallet-badge__details__account-name">{{ keplrAccountName }}</div>
        <div class="header__wallet-badge__details__value"><TotalPrice :balances="balances" :styled="false" /></div>
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
    const isSignedIn = computed(() => {
      return store.getters['demeris/isSignedIn'];
    });
    const keplrAccountName = computed(() => {
      return store.getters['demeris/getKeplrAccountName'];
    });
    const { balances } = useAccount();
    const keplrAddress = computed(() => {
      return store.getters['demeris/getKeplrAddress'];
    });
    const toggleModal = () => {
      isModalOpen.value = !isModalOpen.value;
    };
    return {
      isModalOpen,
      toggleModal,
      isSignedIn,
      keplrAccountName,
      balances,
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
        svg {
          width: 100%;
          height: 100%;
        }
      }
      &__glow {
        position: absolute;
        svg {
          width: 4.2rem;
          height: 3.4rem;
        }
        top: 0;
      }
    }
    &__details {
      margin-left: 0.5rem;
      display: flex;
      flex-direction: column;
      &__account-name {
        font-size: 1.3rem;
        line-height: 1.7rem;
        font-feature-settings: 'zero' on;
      }
      &__value {
        font-size: 1.6rem;
        line-height: 2rem;
        font-weight: bold;
      }
    }
  }
}
</style>
