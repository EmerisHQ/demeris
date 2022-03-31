<template>
  <div class="relative flex flex-col">
    <table class="assets-table -ml-6">
      <colgroup v-if="variant === 'balance'">
        <col width="35%" />
        <col width="20%" />
        <col width="35%" />
        <col width="10%" />
      </colgroup>

      <thead v-if="showHeaders" class="hidden md:table-header-group text-muted">
        <tr>
          <th class="align-middle -text-1 font-normal py-4 pr-0 sticky top-0 z-20 bg-app text-left">
            {{ $t('context.assets.asset') }}
          </th>
          <th
            v-if="variant === 'full'"
            class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-left"
          >
            {{ $t('context.assets.ticker') }}
          </th>
          <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right">
            {{ $t('context.assets.price') }}
          </th>
          <th
            v-if="variant === 'full'"
            class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right"
          >
            {{ $t('context.assets.marketCap') }}
          </th>
          <th
            v-if="variant === 'balance'"
            class="align-middle -text-1 font-normal py-4 pl-0 sticky top-0 z-20 bg-app text-right"
          >
            {{ $t('context.assets.balance') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <template v-if="variant === 'balance'">
          <tr
            v-for="(asset, index) in orderedUserBalances"
            :key="index"
            class="assets-table__row group cursor-pointer"
            data-cy="asset-row"
            @click="handleClick(asset)"
          >
            <td class="py-5 align-middle group-hover:bg-fg transition">
              <div class="flex items-center">
                <CircleSymbol
                  v-if="!asset.denom.includes('pool')"
                  :key="'' + asset.denom + index"
                  :denom="asset.denom"
                />
                <div v-else class="w-8 h-8 bg-text rounded-full text-center pt-1.5">
                  <Icon name="GravityIcon" :icon-size="1.2" />
                </div>
                <div class="ml-4 whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
                  <span class="font-medium"><Denom :name="asset.denom" /></span>
                  <LPAsset :name="asset.denom" />
                </div>
              </div>
            </td>

            <td class="py-5 align-middle text-right group-hover:bg-fg transition">
              <Price :amount="{ denom: asset.denom, amount: null }" />
            </td>

            <td class="py-5 align-middle text-right group-hover:bg-fg transition">
              <Price class="font-medium" :amount="{ denom: asset.denom, amount: asset.totalAmount + '' }" />
              <div class="text-muted mt-0.5 -text-1">
                <AmountDisplay :amount="{ denom: asset.denom, amount: asset.totalAmount + '' }" />
              </div>
            </td>
            <td class="mt-0.5 pl-4 group-hover:bg-fg transition">
              <div class="flex items-center justify-center space-x-3">
                <AssetChains :denom="asset.denom" :balances="balances" :show-description="true" class="ml-auto" />
                <ChainDownWarning
                  v-if="Object.values(getUnavailableChains(asset)).length"
                  v-bind="Object.values(getUnavailableChains(asset))[0]"
                  :chains="Object.keys(getUnavailableChains(asset))"
                />
              </div>
            </td>
          </tr>
        </template>
        <template v-else-if="variant === 'full'">
          <tr
            v-for="(asset, index) in orderedAllBalances"
            :key="index"
            class="assets-table__row group cursor-pointer"
            @click="handleClick(asset)"
          >
            <td class="py-5 align-middle group-hover:bg-fg transition">
              <div class="flex items-center">
                <CircleSymbol :key="'' + asset.denom + index" :denom="asset.denom" />
                <div class="ml-4 whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
                  <span class="font-medium"><Denom :name="asset.denom" /></span>
                  <LPAsset :name="asset.denom" />
                  <div class="-text-1 font-normal text-muted mt-0.5">
                    <ChainName :name="asset.chainsNames[0]" />
                  </div>
                </div>
              </div>
            </td>

            <td class="py-5 align-middle text-left text-muted group-hover:bg-fg transition">
              <Ticker :name="asset.denom" />
            </td>

            <td class="py-5 align-middle text-right group-hover:bg-fg transition">
              <Price :amount="{ denom: asset.denom, amount: null }" />
            </td>

            <td class="py-5 align-middle text-right group-hover:bg-fg transition">
              <CurrencyDisplay :value="getMarketCap(asset.denom)" show-dash />
            </td>
          </tr>
        </template>
        <template v-else> </template>
      </tbody>
    </table>

    <Button
      v-if="balancesByAsset.length > balancesFiltered.length"
      size="sm"
      variant="secondary"
      rounded
      class="view-all-assets mx-auto mt-6"
      :click-function="
        () => {
          viewAllHandler();
        }
      "
      :name="`${$t('context.assets.viewAll')} (${balancesByAsset.length})`"
    >
      <template #right><Icon name="CaretDownIcon" :icon-size="1" /></template>
    </Button>
  </div>
</template>

<script lang="ts">
import { EmerisAPI } from '@emeris/types';
import groupBy from 'lodash.groupby';
import orderBy from 'lodash.orderby';
import { computed, ComputedRef, defineComponent, PropType, ref, toRefs } from 'vue';
import { useStore } from 'vuex';

import AssetChains from '@/components/assets/AssetChainsIndicator/AssetChains.vue';
import LPAsset from '@/components/assets/AssetsTable/LPAsset.vue';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainDownWarning from '@/components/common/ChainDownWarning.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import Price from '@/components/common/Price.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { getDisplayName } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';
import { featureRunning } from '@/utils/FeatureManager';
import getPrice from '@/utils/getPrice';

type TableStyleType = 'full' | 'balance';

export default defineComponent({
  name: 'AssetsTable',

  components: {
    AmountDisplay,
    AssetChains,
    ChainDownWarning,
    ChainName,
    CircleSymbol,
    Denom,
    Button,
    Icon,
    LPAsset,
    Price,
    Ticker,
    CurrencyDisplay,
  },

  props: {
    variant: {
      type: String as PropType<TableStyleType>,
      default: 'full',
    },
    showHeaders: {
      type: Boolean,
      default: true,
    },
    showAllAssets: {
      type: Boolean,
      default: true,
    },
    hideLpAssets: {
      type: Boolean,
      default: false,
    },
    hideZeroAssets: {
      type: Boolean,
      default: false,
    },
    limitRows: {
      type: Number,
      default: undefined,
    },
    balances: {
      type: Array as PropType<EmerisAPI.Balances>,
      required: true,
    },
  },

  emits: ['row-click'],

  setup(props, { emit }) {
    const store = useStore() as RootStoreTyped;
    const currentLimit = ref(props.limitRows);
    const { stakingBalances, unbondingDelegations } = useAccount();
    const verifiedDenoms = computed(() => {
      return store.getters[GlobalGetterTypes.API.getVerifiedDenoms] ?? [];
    });
    const propsRef = toRefs(props);
    const allBalances = computed(() => {
      let balances = propsRef.balances.value;
      if (props.showAllAssets) {
        balances = [
          ...propsRef.balances.value,
          ...verifiedDenoms.value.map((denom) => ({
            base_denom: denom.name,
            on_chain: denom.chain_name,
            amount: '0' + denom.name,
            verified: true,
            address: '',
            ibc: {},
          })),
        ];
      }

      if (props.hideLpAssets) {
        balances = balances.filter((balance) => {
          if (balance.base_denom.substring(0, 4) !== 'pool') {
            return balance;
          }
        });
        return balances;
      }

      if (props.hideZeroAssets) {
        balances = balances.filter((balance) => {
          if (balance.amount.charAt(0) !== '0') {
            return balance;
          }
        });
      }
      return balances;
    });

    const balancesByAsset = computed(() => {
      const denomsAggregate = groupBy(allBalances.value, 'base_denom');
      const verifiedDenoms = store.getters[GlobalGetterTypes.API.getVerifiedDenoms];
      const summary = Object.entries(denomsAggregate).map(([denom, balances = []]) => {
        let totalAmount = balances.reduce((acc, item) => +parseCoins(item.amount)[0].amount + acc, 0);
        const chainsNames = balances.map((item) => item.on_chain);
        const denom_details = verifiedDenoms.filter((x) => x.name == denom && x.stakable);
        if (denom_details.length > 0) {
          const stakedAmounts = stakingBalances.value.filter((x) => x.chain_name == denom_details[0].chain_name);
          if (stakedAmounts.length > 0) {
            const stakedAmount = stakedAmounts.reduce((acc, item) => +parseInt(item.amount) + acc, 0);
            totalAmount = totalAmount + stakedAmount;
          }
          if (featureRunning('STAKING')) {
            const unstakedAmounts = unbondingDelegations.value
              .filter((x) => x.chain_name == denom_details[0].chain_name)
              .map((y) => y.entries)
              .flat()
              .map((z) => z.balance);
            if (unstakedAmounts.length > 0) {
              const unstakedAmount = unstakedAmounts.reduce((acc, item) => +parseInt(item) + acc, 0);
              totalAmount = totalAmount + unstakedAmount;
            }
          }
        }
        return {
          denom,
          totalAmount,
          chainsNames,
        };
      });
      if (allBalances.value.length > 0) {
        for (const denom of verifiedDenoms.filter((x) => x.stakable)) {
          const stakedAmounts = stakingBalances.value.filter((x) => x.chain_name == denom.chain_name);
          if (!summary.find((x) => x.denom == denom.name) && stakedAmounts.length > 0) {
            summary.push({
              chainsNames: [denom.chain_name],
              denom: denom.name,
              totalAmount: stakedAmounts.reduce((acc, item) => +parseInt(item.amount) + acc, 0),
            });
          }
        }
      }
      const sortedSummary = summary.sort((a, b) => (a.totalAmount > b.totalAmount ? -1 : 1));
      return sortedSummary;
    });

    const balancesFiltered = computed(() => {
      return balancesByAsset.value.slice(0, currentLimit.value);
    });

    const balancesWithValue = computed(() => {
      let balances = balancesByAsset.value;

      if (balances.length > 0) {
        balances.map((b) => {
          let value = getPrice({ denom: b.denom, amount: b.totalAmount.toString() });
          (b as any).value = value;
        });
      }
      return balances;
    });

    const balancesWithName: ComputedRef<
      {
        denom: string;
        totalAmount: number;
        chainsNames: string[];
        marketCap?: number;
        value?: {
          value: string;
        };
      }[]
    > = computed(() => {
      let balances = balancesWithValue.value;
      balances.map(async (b) => {
        let name = await getDisplayName(b.denom, store.getters[GlobalGetterTypes.API.getDexChain]);
        (b as any).name = name;
      });
      return balances;
    });

    const balancesWithMarketCap = computed(() => {
      let balances = balancesWithName.value;
      balances.map((b) => {
        let marketCap = getMarketCap(b.denom);
        if (marketCap) {
          (b as any).marketCap = marketCap;
        }
      });
      return balances;
    });

    const getUnavailableChains = (asset) => {
      const result = {};
      const statusMap = asset.chainsNames.reduce((acc, chain) => {
        acc[chain] = store.getters[GlobalGetterTypes.API.getChainStatus]({ chain_name: chain });
        return acc;
      }, {});

      for (const chain of asset.chainsNames) {
        if (!statusMap[chain]) {
          result[chain] = {
            chain: chain,
            denom: asset.denom,
            unavailable: 'part',
          };
        }
      }

      const isFullUnavailable = Object.values(statusMap).every((item) => item === false);

      if (isFullUnavailable) {
        result[Object.keys(result)[0]].unavailable = 'full';
      }
      return result;
    };

    const orderedUserBalances = computed(() => {
      let tokens = orderBy(balancesWithName.value, [(x) => x.value.value, 'name'], ['desc', 'asc']);
      return tokens.slice(0, currentLimit.value);
    });

    const orderedAllBalances = computed(() => {
      let tokens = orderBy(
        balancesWithMarketCap.value,
        [(x) => x.marketCap || '', (x) => x.value.value, 'name'],
        ['desc', 'desc', 'asc'],
      );
      return tokens.slice(0, currentLimit.value);
    });

    const getMarketCap = (denom: string) => {
      const price = store.getters[GlobalGetterTypes.API.getPrice]({ denom });
      const supply = store.getters[GlobalGetterTypes.API.getSupply]({ denom });
      let marketCap = price * supply;
      return marketCap;
    };

    const viewAllHandler = () => {
      currentLimit.value = undefined;
    };

    const handleClick = (asset) => {
      emit('row-click', asset);
    };

    return {
      allBalances,
      balancesByAsset,
      balancesFiltered,
      balancesWithName,
      balancesWithMarketCap,
      getMarketCap,
      handleClick,
      viewAllHandler,
      getUnavailableChains,
      orderedUserBalances,
      orderedAllBalances,
    };
  },
});
</script>

<style lang="scss" scoped>
.assets-table {
  width: calc(100% + 3rem);

  td,
  th {
    &:first-child {
      padding-left: 1.5rem;
      border-top-left-radius: 0.75rem;
      border-bottom-left-radius: 0.75rem;
    }

    &:last-child {
      padding-right: 1.5rem;
      border-top-right-radius: 0.75rem;
      border-bottom-right-radius: 0.75rem;
    }
  }
}
</style>
