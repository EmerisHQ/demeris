<template>
  <div class="text-base font-sans antialiased">
    <router-view />
  </div>
</template>
<script lang="ts">
import '@starport/vue/lib/starport-vue.css';

import { defineComponent } from 'vue';
export default defineComponent({
  name: 'App',
  data() {
    return {
      initialized: false,
    };
  },
  computed: {
    hasWallet() {
      return this.$store.hasModule(['common', 'wallet']);
    },
  },
  async created() {
    await this.$store.dispatch('common/env/init', {
      starportUrl: '',
      apiNode: 'https://api.gravity.bharvest.io',
      rpcNode: 'https://rpc.gravity.bharvest.io',
      wsNode: 'wss://rpc.gravity.bharvest.io/websocket',
      chainId: 'swap-testnet-2003',
      addrPrefix: 'cosmos',
      chainName: 'Gravity DEX testnet',
      sdkVersion: 'Stargate',
      getTXApi: 'https://rpc.gravity.bharvest.io/tx?hash=0x',
    });
    this.initialized = true;
  },
  errorCaptured(err) {
    console.log(err);
    return false;
  },
});
</script>

<style lang="scss"></style>
