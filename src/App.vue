<template>
  <div class="s-0">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import { GlobalDemerisActionTypes } from './store/demeris/action-types';
import { autoLogin } from './utils/basic';
export default defineComponent({
  name: 'App',
  data() {
    return {
      initialized: false,
    };
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
      endpoint: 'https://staging.demeris.io/v1',
      hub_chain: 'cosmos-hub',
      refreshTime: 5000,
      gas_limit: 300000,
    });
    await this.$store.dispatch(GlobalDemerisActionTypes.GET_VERIFIED_DENOMS, {
      subscribe: true,
    });
    let chains = await this.$store.dispatch(GlobalDemerisActionTypes.GET_CHAINS, {
      subscribe: false,
    });

    await this.$store.dispatch(GlobalDemerisActionTypes.GET_PRICES, {
      subscribe: true,
    });

    for (let chain in chains) {
      await this.$store.dispatch(GlobalDemerisActionTypes.GET_CHAIN, {
        subscribe: true,
        params: {
          chain_name: chain,
        },
      });
    }
    await this.$store.dispatch('common/env/config', {
      apiNode: 'https://staging.demeris.io/v1/liquidity',
      rpcNode: null,
      wsNode: null,
      chainId: 'cosmos-hub',
      addrPrefix: 'cosmos',
      sdkVersion: 'Stargate',
      getTXApi: null,
      offline: true,
      refresh: 10000,
    });
    try {
      await this.$store.dispatch('tendermint.liquidity.v1beta1/QueryLiquidityPools', { options: { subscribe: true } });
    } catch (e) {
      console.log(e);
    }
    if (autoLogin()) {
      await this.$store.dispatch(GlobalDemerisActionTypes.SIGN_IN);
    }
    this.initialized = true;
  },
  errorCaptured(err) {
    console.log(err);
    return false;
  },
});
</script>

<style lang="scss"></style>
