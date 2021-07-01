<template>
  <table class="assets-table">
    <thead v-if="showHeaders">
      <tr>
        <th class="text-left">Asset</th>
        <th v-if="displayStyle !== 'summary'" class="text-right">Price</th>
        <!--<th v-if="displayStyle === 'full'" class="text-right">24h %</th>//-->
        <th v-if="displayStyle === 'full'" class="text-right">Amount</th>
        <th class="text-right">Balance</th>
        <th v-if="displayStyle !== 'summary'">
          <!-- Chains -->
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="asset in balancesByAsset" :key="asset.denom" class="assets-table__row" @click="handleClick(asset)">
        <td class="assets-table__row__asset">
          <div class="assets-table__row__asset__avatar" />
          <div class="assets-table__row__asset__denom">
            <Denom :name="asset.denom" />
            <div
              v-if="displayStyle === 'summary' && asset.chainsNames.length > 1"
              class="assets-table__row__asset__denom__chains s-minus"
            >
              <AssetChainsIndicator :denom="asset.denom" :balances="balances" :show-indicators="false" />
            </div>
          </div>
        </td>

        <td v-if="displayStyle !== 'summary'" class="assets-table__row__price text-right">
          <Price :amount="{ denom: asset.denom, amount: null }" />
          <!--<div
            v-if="displayStyle !== 'full'"
            class="assets-table__row__price__trending assets-table__row__trending__wrapper s-minus"
          >
            <TrendingUpIcon class="assets-table__row__trending__icon" />
            <span class="assets-table__row__trending__value">52.21%</span>
          </div>//-->
        </td>

        <!--<td v-if="displayStyle === 'full'" class="assets-table__row__trending">
          <div class="assets-table__row__trending__wrapper">
            <TrendingUpIcon class="assets-table__row__trending__icon" />
            <span class="assets-table__row__trending__value">52.21%</span>
          </div>
        </td>//-->

        <td v-if="displayStyle === 'full'" class="assets-table__row__amount text-right">
          <span><AmountDisplay :amount="{ denom: asset.denom, amount: asset.totalAmount }" /></span>
        </td>

        <td class="assets-table__row__balance text-right">
          <Price :amount="{ denom: asset.denom, amount: asset.totalAmount }" />
          <div v-if="displayStyle !== 'full'" class="assets-table__row__balance__amount s-minus">
            <AmountDisplay :amount="{ denom: asset.denom, amount: asset.totalAmount }" />
          </div>
        </td>

        <td v-if="displayStyle !== 'summary'" class="assets-table__row__chains">
          <div class="assets-table__row__chains__wrapper">
            <AssetChainsIndicator :denom="asset.denom" :balances="balances.filter((x) => x.verified)" />

            <button class="assets-table__row__arrow-button" @click="handleClick(asset)">
              <ChevronRightIcon class="assets-table__row__arrow-button__icon" />
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { parseCoins } from '@cosmjs/launchpad';
import groupBy from 'lodash.groupby';
import { computed, defineComponent, PropType } from 'vue';

import AssetChainsIndicator from '@/components/assets/AssetChainsIndicator';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import Denom from '@/components/common/Denom.vue';
import ChevronRightIcon from '@/components/common/Icons/ChevronRightIcon.vue';
import Price from '@/components/common/Price.vue';
import { useStore } from '@/store';
import { Balances } from '@/types/api';

type TableStyleType = 'full' | 'compact' | 'summary';

export default defineComponent({
  name: 'AssetsTable',

  components: { AssetChainsIndicator, ChevronRightIcon, Denom, Price, AmountDisplay },

  props: {
    displayStyle: {
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

    const verifiedDenoms = computed(() => {
      return store.getters['demeris/getVerifiedDenoms'];
    });

    const allBalances = computed<Balances>(() => {
      if (props.showAllAssets) {
        return [
          ...(props.balances as Balances),
          ...verifiedDenoms.value.map((denom) => ({
            base_denom: denom.name,
            on_chain: denom.chain_name,
            amount: 0,
          })),
        ];
      }

      return props.balances as Balances;
    });

    const balancesByAsset = computed(() => {
      const denomsAggregate = groupBy(allBalances.value, 'base_denom');

      const summary = Object.entries(denomsAggregate).map(([denom, balances]) => {
        const totalAmount = balances.reduce(
          (acc, item) => +parseCoins(item.amount + item.base_denom)[0].amount + acc,
          0,
        );
        const chainsNames = balances.map((item) => item.on_chain);

        return {
          denom,
          totalAmount,
          chainsNames,
        };
      });

      const sortedSummary = summary.sort((a, b) => (a.totalAmount > b.totalAmount ? 1 : -1));
      return sortedSummary.slice(0, props.limitRows as number);
    });

    const handleClick = (asset: Record<string, string>) => {
      emit('row-click', asset);
    };

    return { balancesByAsset, handleClick };
  },
});
</script>

<style lang="scss" scoped>
.assets-table {
  width: calc(100% + 4rem);
  margin-inline: -2rem;
  table-layout: fixed;

  .text-right {
    text-align: right;
  }

  .text-left {
    text-align: left;
  }

  th {
    color: rgba(0, 0, 0, 0.66);
    vertical-align: middle;
    font-size: 1.3rem;
    font-weight: 400;
    padding-bottom: 2rem;
  }

  td,
  th {
    transition: all 100ms ease-in;

    &:first-child {
      padding-left: 2rem;
    }

    &:last-child {
      padding-right: 2rem;
    }
  }

  &__row {
    cursor: pointer;

    &:hover {
      td {
        background: rgba(0, 0, 0, 0.03);
      }

      td:first-child {
        border-top-left-radius: 0.8rem;
        border-bottom-left-radius: 0.8rem;
      }

      td:last-child {
        border-top-right-radius: 0.8rem;
        border-bottom-right-radius: 0.8rem;
      }
    }

    &__asset {
      padding: 2rem 0;
      min-width: 1rem;
      font-weight: 600;
      text-transform: uppercase;
      display: flex;
      align-items: center;

      &__avatar {
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 2.4rem;
        background: rgba(0, 0, 0, 0.1);
        margin-right: 1.6rem;
      }

      &__denom {
        &__chains {
          margin-top: 0.8rem;
        }
      }
    }

    &__trending {
      &__wrapper {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        color: rgb(6, 126, 62);
      }

      &__icon {
        width: 1.6rem;
        height: 1.6rem;
        margin-right: 0.4rem;
      }
    }

    &__price {
      &__trending {
        margin-top: 0.8rem;
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
        margin-top: 0.8rem;
      }
    }

    &__chains {
      &__wrapper {
        margin-left: 1rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }

    &__arrow-button {
      padding: 0.2rem;
      color: rgba(0, 0, 0, 0.4);
      margin-left: 1rem;

      &__icon {
        width: 1.6rem;
        height: 1.6rem;
      }
    }
  }

  .asset-chains-indicator {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
