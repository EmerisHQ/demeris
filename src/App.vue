<template>
  <div class="s-0">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import { GlobalDemerisActionTypes } from './store/demeris/action-types';
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
    /*
        set dark/light mode according to user Preference
        later, there will be a toggle button and save user's preference to localStorage
        for overriding default os/browser setting
          // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          //   document.documentElement.setAttribute('color-theme', 'dark');
          // } else {
          //   document.documentElement.setAttribute('color-theme', 'light');
          // }
      */
    document.documentElement.setAttribute('color-theme', 'light');

    await this.$store.dispatch(GlobalDemerisActionTypes.INIT, {
      endpoint: 'https://dev.demeris.io/v1',
      refreshTime: 5000,
    });
    await this.$store.dispatch(GlobalDemerisActionTypes.GET_VERIFIED_DENOMS, {
      subscribe: true,
    });
    await this.$store.dispatch(GlobalDemerisActionTypes.GET_CHAINS, {
      subscribe: true,
    });
    await this.$store.dispatch('common/env/init', {
      apiNode: 'https://dev.demeris.io/v1/liquidity',
      rpcNode: null,
      wsNode: null,
      chainId: 'cosmos-hub',
      addrPrefix: 'cosmos',
      sdkVersion: 'Stargate',
      getTXApi: null,
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
