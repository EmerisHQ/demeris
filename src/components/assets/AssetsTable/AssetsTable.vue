<template>
  <table class="assets-table table-fixed">
    <thead>
      <tr>
        <th class="text-left">Asset</th>
        <th class="text-right">Price</th>
        <th class="text-right">24h %</th>
        <th v-if="!isCompact" class="text-right">Balance</th>
        <th class="text-right">
          Balance
        </th>
        <th>
          <!-- Chains -->
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="asset in balancesByAsset" :key="asset.denom" class="assets-table__row">
        <!-- TODO: Implement the Chain Name component -->
        <td class="assets-table__row__denom">
          {{ asset.denom }}
        </td>

        <td class="assets-table__row__price text-right">
          <!-- TODO: Get the price -->
          $20.50
        </td>

        <td class="assets-table__row__price w-32">
          <div class="flex items-start justify-end space-x-1 text-green-700">
            <TrendingUpIcon class="w-5 h-5" />
            <span>52.21%</span>
          </div>
        </td>

        <td v-if="!isCompact" class="assets-table__row__balance text-right">
          <span>{{ asset.totalAmount }} {{ asset.denom }}</span>
        </td>

        <td class="assets-table__row__equivalent-balance text-right">
          <!-- TODO: Implement the equivalement amount based on price * totalAmount -->
          $6,150.20
        </td>

        <td class="assets-table__row__chains w-64">
          <div class="assets-table__row__chains__wrapper w-full flex items-center justify-end space-x-5">
            <AssetChainsIndicator :denom="asset.denom" :balances="balances" class="w-full" />

            <button
              class="assets-table__row__arrow-button p-2 text-gray-500 hover:text-gray-600"
              @click="handleClick(asset)"
            >
              <ChevronRightIcon class="w-5 h-5" />
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
        const chainsNames = balances.map(item => item.on_chain);

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

<style>
.assets-table {
  width: 100%;
}

.assets-table th {
  opacity: 0.8;
  padding-bottom: 1rem;
  vertical-align: middle;
  font-weight: 400;
}

.assets-table__row__denom {
  padding: 1.5rem 0;
  min-width: 4rem;
  font-weight: 600;
}

.assets-table__row__balance {
  opacity: 0.8;
}

.assets-table__row__equivalent-balance {
  font-weight: 600;
}

.assets-table__row__arrow-button {
  margin-left: 1rem;
}

.assets-table .asset-chains-indicator {
  justify-content: flex-end;
}
</style>
