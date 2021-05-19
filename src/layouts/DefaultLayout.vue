<template>
  <Header />
  <Navbar />

  <Wallet ref="wallet" />
  <div class="layout-frame">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Wallet from '@/components/account/Wallet.vue';
import Header from '@/components/layout/Header.vue';
import Navbar from '@/components/layout/Navbar.vue';

export default defineComponent({
  name: 'DefaultLayout',
  components: {
    Header,
    Navbar,
    Wallet,
  },
});
</script>

<style scoped lang="scss">
.layout-frame {
  padding-top: 11rem;
}
</style>
