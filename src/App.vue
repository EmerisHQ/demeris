<template>
  <metainfo>
    <template #title="{ content }">{{ content ? `${content} · Emeris` : `Emeris` }}</template>
  </metainfo>
  <MaintenanceScreen v-if="showMaintenanceScreen" />
  <div v-else-if="initialized">
    <CookieConsent />
    <ChainDownWrapper>
      <router-view />
    </ChainDownWrapper>
    <FeatureRunningConditional name="TRANSACTIONS_CENTER">
      <TransactionsCenter />
    </FeatureRunningConditional>
    <SimplexModal />
    <MoonpayModal />
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
import MaintenanceScreen from '@/components/common/MaintenanceScreen.vue';
import MoonpayModal from '@/components/common/MoonpayModal.vue';
import SimplexModal from '@/components/common/SimplexModal.vue';
import EphemerisSpinner from '@/components/ui/EphemerisSpinner.vue';
import useTheme from '@/composables/useTheme';
import TransactionsCenter from '@/features/transactions/components/TransactionsCenter.vue';
import { GlobalDemerisActionTypes, GlobalDemerisGetterTypes, TypedUSERStore } from '@/store';
import { TypedAPIStore } from '@/store';
import { setStore } from '@/utils/useStore';

import FeatureRunningConditional from './components/common/FeatureRunningConditional.vue';
import usePoolsFactory from './composables/usePools';
import { autoLogin, autoLoginDemo } from './utils/basic';
import { featureRunning } from './utils/FeatureManager';

export default defineComponent({
  name: 'App',

  components: {
    EphemerisSpinner,
    ChainDownWrapper,
    CookieConsent,
    TransactionsCenter,
    FeatureRunningConditional,
    SimplexModal,
    MoonpayModal,
    MaintenanceScreen,
  },

  setup() {
    let showMaintenanceScreen = false;
    if (featureRunning('MAINTENANCE_SCREEN')) {
      return {
        showMaintenanceScreen: true,
      };
    }
    const store = useStore();
    let liquidityEndpoint =
      import.meta.env.VITE__EMERIS_PROD_LIQUIDITY_ENDPOINT ?? 'https://api.emeris.com/v1/liquidity';
    let emerisEndpoint = import.meta.env.VITE__EMERIS_PROD_ENDPOINT ?? 'https://api.emeris.com/v1';
    let wsEndpoint = import.meta.env.VITE__EMERIS_PROD_WEBSOCKET_ENDPOINT ?? 'wss://api.emeris.com/v1';

    if (featureRunning('USE_STAGING')) {
      liquidityEndpoint = import.meta.env.VITE__EMERIS_STAGING_LIQUIDITY_ENDPOINT;
      emerisEndpoint = import.meta.env.VITE__EMERIS_STAGING_ENDPOINT;
      wsEndpoint = import.meta.env.VITE__EMERIS_STAGING_WEBSOCKET_ENDPOINT;
    }
    if (featureRunning('USE_DEV')) {
      liquidityEndpoint = import.meta.env.VITE__EMERIS_DEV_LIQUIDITY_ENDPOINT;
      emerisEndpoint = import.meta.env.VITE__EMERIS_DEV_ENDPOINT;
      wsEndpoint = import.meta.env.VITE__EMERIS_DEV_WEBSOCKET_ENDPOINT;
    }
    setStore(store); // make store availabe in some composition functions used in the store itself
    const apistore = store as TypedAPIStore;
    const userstore = store as TypedUSERStore;
    const initialized = ref(false);
    const router = useRouter();
    const { pools: _pools } = usePoolsFactory();
    const { t } = useI18n({ useScope: 'global' });
    const status = ref(t('appInit.status.initializing'));
    if (featureRunning('REQUEST_PARALLELIZATION')) {
      onMounted(async () => {
        useTheme({ updateOnChange: true });
        let gasLimit = parseInt(window.localStorage.getItem('gasLimit'));
        if (!gasLimit) {
          gasLimit = 500000;
          window.localStorage.setItem('gasLimit', gasLimit.toString());
        }
        await apistore.dispatch(GlobalDemerisActionTypes.API.INIT, {
          wsEndpoint: wsEndpoint,
          endpoint: emerisEndpoint,
          hub_chain: 'cosmos-hub',
          refreshTime: 5000,
        });
        userstore.dispatch(GlobalDemerisActionTypes.USER.SET_GAS_LIMIT, {
          gasLimit: gasLimit,
        });
        try {
          await apistore.dispatch(GlobalDemerisActionTypes.API.GET_VERIFIED_DENOMS, {
            subscribe: true,
          });
        } catch (e) {
          console.error('Could not load verified denoms: ' + e);
        }
        apistore
          .dispatch(GlobalDemerisActionTypes.API.GET_CHAINS, {
            subscribe: false,
          })
          .then((chains) => {
            for (let chain in chains) {
              apistore
                .dispatch(GlobalDemerisActionTypes.API.GET_CHAIN, {
                  subscribe: true,
                  params: {
                    chain_name: chain,
                  },
                })
                .then((chain) => {
                  apistore.dispatch(GlobalDemerisActionTypes.API.GET_CHAIN_STATUS, {
                    subscribe: true,
                    params: {
                      chain_name: chain.chain_name,
                    },
                  });
                });
            }
          })
          .catch((e) => {
            console.error('Could not load chain information: ' + e);
          });
        store
          .dispatch('common/env/config', {
            apiNode: liquidityEndpoint,
            rpcNode: null,
            wsNode: null,
            chainId: 'cosmos-hub',
            addrPrefix: 'cosmos',
            sdkVersion: 'Stargate',
            getTXApi: null,
            offline: true,
            refresh: 10000,
          })
          .then(() => {
            store
              .dispatch('tendermint.liquidity.v1beta1/QueryLiquidityPools', {
                options: { subscribe: true },
              })
              .catch((e) => {
                console.error('Could not load liquidity pools: ' + e);
              })
              .finally(() => {
                // Pool token prices are calculated as part of the GET_PRICES dispatch
                // This is something to fix during the refactor/revamp of the store where
                // most of the functionality in composables such as usePool(s)/usePrice etc.
                // will be relegated to getters in the store.
                // In the meantime however, in order to calculate pool token prices during
                // the first call to the /prices endpoint, we must have pool details available
                // so we can grab their reserve account address and reserve denom balances
                // in order to calculate the TVL of the pool and thus the token's price.
                // Otherwise we'd have to wait 5 seconds till the next polling cycle leading
                // to worse UX.
                apistore
                  .dispatch(GlobalDemerisActionTypes.API.GET_PRICES, {
                    subscribe: true,
                  })
                  .catch((e) => {
                    console.error('Could not load denom prices: ' + e);
                  });
              });
            store.dispatch('tendermint.liquidity.v1beta1/QueryParams', { options: { subscribe: true } }).catch((e) => {
              console.error('Could not load liquidity module params: ' + e);
            });
            store
              .dispatch('cosmos.bank.v1beta1/QueryTotalSupply', { options: { subscribe: true, all: true } })
              .catch((e) => {
                console.error('Could not load denom supply: ' + e);
              });
          });
        if (autoLogin()) {
          userstore.dispatch(GlobalDemerisActionTypes.USER.SIGN_IN);
        } else {
          if (autoLoginDemo()) {
            userstore.dispatch(GlobalDemerisActionTypes.USER.SIGN_IN_WITH_WATCHER);
          }
        }
        window.addEventListener('keplr_keystorechange', async () => {
          window.localStorage.setItem('lastEmerisSession', '');
          if (
            userstore.getters[GlobalDemerisGetterTypes.USER.isSignedIn] &&
            !userstore.getters[GlobalDemerisGetterTypes.USER.isDemoAccount]
          ) {
            userstore.dispatch(GlobalDemerisActionTypes.USER.SIGN_IN);
          }
        });

        initialized.value = true;
        const isReturnUser = ref(null);
        isReturnUser.value = window.localStorage.getItem('isReturnUser');
        if (!isReturnUser.value) {
          router.push('/welcome');
        }
      });
    } else {
      onMounted(async () => {
        useTheme({ updateOnChange: true });
        let gasLimit = parseInt(window.localStorage.getItem('gasLimit'));
        if (!gasLimit) {
          gasLimit = 500000;
          window.localStorage.setItem('gasLimit', gasLimit.toString());
        }
        await apistore.dispatch(GlobalDemerisActionTypes.API.INIT, {
          endpoint: emerisEndpoint,
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
            displayChain: apistore.getters[GlobalDemerisGetterTypes.API.getDisplayChain]({ name: chain }),
          });
          await apistore.dispatch(GlobalDemerisActionTypes.API.GET_CHAIN, {
            subscribe: true,
            params: {
              chain_name: chain,
            },
          });
          status.value = t('appInit.status.chainStatus', {
            displayChain: apistore.getters[GlobalDemerisGetterTypes.API.getDisplayChain]({ name: chain }),
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
          apiNode: liquidityEndpoint,
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
          await store.dispatch('cosmos.bank.v1beta1/QueryTotalSupply', { options: { subscribe: true, all: true } });
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
    }
    return { initialized, status, showMaintenanceScreen };
  },
  errorCaptured(err) {
    console.error(err);
    return false;
  },
});
</script>

<style lang="scss"></style>
