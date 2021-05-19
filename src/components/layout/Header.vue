<template>
  <header class="header">
    <Logo />
    <Navbar />

    <div class="space"></div>
    <div class="header__wallet">
      <button class="header__wallet-button">Send</button>
      <button class="header__wallet-button">Receive</button>
      <!-- <div class="header__wallet-image"></div> -->
      <!-- <div class="header__wallet__account">
        <div class="header__wallet__account-name">Name</div>
        <div class="header__wallet__account-value">$1,000</div>
      </div> -->
    </div>
    <Wallet />
  </header>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import Wallet from '@/components/account/Wallet.vue';
import Logo from '@/components/layout/Logo.vue';
import Navbar from '@/components/layout/Navbar.vue';
export default defineComponent({
  name: 'Header',
  components: {
    Logo,
    Navbar,
    Wallet,
  },
});
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 10rem;
  padding: 2rem 32rem 2rem 2rem;
  padding-right: 32rem; // based on SpWallet size

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
      padding: 8px 12px;
      margin-right: 12px;

      color: #6a5df5;

      border: 2px solid #c7c3fb;
      border-radius: 6px;
      background-color: transparent;

      outline: none;
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
}
</style>
