<template>
  <div class="keplr__banner">
    <img class="keplr__banner__logo" :src="require('@/assets/images/keplr-wallet-logo.png')" title="Keplr Wallet" />
    <div class="keplr__banner__surfer" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'KeplrBanner',
});
</script>

<style lang="scss">
.keplr__banner {
  position: absolute;
  background-image: url('~@/assets/images/gradient-light-2.png');
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: cover;
  width: 50%;
  height: 100%;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 4.8rem;

  &__surfer {
    content: '';
    flex: 1 1 0%;
    background-image: url('~@/assets/images/silver-surfer-1.png');
    background-repeat: no-repeat;
    background-position: center;
    width: 100%;
    display: block;
  }

  &__logo {
    width: 11rem;
    margin: 0 auto;
  }
}
</style>
