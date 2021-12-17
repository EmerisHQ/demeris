<template>
  <metainfo>
    <template #title="{ content }">{{ content ? `${content} · Emeris` : `Emeris` }}</template>
  </metainfo>
  <div v-if="initialized">
    <CookieConsent />
    <ChainDownWrapper>
      <router-view />
    </ChainDownWrapper>
  </div>
  <div v-else class="h-screen flex flex-col items-center justify-center">
    <h1 class="text-3 font-bold">{{ $t('appInit.title') }}</h1>
    <EphemerisSpinner class="h-64 w-64" />
    <p class="leading-copy text-muted -text-1">{{ status }}</p>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import ChainDownWrapper from '@/components/common/ChainDownWrapper.vue';
import CookieConsent from '@/components/common/CookieConsent.vue';
import EphemerisSpinner from '@/components/ui/EphemerisSpinner.vue';
import useTheme from '@/composables/useTheme';
import { GlobalDemerisActionTypes, GlobalDemerisGetterTypes, TypedUSERStore } from '@/store';
import { setStore } from '@/utils/useStore';
import { TypedAPIStore } from '@@/store';

import { autoLogin, autoLoginDemo } from './utils/basic';

export default defineComponent({
  name: 'App',

  components: {
    EphemerisSpinner,
    ChainDownWrapper,
    CookieConsent,
  },

  setup() {
    useTheme({ updateOnChange: true });
    const store = useStore();
    const apistore = store as TypedAPIStore;
    const userstore = store as TypedUSERStore;
    const initialized = ref(false);
    const router = useRouter();

    setStore(store); // make store availabe in some composition functions used in the store itself

    const { t } = useI18n({ useScope: 'global' });
    const status = ref(t('appInit.status.initializing'));
    onMounted(async () => {
      let gasLimit = parseInt(window.localStorage.getItem('gasLimit'));
      if (!gasLimit) {
        gasLimit = 500000;
        window.localStorage.setItem('gasLimit', gasLimit.toString());
      }
      await apistore.dispatch(GlobalDemerisActionTypes.API.INIT, {
        endpoint: process.env.VUE_APP_EMERIS_ENDPOINT,
        hub_chain: 'cosmos-hub',
        refreshTime: 5000,
      });
      await userstore.dispatch(GlobalDemerisActionTypes.USER.SET_GAS_LIMIT, {
        gasLimit: gasLimit,
      });
      status.value = t('appInit.status.assetLoading');
      await apistore.dispatch(GlobalDemerisActionTypes.API.GET_VERIFIED_DENOMS, {
        subscribe: true,
      });
      status.value = t('appInit.status.chainLoading');
      let chains = await apistore.dispatch(GlobalDemerisActionTypes.API.GET_CHAINS, {
        subscribe: false,
      });
      for (let chain in chains) {
        status.value = t('appInit.status.chainDetails', {
          displayChain: apistore.getters['demerisAPI/getDisplayChain']({ name: chain }),
        });
        await apistore.dispatch(GlobalDemerisActionTypes.API.GET_CHAIN, {
          subscribe: true,
          params: {
            chain_name: chain,
          },
        });
        status.value = t('appInit.status.chainStatus', {
          displayChain: apistore.getters['demerisAPI/getDisplayChain']({ name: chain }),
        });
        await apistore.dispatch(GlobalDemerisActionTypes.API.GET_CHAIN_STATUS, {
          subscribe: true,
          params: {
            chain_name: chain,
          },
        });
      }
      status.value = t('appInit.status.liquidityConfigure');
      await store.dispatch('common/env/config', {
        apiNode: process.env.VUE_APP_EMERIS_LIQUIDITY_ENDPOINT,
        rpcNode: null,
        wsNode: null,
        chainId: 'cosmos-hub',
        addrPrefix: 'cosmos',
        sdkVersion: 'Stargate',
        getTXApi: null,
        offline: true,
        refresh: 10000,
      });
      status.value = t('appInit.status.poolFetching');
      try {
        await store.dispatch('tendermint.liquidity.v1beta1/QueryLiquidityPools', {
          options: { subscribe: true },
        });
        await store.dispatch('tendermint.liquidity.v1beta1/QueryParams', { options: { subscribe: true } });
        await store.dispatch('cosmos.bank.v1beta1/QueryTotalSupply', { options: { subscribe: true } });
      } catch (e) {
        console.error(e);
      }
      status.value = t('appInit.status.priceFetching');
      try {
        await apistore.dispatch(GlobalDemerisActionTypes.API.GET_PRICES, {
          subscribe: true,
        });
      } catch (e) {
        //
      }
      status.value = t('appInit.status.signingIn');
      if (autoLogin()) {
        await userstore.dispatch(GlobalDemerisActionTypes.USER.SIGN_IN);
      } else {
        if (autoLoginDemo()) {
          await userstore.dispatch(GlobalDemerisActionTypes.USER.SIGN_IN_WITH_WATCHER);
        }
      }
      window.addEventListener('keplr_keystorechange', async () => {
        window.localStorage.setItem('lastEmerisSession', '');
        if (
          userstore.getters[GlobalDemerisGetterTypes.USER.isSignedIn] &&
          !userstore.getters[GlobalDemerisGetterTypes.USER.isDemoAccount]
        ) {
          await userstore.dispatch(GlobalDemerisActionTypes.USER.SIGN_IN);
        }
      });
      initialized.value = true;
      const isReturnUser = ref(null);
      isReturnUser.value = window.localStorage.getItem('isReturnUser');
      if (!isReturnUser.value) {
        router.push('/welcome');
      }
    });
    return { initialized, status };
  },
  errorCaptured(err) {
    console.error(err);
    return false;
  },
});
</script>

<style lang="scss"></style>
