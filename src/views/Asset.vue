<template>
  <AppLayout>
    <div class="md:flex justify-between">
      <main class="flex flex-col md:col-span-5 lg:col-span-5 w-full max-w-3xl lg:pr-px mb-16 md:mb-0">
        <!-- Info -->

        <header>
          <div class="sm:flex flex-wrap gap-y-3">
            <CircleSymbol :denom="denom" size="md" class="mr-3" />
            <div class="grow flex items-baseline justify-between flex-nowrap">
              <div class="items-baseline">
                <h1 class="text-1 sm:text-2 font-bold sm:mt-0 sm:mr-3"><Denom :name="denom" /></h1>
                <div class="text-muted text-0 grow"><Ticker :name="denom" /></div>
              </div>
              <Price
                v-tippy
                :amount="{ amount: 0, denom }"
                :price-diff-object="priceDiffObject"
                class="text-1 sm:text-2 font-bold text-right"
                content="Current asset price"
                @displayPrice="(value) => (displayPrice = value)"
              />
            </div>
          </div>
        </header>

        <!-- Asset Price Performance Chart -->
        <AreaChart
          v-if="showPriceChart"
          :data-stream="dataStream"
          :display-price="displayPrice"
          :show-loading="showPriceChartLoadingSkeleton"
          @filterChanged="getTokenPrices"
          @priceDiff="setPriceDifference"
        />

        <!-- Balance -->
        <BuyCryptoBanner v-if="!assets.length && denom === 'uatom'" class="mt-16" size="large" />
        <section v-else class="mt-16">
          <header class="space-y-0.5">
            <h2 class="text-muted">{{ $t('pages.asset.balance') }}</h2>
            <Price :amount="{ amount: totalAmount, denom }" :show-zero="true" class="text-3 font-bold" />
            <div class="inline-flex items-center text-muted">
              <AmountDisplay :amount="{ amount: totalAmount, denom }" />
              <ChainDownWarning
                v-if="Object.keys(unavailableChains).length"
                v-bind="Object.values(unavailableChains)[0]"
                :chains="Object.keys(unavailableChains)"
                class="ml-2"
                :icon-size="1.2"
              />
            </div>
          </header>

          <dl
            class="border border-border rounded-xl grid gap-4 p-4 mt-6"
            :class="assetConfig?.stakable ? 'grid-cols-3' : 'grid-cols-2'"
          >
            <div>
              <dt class="text-muted">{{ $t('pages.asset.available') }}</dt>
              <dd class="font-medium mt-0.5">
                <AmountDisplay :amount="{ amount: availableAmount, denom }" />
              </dd>
            </div>

            <div v-if="assetConfig?.stakable">
              <dt class="text-muted">{{ $t('pages.asset.staked') }}</dt>
              <dd class="font-medium mt-0.5">
                <AmountDisplay :amount="{ amount: stakedAmount, denom }" />
              </dd>
            </div>

            <div v-if="assetConfig?.stakable && stakingEnabled">
              <dt class="text-muted">{{ $t('pages.asset.unbonding') }}</dt>
              <dd class="font-medium mt-0.5">
                <AmountDisplay :amount="{ amount: unstakedAmount, denom }" />
              </dd>
            </div>
            <div v-else>
              <dt class="text-muted">{{ $t('pages.asset.pooled') }}</dt>
              <dd class="font-medium mt-0.5">
                <tippy>
                  <AmountDisplay :amount="{ amount: pooledAmount, denom }" />
                  <template #content>
                    <TooltipPools :pools="poolsInvestedWithAsset" :denom="denom" />
                  </template>
                </tippy>
              </dd>
            </div>
          </dl>
        </section>

        <!-- Token Airdrop -->
        <div class="bg-fg w-full p-4 flex items-center justify-between rounded-xl mt-8">
          <div class="flex items-center">
            <img src="~@/assets/images/token-airdrop.png" alt="Token Airdrop" class="w-8 h-8 rounded-full mr-2" />
            <p>ATOM Airdrop</p>
          </div>
          <div class="text-muted">0.123 ATOM</div>
          <div class="flex items-center">
            <div class="mr-6">
              <Button name="Claim" size="sm" variant="secondary" />
            </div>
            <Icon :name="'CloseIcon'" :icon-size="1" />
          </div>
        </div>

        <!-- Staking -->
        <template v-if="stakingEnabled">
          <section v-if="assetConfig?.stakable">
            <StakeTable class="mt-8" :denom="denom" />
          </section>
        </template>

        <!-- Chains -->

        <section v-if="assets.length" class="mt-16">
          <h2 class="text-2 font-bold">{{ $t('pages.asset.chains') }}</h2>

          <ul class="mt-6">
            <li
              v-for="(asset, index) of assets"
              :key="asset.address + '_' + index"
              class="flex items-center justify-between w-full py-5"
            >
              <div class="w-1/3 flex items-center min-w-0">
                <CircleSymbol :denom="denom" :chain-name="asset.on_chain" size="lg" :glow="false" variant="chain" />
                <span class="grow ml-4 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  <ChainName :name="asset.on_chain" />
                </span>
              </div>
              <div class="w-1/3 ml-4 text-muted text-right">
                <AmountDisplay
                  v-if="assetConfig && asset.on_chain === assetConfig.chain_name"
                  :amount="{ amount: parseInt(asset.amount.slice(0, -4)) + stakedAmount + 'uatom', denom }"
                />
                <AmountDisplay v-else :amount="{ amount: asset.amount, denom }" />
              </div>
              <div class="flex items-center justify-end w-1/3 ml-4">
                <span class="text-right font-medium">
                  <Price
                    v-if="assetConfig && asset.on_chain === assetConfig.chain_name"
                    :amount="{ amount: parseInt(asset.amount.slice(0, -4)) + stakedAmount + 'uatom', denom }"
                  />
                  <Price v-else :amount="{ amount: asset.amount, denom }" />
                </span>
                <ChainDownWarning
                  v-if="unavailableChains[asset.on_chain]"
                  v-bind="unavailableChains[asset.on_chain]"
                  class="ml-4"
                />
              </div>
            </li>
          </ul>
        </section>

        <!-- Pools -->

        <section v-if="poolsDisplay.length" class="mt-16">
          <header class="flex items-baseline justify-between">
            <h2 class="text-2 font-bold">{{ $t('pages.asset.pools') }}</h2>
            <router-link
              :to="{ name: 'Pools' }"
              class="font-medium hover:opacity-80 active:opacity-70 transition select-none"
            >
              {{ $t('generic_cta.seeall') }} &rarr;
            </router-link>
          </header>

          <Pools :pools="poolsDisplay" class="mt-8" />
        </section>
      </main>

      <!-- Swap -->

      <aside class="flex flex-col mx-auto md:ml-8 lg:ml-12 md:mr-0 items-end max-w-xs">
        <FeatureRunningConditional name="DEX_AGG">
          <template #deactivated>
            <LiquiditySwap :default-asset="nativeAsset" />
          </template>
          <DexSwap :default-asset="nativeAsset" />
        </FeatureRunningConditional>
        <PoolBanner v-if="isPoolCoin" :name="denom" />
        <!-- Deliberately commented out - we're placing this back soon with APR
        <StakingBanner
          v-else-if="isStakingRunning"
          :display-denom="nativeAsset.displayName"
          :base-denom="nativeAsset.base_denom"
          class="mt-4"
        /> -->
        <BuyCryptoBanner v-if="assets.length && denom == 'uatom'" size="small" class="mt-4" />
      </aside>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import StakeTable from '@/components/asset/StakeTable.vue';
import PoolBanner from '@/components/assets/AssetsTable/PoolBanner.vue';
// import StakingBanner from '@/components/banners/StakingBanner.vue';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import BuyCryptoBanner from '@/components/common/BuyCryptoBanner.vue';
import ChainDownWarning from '@/components/common/ChainDownWarning.vue';
import ChainName from '@/components/common/ChainName.vue';
import AreaChart from '@/components/common/charts/AreaChart.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import Price from '@/components/common/Price.vue';
import Ticker from '@/components/common/Ticker.vue';
import Pools from '@/components/liquidity/Pools.vue';
import LiquiditySwap from '@/components/liquidity/Swap.vue';
import TooltipPools from '@/components/liquidity/TooltipPools.vue';
import DexSwap from '@/components/swap/DexSwap.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import usePools from '@/composables/usePools';
import AppLayout from '@/layouts/AppLayout.vue';
import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';
import { LoadingState } from '@/types/util';
import { getDisplayName, getTicker } from '@/utils/actionHandler';
import { AirdropEligibilityStatus } from '@/utils/airdropEligibility';
import { pageview } from '@/utils/analytics';
import { generateDenomHash, parseCoins } from '@/utils/basic';
import { featureRunning } from '@/utils/FeatureManager';

export default defineComponent({
  name: 'Asset',

  components: {
    // StakingBanner,
    AmountDisplay,
    ChainName,
    Denom,
    Ticker,
    CircleSymbol,
    StakeTable,
    AppLayout,
    Price,
    LiquiditySwap,
    Pools,
    TooltipPools,
    PoolBanner,
    BuyCryptoBanner,
    ChainDownWarning,
    AreaChart,
    DexSwap,
    Icon,
    Button,
  },

  setup() {
    const displayName = ref('');
    const tokenTicker = ref('');
    const displayPrice = ref(0);
    const metaSource = computed(() => {
      return { title: displayName.value };
    });
    useMeta(metaSource);
    const isPoolCoin = computed(() => {
      return denom.value.startsWith('pool');
    });
    const stakingEnabled = featureRunning('STAKING');
    const typedstore = useStore() as RootStoreTyped;
    const route = useRoute();
    const router = useRouter();
    const denom = computed(() => route.params.denom as string);
    pageview({ page_title: 'Asset: ' + route.params.denom, page_path: '/asset/' + route.params.denom });
    const { balances, balancesByDenom, stakingBalancesByChain, nativeBalances, unbondingDelegationsByChain } =
      useAccount();
    const { filterPoolsByDenom, getWithdrawBalances } = usePools();

    const assetConfig = computed(() => {
      const verifiedDenoms = typedstore.getters[GlobalGetterTypes.API.getVerifiedDenoms] || [];
      return verifiedDenoms.find((item) => item.name === denom.value);
    });
    if (!assetConfig.value) {
      router.push('/');
    }

    const nativeAsset = computed(() => {
      return nativeBalances.value.find((item) => item.base_denom === denom.value);
    });

    const assets = computed(() => balancesByDenom(denom.value));
    const unavailableChains = computed(() => {
      const result = {};
      for (const asset of assets.value) {
        const status = typedstore.getters[GlobalGetterTypes.API.getChainStatus]({ chain_name: asset.on_chain });
        if (!status) {
          result[asset.on_chain] = {
            chain: asset.on_chain,
            denom: asset.base_denom,
            unavailable: 'full',
          };
        }
      }
      return result;
    });

    const poolDenom = ref(denom.value);

    watch(
      denom,
      async () => {
        const dexChain = typedstore.getters[GlobalGetterTypes.API.getDexChain];

        if (assetConfig.value && assetConfig.value?.chain_name != dexChain) {
          await typedstore.dispatch(GlobalActionTypes.API.GET_CHAIN, {
            subscribe: false,
            params: { chain_name: dexChain },
          });
          const invPrimaryChannel = typedstore.getters[GlobalGetterTypes.API.getPrimaryChannel]({
            chain_name: dexChain,
            destination_chain_name: assetConfig.value.chain_name,
          });

          poolDenom.value = generateDenomHash(invPrimaryChannel, denom.value);
        }
        displayName.value = await getDisplayName(denom.value, dexChain);
      },
      { immediate: true },
    );

    const poolsWithAsset = computed(() => filterPoolsByDenom(poolDenom.value));

    const availableAmount = computed(() => {
      return assets.value.reduce((acc, item) => acc + parseInt(parseCoins(item.amount)[0].amount), 0);
    });

    const stakingBalance = computed(() => {
      // TODO: This needs fixing for a chain that supports MULTIPLE stakeable assets (if any ever exist)
      if (assetConfig.value && assetConfig.value.chain_name && assetConfig.value.stakable) {
        return stakingBalancesByChain(assetConfig.value.chain_name);
      }
      return 0;
    });
    const unbondingDelegation = computed(() => {
      // TODO: This needs fixing for a chain that supports MULTIPLE stakeable assets (if any ever exist)
      if (assetConfig.value && assetConfig.value.chain_name && assetConfig.value.stakable) {
        return unbondingDelegationsByChain(assetConfig.value.chain_name);
      }
      return [];
    });

    const stakedAmount = computed(() => {
      let staked = stakingBalance.value;
      let totalStakedAmount = 0;
      if (Array.isArray(staked)) {
        for (let i = 0; i < staked.length; i++) {
          let amount = parseFloat(staked[i].amount);
          if (amount) {
            totalStakedAmount += amount;
          }
        }
      }
      return totalStakedAmount;
    });

    const unstakedAmount = computed(() => {
      let totalUnstakedAmount = 0;
      if (unbondingDelegation.value.length > 0) {
        const unstakedAmounts = unbondingDelegation.value
          .map((y) => y.entries)
          .flat()
          .map((z) => z.balance);
        if (unstakedAmounts.length > 0) {
          const unstakedAmount = unstakedAmounts.reduce((acc, item) => +parseInt(item) + acc, 0);
          totalUnstakedAmount = totalUnstakedAmount + unstakedAmount;
        }
      }
      return totalUnstakedAmount;
    });
    const poolsInvestedWithAsset = computed(() => {
      const poolsCopy = JSON.parse(JSON.stringify(poolsWithAsset.value));
      const balancesCopy = JSON.parse(JSON.stringify(balances.value));

      return poolsCopy.filter((item) =>
        balancesCopy.some(
          (item2) => item.pool_coin_denom == item2.base_denom && +parseCoins(item2.amount)[0].amount > 0,
        ),
      );
    });

    const poolsNotInvestedWithAsset = computed(() => {
      const poolsCopy = JSON.parse(JSON.stringify(poolsWithAsset.value));
      const balancesCopy = JSON.parse(JSON.stringify(balances.value));

      return poolsCopy.filter(
        (item) =>
          !balancesCopy.some((item2) => item.pool_coin_denom == item2.base_denom) ||
          balancesCopy.some(
            (item2) => item.pool_coin_denom == item2.base_denom && +parseCoins(item2.amount)[0].amount == 0,
          ),
      );
    });

    const poolsDisplay = computed(() => {
      const fillBy = 3 - poolsInvestedWithAsset.value.length;

      if (fillBy > 0) {
        return poolsInvestedWithAsset.value.concat(poolsNotInvestedWithAsset.value.slice(0, fillBy));
      }

      return poolsInvestedWithAsset.value;
    });

    const pooledAmount = computed(() => {
      let assetPooledAmount = 0;

      for (const pool of poolsInvestedWithAsset.value) {
        const poolCoinBalances = balancesByDenom(pool.pool_coin_denom);
        const withdrawBalances = getWithdrawBalances(
          pool,
          poolCoinBalances.reduce((acc, item) => acc + +parseCoins(item.amount)[0].amount, 0),
        );

        const assetBalanceInPool = withdrawBalances.find((x) => x.denom == poolDenom.value);
        if (assetBalanceInPool) {
          assetPooledAmount += assetBalanceInPool.amount;
        }
      }

      return assetPooledAmount;
    });

    const totalAmount = computed(() => {
      return availableAmount.value + stakedAmount.value + unstakedAmount.value;
    });

    const isAreaChartFeatureRunning = featureRunning('PRICE_CHART_ON_ASSET_PAGE') ? true : false;
    const dataStream = computed(() => {
      return typedstore.getters[GlobalGetterTypes.API.getTokenPrices];
    });

    const getTokenPrices = ref(null);
    let priceDiffObject = ref(null);

    const setPriceDifference = (priceDiff: any) => {
      priceDiffObject.value = priceDiff;
    };

    if (featureRunning('PRICE_CHART_ON_ASSET_PAGE')) {
      watch(displayName, async () => {
        if (displayName.value) {
          getTokenPrices.value('1', true);
        }
      });

      getTokenPrices.value = async (days: string, showSkeleton: boolean) => {
        const chainName = await typedstore.dispatch(GlobalActionTypes.API.GET_COINGECKO_ID_BY_NAMES, {
          subscribe: false,
          params: {
            token: tokenTicker.value.toLowerCase(),
            showSkeleton: false,
          },
        });
        if (chainName) {
          await typedstore.dispatch(GlobalActionTypes.API.GET_TOKEN_PRICES, {
            subscribe: false,
            params: {
              token_id: chainName,
              days,
              currency: 'usd',
              showSkeleton,
            },
          });
        }
      };
    }

    const isDenomAPool = computed(() => {
      return denom.value.includes('pool');
    });

    const showPriceChart = computed(() => {
      return isAreaChartFeatureRunning && !isDenomAPool.value;
    });

    const showPriceChartLoadingSkeleton = computed(() => {
      return (
        typedstore.getters[GlobalGetterTypes.API.getTokenPricesLoadingStatus] === LoadingState.LOADING ||
        typedstore.getters[GlobalGetterTypes.API.getCoinGeckoIdLoadingStatus] === LoadingState.LOADING
      );
    });

    onUnmounted(() => {
      typedstore.dispatch(GlobalActionTypes.API.RESET_TOKEN_PRICES);
    });

    onMounted(async () => {
      tokenTicker.value = await getTicker(denom.value, typedstore.getters[GlobalGetterTypes.API.getDexChain]);
    });

    const isStakingRunning = featureRunning('STAKING');
    const isAirdropsRunning = featureRunning('AIRDROPS_FEATURE');

    const airdrops = computed(() => {
      return typedstore.getters[GlobalGetterTypes.API.getAirdrops];
    });

    const assetAirdrop = computed(() => {
      return airdrops.value.find((item) => item.tokenTicker === tokenTicker.value);
    });

    const isDemoAccount = computed(() => {
      return (
        !typedstore.getters[GlobalGetterTypes.USER.isSignedIn] ||
        typedstore.getters[GlobalGetterTypes.USER.isDemoAccount]
      );
    });

    const showAirdropCard = computed(() => {
      return (
        !isDemoAccount.value &&
        assetAirdrop.value.eligibility !== AirdropEligibilityStatus.ENDED &&
        assetAirdrop.value.eligibility !== AirdropEligibilityStatus.NOT_ELIGIBLE &&
        assetAirdrop.value.eligibility !== AirdropEligibilityStatus.NOT_AVAILABLE
      );
    });

    return {
      nativeAsset,
      assetConfig,
      denom,
      assets,
      unavailableChains,
      poolsDisplay,
      poolsInvestedWithAsset,
      availableAmount,
      stakedAmount,
      unstakedAmount,
      pooledAmount,
      totalAmount,
      isPoolCoin,
      stakingEnabled,
      dataStream,
      getTokenPrices,
      showPriceChart,
      showPriceChartLoadingSkeleton,
      priceDiffObject,
      setPriceDifference,
      isStakingRunning,
      isAirdropsRunning,
      displayPrice,
      assetAirdrop,
      showAirdropCard,
    };
  },
});
</script>

<style lang="scss" scoped></style>
