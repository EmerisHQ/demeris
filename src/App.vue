<template>
  <div>
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import useTheme from '@/composables/useTheme';

import { GlobalDemerisActionTypes } from './store/demeris/action-types';
import { autoLogin, autoLoginDemo } from './utils/basic';
export default defineComponent({
  name: 'App',
  setup() {
    useTheme({ updateOnChange: true });
  },
  data() {
    return {
      initialized: false,
    };
  },
  async created() {
    await this.$store.dispatch(GlobalDemerisActionTypes.INIT, {
      endpoint: 'https://dev.demeris.io/v1',
      hub_chain: 'cosmos-hub',
      refreshTime: 5000,
      gas_limit: 500000,
    });
    await this.$store.dispatch(GlobalDemerisActionTypes.SET_GAS_LIMIT, { gasLimit: 600000 });
    await this.$store.dispatch(GlobalDemerisActionTypes.SET_GAS_LIMIT, { gasLimit: 700000 });
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
    } else {
      if (autoLoginDemo()) {
        await this.$store.dispatch(GlobalDemerisActionTypes.SIGN_IN_WITH_WATCHER);
      }
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
      if (this.$store.getters['demeris/isSignedIn'] && !this.$store.getters['demeris/isDemoAccount']) {
        await this.$store.dispatch(GlobalDemerisActionTypes.SIGN_IN);
      }
    });

    // send new users to welcome page
    const router = useRouter();
    const isReturnUser = ref(null);
    isReturnUser.value = window.localStorage.getItem('isReturnUser');
    if (!isReturnUser.value) {
      router.push('/welcome');
    }
  },
});
</script>

<style lang="scss"></style>
