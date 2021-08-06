<template>
  <div>
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
    */
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-color-mode', 'dark');
    } else {
      document.documentElement.setAttribute('data-color-mode', 'light');
    }

    await this.$store.dispatch(GlobalDemerisActionTypes.INIT, {
      endpoint: 'https://dev.demeris.io/v1',
      hub_chain: 'cosmos-hub',
      refreshTime: 5000,
      gas_limit: 400000,
    });
    await this.$store.dispatch(GlobalDemerisActionTypes.GET_VERIFIED_DENOMS, {
      subscribe: true,
    });
    let chains = await this.$store.dispatch(GlobalDemerisActionTypes.GET_CHAINS, {
      subscribe: false,
    });

    try {
      await this.$store.dispatch(GlobalDemerisActionTypes.GET_PRICES, {
        subscribe: true,
      });
    } catch {
      //
    }

    for (let chain in chains) {
      await this.$store.dispatch(GlobalDemerisActionTypes.GET_CHAIN, {
        subscribe: true,
        params: {
          chain_name: chain,
        },
      });
    }
    await this.$store.dispatch('common/env/config', {
      apiNode: 'https://dev.demeris.io/v1/liquidity',
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
      await this.$store.dispatch('tendermint.liquidity.v1beta1/QueryParams', { options: { subscribe: true } });
      await this.$store.dispatch('cosmos.bank.v1beta1/QueryTotalSupply', { options: { subscribe: true } });
    } catch (e) {
      console.error(e);
    }
    if (autoLogin()) {
      await this.$store.dispatch(GlobalDemerisActionTypes.SIGN_IN);
    }
    this.initialized = true;
  },

  errorCaptured(err) {
    console.error(err);
    return false;
  },
  mounted() {
    window.addEventListener('keplr_keystorechange', async () => {
      window.localStorage.setItem('lastEmerisSession', '');
      if (this.$store.getters['demeris/isSignedIn']) {
        await this.$store.dispatch(GlobalDemerisActionTypes.SIGN_OUT);
        await this.$store.dispatch(GlobalDemerisActionTypes.SIGN_IN);
      }
    });
  },
});
</script>

<style lang="scss"></style>
