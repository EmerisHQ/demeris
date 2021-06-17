<template>
  <header class="header">
    <Logo />
    <Navbar />

    <div class="space"></div>
    <div class="header__wallet">
      <router-link :to="{ name: 'Redeem' }">
        <IconButton v-tippy content="You have 4 assets to redeem" name="RedeemIcon" status="circle" show-badge />
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
      <Wallet />
      <div class="header__menu-button">
        <div class="header__menu-button__icon">
          <MenuIcon />
        </div>
      </div>
    </div>
  </header>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import Wallet from '@/components/account/Wallet.vue';
import Logo from '@/components/layout/Logo.vue';
import Navbar from '@/components/layout/Navbar.vue';

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
});
</script>

<style scoped lang="scss">
.space {
  flex: 1;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 10rem;
  padding: 2rem;

  display: flex;
  align-items: center;

  /* padding: 20px; */

  &__logo {
    display: flex;

    &_icon {
      display: flex;
      align-items: center;
      margin-right: 12px;
    }

    &_text {
      display: flex;
      align-items: center;

      &-title {
        margin-right: 8px;

        font-size: 2.4rem;
        font-weight: bold;
      }

      &-status {
        padding: 0.5rem 1.8rem;
        font-size: 1.6rem;

        color: #fff;
        background-color: lightgrey;
        border-radius: 20px;
      }
    }
  }

  &__wallet {
    display: flex;
    align-items: center;
    &-button {
      display: flex;
      font-size: 1.6rem;
      justify-content: center;
      align-items: center;
      padding: 0rem 1.5rem;
      &__icon {
        margin-right: 1rem;
      }
    }

    /* &-image {
      width: 26px;
      height: 26px;

      margin-right: 8px;

      background-color: lightgray;
      border-radius: 50%;
    } */

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
    margin-left: 2.5rem;
    &__icon {
      font-size: 2.2rem;
      color: black;
    }
  }
}
</style>
