<template>
  <div class="assets-table__wrapper">
    <table class="assets-table">
      <colgroup v-if="variant === 'balance'">
        <col width="35%" />
        <col width="20%" />
        <col width="35%" />
        <col width="10%" />
      </colgroup>

      <thead v-if="showHeaders" class="text-muted">
        <tr>
          <th class="bg-app text-left">{{ $t('context.assets.asset') }}</th>
          <th v-if="variant === 'full'" class="bg-app text-left">{{ $t('context.assets.ticker') }}</th>
          <th class="bg-app text-right">{{ $t('context.assets.price') }}</th>
          <th v-if="variant === 'full'" class="bg-app text-right">{{ $t('context.assets.marketCap') }}</th>
          <th v-if="variant === 'balance'" class="bg-app text-right">{{ $t('context.assets.balance') }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="asset in balancesFiltered" :key="asset.denom" class="assets-table__row" @click="handleClick(asset)">
          <td class="assets-table__row__asset">
            <CircleSymbol :denom="asset.denom" />
            <div class="assets-table__row__asset__denom">
              <Denom :name="asset.denom" />
              <LPAsset :name="asset.denom" />
            </div>
          </td>

          <td v-if="variant === 'full'" class="assets-table__row__ticker text-left text-muted">
            <Ticker :name="asset.denom" />
          </td>

          <td class="assets-table__row__price text-right">
            <Price :amount="{ denom: asset.denom, amount: null }" />
          </td>

          <td v-if="variant === 'full'" class="assets-table__row__market-cap text-right">
            {{ getFormattedMarketCap(asset.denom) }}
          </td>

          <td v-if="variant === 'balance'" class="assets-table__row__balance text-right">
            <Price :amount="{ denom: asset.denom, amount: asset.totalAmount }" />
            <div class="assets-table__row__balance__amount -text-1">
              <AmountDisplay :amount="{ denom: asset.denom, amount: asset.totalAmount }" />
            </div>
          </td>
          <td v-if="variant === 'balance'" class="assets-table__row__chains mt-0.5">
            <AssetChains :denom="asset.denom" :balances="balances" :show-description="true" />
          </td>
        </tr>
      </tbody>
    </table>

    <button
      v-if="balancesByAsset.length > balancesFiltered.length"
      class="assets-table__view-all shadow-button rounded-xl"
      @click="viewAllHandler"
    >
      <span class="assets-table__view-all__label">
        {{ $t('context.assets.viewAll') }} ({{ balancesByAsset.length }})
      </span>
      <Icon name="CaretDownIcon" :icon-size="0.75" />
    </button>
  </div>
</template>

<script lang="ts">
import groupBy from 'lodash.groupby';
import { computed, defineComponent, PropType, ref } from 'vue';

import AssetChains from '@/components/assets/AssetChainsIndicator/AssetChains.vue';
import LPAsset from '@/components/assets/AssetsTable/LPAsset.vue';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import Price from '@/components/common/Price.vue';
import Ticker from '@/components/common/Ticker.vue';
import Icon from '@/components/ui/Icon.vue';
import { useStore } from '@/store';
import { Balances } from '@/types/api';
import { parseCoins } from '@/utils/basic';

type TableStyleType = 'full' | 'balance';

export default defineComponent({
  name: 'AssetsTable',

  components: { AmountDisplay, AssetChains, CircleSymbol, Denom, Icon, LPAsset, Price, Ticker },

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

    const balancesFiltered = computed(() => {
      return balancesByAsset.value.slice(0, currentLimit.value);
    });

    const getFormattedMarketCap = (denom: string) => {
      const price = store.getters['demeris/getPrice']({ denom });
      const supply = store.getters['demeris/getSupply']({ denom });
      const marketCap = price * supply;
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });

      return marketCap ? formatter.format(marketCap) : '-';
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
      balancesFiltered,
      getFormattedMarketCap,
      handleClick,
      viewAllHandler,
    };
  },
});
</script>

<style lang="scss" scoped>
.assets-table {
  width: calc(100% + 2.5rem);
  margin-inline: -1.25rem;
  table-layout: fixed;

  &__wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .text-right {
    text-align: right;
  }

  .text-left {
    text-align: left;
  }

  th {
    vertical-align: middle;
    font-size: 0.8125rem;
    font-weight: 400;
    padding: 0.9375rem 0;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  td,
  th {
    transition: all 150ms ease-in;

    &:first-child {
      padding-left: 1.25rem;
    }

    &:last-child {
      padding-right: 1.25rem;
    }
  }

  &__row {
    cursor: pointer;

    &:hover {
      td {
        background: var(--fg);
      }

      td:first-child {
        border-top-left-radius: 0.75rem;
        border-bottom-left-radius: 0.75rem;
      }

      td:last-child {
        border-top-right-radius: 0.75rem;
        border-bottom-right-radius: 0.75rem;
      }
    }

    &__asset {
      padding: 1.25rem 0;
      font-weight: 600;
      display: flex;
      align-items: center;

      &__denom {
        margin-left: 1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &__price {
      &__trending {
        margin-top: 0.5rem;
      }
    }

    &__amount {
      text-transform: uppercase;
      color: rgba(0, 0, 0, 0.66);
    }

    &__balance {
      font-weight: 600;

      &__amount {
        color: var(--muted);
        margin-top: 0.5rem;
      }
    }
    &__chains {
      padding-left: 1.6rem;
    }
  }

  &__view-all {
    margin: 1.5rem auto 0 auto;
    padding: 0.75rem 1.25rem;
    display: flex;
    align-items: center;
    border-radius: 3.5rem;
    font-weight: 600;
    font-size: 0.8125rem;

    &__label {
      margin-right: 0.4375rem;
    }
  }
}
</style>
