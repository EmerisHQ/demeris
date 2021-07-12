<template>
  <header class="header">
    <router-link to="/" class="header__logo">
      <Logo width="1em" height="1em" />
    </router-link>

    <Navbar />

    <div class="space"></div>
    <div class="header__wallet">
      <router-link v-if="redeemableBalances.length > 0" :to="{ name: 'Redeem' }">
        <IconButton v-tippy :content="tip" name="RedeemIcon" status="circle" :show-badge="showBadge" />
      </router-link>

      <router-link class="header__wallet-button" to="/receive">
        <div class="header__wallet-button__icon">
          <ReceiveIcon />
        </div>
        Receive
      </router-link>

      <router-link class="header__wallet-button" to="/send">
        <div class="header__wallet-button__icon">
          <SendIcon />
        </div>
        Send
      </router-link>

      <button class="header__menu-button">
        <div class="header__menu-button__icon">
          <MenuIcon />
        </div>
      </button>

      <Wallet />
    </div>
  </header>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';

import Wallet from '@/components/account/Wallet.vue';
import Logo from '@/components/common/Logo.vue';
import Navbar from '@/components/layout/Navbar.vue';
import useAccount from '@/composables/useAccount';
import { useStore } from '@/store';

import MenuIcon from '../common/Icons/MenuIcon.vue';
import ReceiveIcon from '../common/Icons/ReceiveIcon.vue';
import SendIcon from '../common/Icons/SendIcon.vue';
import IconButton from '../ui/IconButton.vue';
export default defineComponent({
  name: 'Header',
  components: {
    Logo,
    Navbar,
    Wallet,
    ReceiveIcon,
    SendIcon,
    MenuIcon,
    IconButton,
  },
  setup() {
    const { redeemableBalances } = useAccount();
    const store = useStore();
    let tip = computed(() => {
      return redeemableBalances.value.length == 1
        ? (tip = 'You have 1 asset to redeem')
        : (tip = 'You have ' + redeemableBalances.value.length + ' assets to redeem');
    });
    const showBadge = computed(() => {
      return store.getters['hasSeenReedem'];
    });
    return { redeemableBalances, tip, showBadge };
  },
});
</script>

<style scoped lang="scss">
.space {
  flex: 1;
}

.header {
  padding: 0 3.2rem;
  display: flex;
  height: 8rem;
  align-items: center;
  justify-content: space-between;

  &__logo {
    svg {
      font-size: 1.6rem;
    }
  }

  &__wallet {
    display: flex;
    align-items: center;

    &-button {
      font-size: 1.6rem;
      font-weight: 600;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0rem 1.5rem;

      &__icon {
        margin-right: 1rem;
      }
    }

    &__account {
      &-name {
        margin-bottom: 4px;

        font-size: 15px;
        font-weight: 500;
      }

      &-value {
        font-size: 12px;
      }
    }
  }

  &__menu-button {
    margin: 0 2rem 0 1.6rem;
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

    &__icon {
      font-size: 2.2rem;
      color: black;
    }
  }
}
</style>
