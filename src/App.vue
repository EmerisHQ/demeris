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
import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';
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
    let liquidityEndpoint = process.env.VUE_APP_EMERIS_PROD_LIQUIDITY_ENDPOINT ?? 'https://api.emeris.com/v1/liquidity';
    let emerisEndpoint = process.env.VUE_APP_EMERIS_PROD_ENDPOINT ?? 'https://api.emeris.com/v1';
    let githubEndpoint = process.env.VUE_APP_EMERIS_GITHUB_ENDPOINT ?? 'https://api.github.com';
    let rawGithubEndpoint = process.env.VUE_APP_EMERIS_RAW_GITHUB_ENDPOINT ?? 'https://raw.githubusercontent.com';
    let wsEndpoint = process.env.VUE_APP_EMERIS_PROD_WEBSOCKET_ENDPOINT ?? 'wss://api.emeris.com/v1';

    if (featureRunning('USE_STAGING')) {
      liquidityEndpoint = process.env.VUE_APP_EMERIS_STAGING_LIQUIDITY_ENDPOINT;
      emerisEndpoint = process.env.VUE_APP_EMERIS_STAGING_ENDPOINT;
      wsEndpoint = process.env.VUE_APP_EMERIS_STAGING_WEBSOCKET_ENDPOINT;
    }
    if (featureRunning('USE_DEV')) {
      liquidityEndpoint = process.env.VUE_APP_EMERIS_DEV_LIQUIDITY_ENDPOINT;
      emerisEndpoint = process.env.VUE_APP_EMERIS_DEV_ENDPOINT;
      wsEndpoint = process.env.VUE_APP_EMERIS_DEV_WEBSOCKET_ENDPOINT;
    }
    setStore(store); // make store availabe in some composition functions used in the store itself
    const typedstore = store as RootStoreTyped;
    const initialized = ref(false);
    const router = useRouter();
    const { pools: _pools } = usePoolsFactory();
    const { t } = useI18n({ useScope: 'global' });
    const status = ref(t('appInit.status.initializing'));

    onMounted(async () => {
      useTheme({ updateOnChange: true });
      let gasLimit = parseInt(window.localStorage.getItem('gasLimit'));
      if (!gasLimit) {
        gasLimit = 500000;
        window.localStorage.setItem('gasLimit', gasLimit.toString());
      }
      await typedstore.dispatch(GlobalActionTypes.API.INIT, {
        wsEndpoint: wsEndpoint,
        endpoint: emerisEndpoint,
        gitEndpoint: githubEndpoint,
        rawGitEndpoint: rawGithubEndpoint,
        hub_chain: 'cosmos-hub',
        refreshTime: 5000,
      });
      typedstore.dispatch(GlobalActionTypes.USER.SET_GAS_LIMIT, {
        gasLimit: gasLimit,
      });
      try {
        await typedstore.dispatch(GlobalActionTypes.API.GET_VERIFIED_DENOMS, {
          subscribe: true,
        });
      } catch (e) {
        console.error('Could not load verified denoms: ' + e);
      }
      typedstore
        .dispatch(GlobalActionTypes.API.GET_CHAINS, {
          subscribe: false,
        })
        .then((chains) => {
          for (let chain in chains) {
            typedstore
              .dispatch(GlobalActionTypes.API.GET_CHAIN, {
                subscribe: true,
                params: {
                  chain_name: chain,
                },
              })
              .then((chain) => {
                typedstore.dispatch(GlobalActionTypes.API.GET_CHAIN_STATUS, {
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
              // to worse UX.
              typedstore
                .dispatch(GlobalActionTypes.API.GET_PRICES, {
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
        typedstore.dispatch(GlobalActionTypes.USER.SIGN_IN);
      } else {
        if (autoLoginDemo()) {
          typedstore.dispatch(GlobalActionTypes.USER.SIGN_IN_WITH_WATCHER);
        }
      }
      window.addEventListener('keplr_keystorechange', async () => {
        window.localStorage.setItem('lastEmerisSession', '');
        if (
          typedstore.getters[GlobalGetterTypes.USER.isSignedIn] &&
          !typedstore.getters[GlobalGetterTypes.USER.isDemoAccount]
        ) {
          typedstore.dispatch(GlobalActionTypes.USER.SIGN_IN);
        }
      });

      initialized.value = true;
      if (window.location.pathname !== '/welcome' && !window.localStorage.getItem('isReturnUser')) {
        router.push({ name: 'Welcome', params: { originUrl: window.location.pathname } });
      }
    });

    const getAllAirdrops = async () => {
      const gitAirdropsList = await typedstore.dispatch(GlobalActionTypes.API.GET_GIT_AIRDROPS_LIST, {
        subscribe: false,
      });

      gitAirdropsList.forEach((item) => {
        typedstore.dispatch(GlobalActionTypes.API.GET_AIRDROPS, {
          subscribe: false,
          params: {
            airdropFileName: item.name,
          },
        });
      });
    };

    onMounted(() => {
      typedstore.dispatch(GlobalActionTypes.API.RESET_AIRDROPS);
      if (featureRunning('AIRDROPS_FEATURE')) {
        getAllAirdrops();
      }
    });

    return { initialized, status, showMaintenanceScreen };
  },
  errorCaptured(err) {
    console.error(err);
    return false;
  },
});
</script>

<style lang="scss"></style>
