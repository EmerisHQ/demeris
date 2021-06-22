<template>
  <table class="assets-table">
    <thead>
      <tr>
        <th class="text-left">Asset</th>
        <th v-if="style !== 'summary'" class="text-right">Price</th>
        <th v-if="style === 'full'" class="text-right">24h %</th>
        <th v-if="style === 'full'" class="text-right">Amount</th>
        <th class="text-right">Balance</th>
        <th v-if="style !== 'summary'">
          <!-- Chains -->
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="asset in balancesByAsset" :key="asset.denom" class="assets-table__row" @click="handleClick(asset)">
        <td class="assets-table__row__asset">
          <div class="assets-table__row__asset__avatar" />
          <div class="assets-table__row__asset__denom">
            <Denom :name="asset.denom" chain-name="cosmos-hub" />
            <div
              v-if="style === 'summary' && asset.chainsNames.length > 1"
              class="assets-table__row__asset__denom__chains s-minus"
            >
              <AssetChainsIndicator :denom="asset.denom" :balances="balances" :show-indicators="false" />
            </div>
          </div>
        </td>

        <td v-if="style !== 'summary'" class="assets-table__row__price text-right">
          $20.50
          <div
            v-if="style !== 'full'"
            class="assets-table__row__price__trending assets-table__row__trending__wrapper s-minus"
          >
            <TrendingUpIcon class="assets-table__row__trending__icon" />
            <span class="assets-table__row__trending__value">52.21%</span>
          </div>
        </td>

        <td v-if="style === 'full'" class="assets-table__row__trending">
          <div class="assets-table__row__trending__wrapper">
            <TrendingUpIcon class="assets-table__row__trending__icon" />
            <span class="assets-table__row__trending__value">52.21%</span>
          </div>
        </td>

        <td v-if="style === 'full'" class="assets-table__row__amount text-right">
          <span>{{ asset.totalAmount }} <Denom :name="asset.denom" chain-name="cosmos-hub" /></span>
        </td>

        <td class="assets-table__row__balance text-right">
          $6,150.20
          <div v-if="style !== 'full'" class="assets-table__row__balance__amount s-minus">
            {{ asset.totalAmount }} <Denom :name="asset.denom" chain-name="cosmos-hub" />
          </div>
        </td>

        <td v-if="style !== 'summary'" class="assets-table__row__chains">
          <div class="assets-table__row__chains__wrapper">
            <AssetChainsIndicator :denom="asset.denom" :balances="balances" />

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
import Denom from '@/components/common/Denom.vue';
import ChevronRightIcon from '@/components/common/Icons/ChevronRightIcon.vue';
import TrendingUpIcon from '@/components/common/Icons/TrendingUpIcon.vue';
import { Balances } from '@/types/api';

type TableStyleType = 'full' | 'compact' | 'summary';

export default defineComponent({
  name: 'AssetsTable',

  components: { AssetChainsIndicator, ChevronRightIcon, TrendingUpIcon, Denom },

  props: {
    style: {
      type: String as PropType<TableStyleType>,
      default: 'full',
    },
    balances: {
      type: Array as PropType<Balances>,
      required: true,
    },
  },

  emits: ['row-click'],

  setup(props, { emit }) {
    const balancesByAsset = computed(() => {
      const denomsAggregate = groupBy(props.balances as Balances, 'base_denom');

      return Object.entries(denomsAggregate).map(([denom, balances]) => {
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
