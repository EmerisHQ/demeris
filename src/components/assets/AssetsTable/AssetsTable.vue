<template>
  <table class="assets-table">
    <thead>
      <tr>
        <th class="assets-table--u-text-left">Asset</th>
        <th class="assets-table--u-text-right">Price</th>
        <th class="assets-table--u-text-right">24h %</th>
        <th v-if="!isCompact" class="assets-table--u-text-right">Balance</th>
        <th class="assets-table--u-text-right">Balance</th>
        <th>
          <!-- Chains -->
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="asset in balancesByAsset" :key="asset.denom" class="assets-table__row">
        <td class="assets-table__row__asset">
          <div class="assets-table__row__asset__avatar" />
          <span class="assets-table__row__asset__denom">{{ asset.denom }}</span>
        </td>

        <td class="assets-table__row__price assets-table--u-text-right">$20.50</td>

        <td class="assets-table__row__trending">
          <div class="assets-table__row__trending__wrapper">
            <TrendingUpIcon class="assets-table__row__trending__icon" />
            <span class="assets-table__row__trending__value">52.21%</span>
          </div>
        </td>

        <td v-if="!isCompact" class="assets-table__row__balance assets-table--u-text-right">
          <span>{{ asset.totalAmount }} {{ asset.denom }}</span>
        </td>

        <td class="assets-table__row__equivalent-balance assets-table--u-text-right">$6,150.20</td>

        <td class="assets-table__row__chains">
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
import groupBy from 'lodash.groupby';
import { computed, defineComponent, PropType } from 'vue';

import AssetChainsIndicator from '@/components/assets/AssetChainsIndicator';
import ChevronRightIcon from '@/components/common/Icons/ChevronRightIcon.vue';
import TrendingUpIcon from '@/components/common/Icons/TrendingUpIcon.vue';
import { Balance, Balances } from '@/types/api';

export default defineComponent({
  name: 'AssetsTable',

  components: { AssetChainsIndicator, ChevronRightIcon, TrendingUpIcon },

  props: {
    isCompact: {
      type: Boolean,
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
        const totalAmount = balances.reduce((acc, item) => +item.amount + acc, 0);
        const chainsNames = balances.map((item) => item.on_chain);

        return {
          denom,
          totalAmount,
          chainsNames,
        };
      });
    });

    const handleClick = (asset: Balance) => {
      emit('row-click', asset);
    };

    return { balancesByAsset, handleClick };
  },
});
</script>

<style lang="scss" scoped>
.assets-table {
  width: 100%;
  table-layout: fixed;

  &--u-text-right {
    text-align: right;
  }

  &--u-text-left {
    text-align: left;
  }

  th {
    color: rgba(0, 0, 0, 0.66);
    vertical-align: middle;
    font-size: 1.3rem;
    font-weight: 400;
    padding-bottom: 2rem;
  }

  &__row {
    &__asset {
      padding: 2rem 0;
      min-width: 4rem;
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

    &__balance {
      text-transform: uppercase;
      color: rgba(0, 0, 0, 0.66);
    }

    &__equivalent-balance {
      font-weight: 600;
    }

    &__chains {
      &__wrapper {
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
