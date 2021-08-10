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
            v-for="asset in orderUserBalances(balancesWithName)"
            :key="asset.denom"
            class="assets-table__row group cursor-pointer"
            @click="handleClick(asset)"
          >
            <td class="py-5 align-middle group-hover:bg-fg transition">
              <div class="flex items-center">
                <CircleSymbol :denom="asset.denom" />
                <div class="ml-4 whitespace-nowrap overflow-hidden overflow-ellipsis min-w-0">
                  <span class="font-medium"><Denom :name="asset.denom" /></span>
                  <LPAsset :name="asset.denom" />
                </div>
              </div>
            </td>

            <td class="py-5 align-middle text-right group-hover:bg-fg transition">
              <Price :amount="{ denom: asset.denom, amount: null }" />
            </td>

            <td class="py-5 align-middle text-right group-hover:bg-fg transition">
              <Price class="font-medium" :amount="{ denom: asset.denom, amount: asset.totalAmount }" />
              <div class="text-muted mt-0.5 -text-1">
                <AmountDisplay :amount="{ denom: asset.denom, amount: asset.totalAmount }" />
              </div>
            </td>
            <td class="mt-0.5 pl-4 group-hover:bg-fg transition">
              <AssetChains :denom="asset.denom" :balances="balances" :show-description="true" class="ml-auto" />
            </td>
          </tr>
        </template>
        <template v-else-if="variant === 'full'">
          <tr
            v-for="asset in orderAllBalances(balancesWithMarketCap)"
            :key="asset.denom"
            class="assets-table__row group cursor-pointer"
            @click="handleClick(asset)"
          >
            <td class="py-5 align-middle group-hover:bg-fg transition">
              <div class="flex items-center">
                <CircleSymbol :denom="asset.denom" />
                <div class="ml-4 whitespace-nowrap overflow-hidden overflow-ellipsis min-w-0">
                  <span class="font-medium"><Denom :name="asset.denom" /></span>
                  <LPAsset :name="asset.denom" />
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
              {{ formatUsd(getMarketCap(asset.denom)) }}
            </td>
          </tr>
        </template>
        <template v-else>
          <tr :key="asset.denom" class="assets-table__row group cursor-pointer" @click="handleClick(asset)">
            <td class="py-5 align-middle group-hover:bg-fg transition">
              <div class="flex items-center">
                <CircleSymbol :denom="asset.denom" />
                <div class="ml-4 whitespace-nowrap overflow-hidden overflow-ellipsis min-w-0">
                  <span class="font-medium"><Denom :name="asset.denom" /></span>
                  <LPAsset :name="asset.denom" />
                </div>
              </div>
            </td>

            <td class="py-5 align-middle text-right group-hover:bg-fg transition">
              <Price :amount="{ denom: asset.denom, amount: null }" />
            </td>
          </tr>
        </template>
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
import groupBy from 'lodash.groupby';
import orderBy from 'lodash.orderby';
import { computed, defineComponent, PropType, ref } from 'vue';

import AssetChains from '@/components/assets/AssetChainsIndicator/AssetChains.vue';
import LPAsset from '@/components/assets/AssetsTable/LPAsset.vue';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import Price from '@/components/common/Price.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { useStore } from '@/store';
import { Balances } from '@/types/api';
import { getDisplayName } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';
import getPrice from '@/utils/getPrice';

type TableStyleType = 'full' | 'balance';

export default defineComponent({
  name: 'AssetsTable',

  components: { AmountDisplay, AssetChains, CircleSymbol, Denom, Button, Icon, LPAsset, Price, Ticker },

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
      type: Array as PropType<Balances>,
      required: true,
    },
  },

  emits: ['row-click'],

  setup(props, { emit }) {
    const store = useStore();
    const currentLimit = ref(props.limitRows);

    const verifiedDenoms = computed(() => {
      return store.getters['demeris/getVerifiedDenoms'] ?? [];
    });

    const allBalances = computed<Balances>(() => {
      let balances = props.balances;
      if (props.showAllAssets) {
        balances = [
          ...(props.balances as Balances),
          ...verifiedDenoms.value.map((denom) => ({
            base_denom: denom.name,
            on_chain: denom.chain_name,
            amount: '0' + denom.name,
          })),
        ];
      }

      if (props.hideLpAssets) {
        balances = balances.filter((balance) => {
          if (balance.base_denom.substring(0, 4) !== 'pool') {
            return balance;
          }
        });
        return balances as Balances;
      }

      if (props.hideZeroAssets) {
        balances = balances.filter((balance) => {
          if (balance.amount.charAt(0) !== '0') {
            return balance;
          }
        });
      }

      return balances as Balances;
    });

    const balancesByAsset = computed(() => {
      const denomsAggregate = groupBy(allBalances.value, 'base_denom');

      const summary = Object.entries(denomsAggregate).map(([denom, balances]) => {
        const totalAmount = balances.reduce((acc, item) => +parseCoins(item.amount)[0].amount + acc, 0);
        const chainsNames = balances.map((item) => item.on_chain);

        return {
          denom,
          totalAmount,
          chainsNames,
        };
      });

      const sortedSummary = summary.sort((a, b) => (a.totalAmount > b.totalAmount ? -1 : 1));
      return sortedSummary;
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

    const balancesWithName = computed(() => {
      let balances = balancesWithValue.value;
      balances.map(async (b) => {
        let name = await getDisplayName(b.denom, store.getters['demeris/getDexChain']);
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

    const orderUserBalances = (balances) => {
      let tokens = [];
      let lpTokens = [];
      balances.map((x) => {
        if (x.name?.includes('Gravity')) {
          lpTokens.push(x);
        } else {
          tokens.push(x);
        }
      });
      tokens = orderBy(tokens, [(x) => x.value.value, 'name'], ['desc', 'asc']);
      lpTokens = orderBy(lpTokens, [(x) => x.value.value], ['desc']);
      lpTokens = lpTokens.sort((a, b) => a.name.localeCompare(b.name, 0, { numeric: true, sensitivity: 'base' }));
      return tokens.concat(lpTokens).slice(0, currentLimit.value);
    };

    const orderAllBalances = (balances) => {
      let tokens = [];
      let lpTokens = [];
      balances.map((x) => {
        if (x.name?.includes('Gravity')) {
          lpTokens.push(x);
        } else {
          tokens.push(x);
        }
      });
      tokens = orderBy(tokens, [(x) => x.marketCap || '', (x) => x.value.value, 'name'], ['desc', 'desc', 'asc']);
      lpTokens = orderBy(lpTokens, [(x) => x.marketCap || '', (x) => x.value.value], ['desc', 'desc']);
      lpTokens = lpTokens.sort((a, b) => a.name.localeCompare(b.name, 0, { numeric: true, sensitivity: 'base' }));
      return tokens.concat(lpTokens).slice(0, currentLimit.value);
    };

    const getMarketCap = (denom: string) => {
      const price = store.getters['demeris/getPrice']({ denom });
      const supply = store.getters['demeris/getSupply']({ denom });
      let marketCap = price * supply;
      return marketCap;
    };
    const formatUsd = (amount: number) => {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });

      return amount ? formatter.format(amount) : '-';
    };

    const viewAllHandler = () => {
      currentLimit.value = undefined;
    };

    const handleClick = (asset: Record<string, string>) => {
      emit('row-click', asset);
    };

    return {
      allBalances,
      balancesByAsset,
      balancesWithName,
      balancesWithMarketCap,
      getMarketCap,
      formatUsd,
      handleClick,
      viewAllHandler,
      orderUserBalances,
      orderAllBalances,
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
