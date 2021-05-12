<template>
  <div>
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import '@starport/vue/lib/starport-vue.css';
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
    /* set dark/light mode according to user Preference
	later, there will be a toggle button and save user's preference to localStorage 
	for overriding default os/browser setting */
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('color-theme', 'dark');
    } else {
      document.documentElement.setAttribute('color-theme', 'light');
    }

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

<style lang="scss">
</style>
