<template>
  <table class="assets-table">
    <thead>
      <tr>
        <th class="assets-table__item--text-left">Asset</th>
        <th class="assets-table__item--text-right">Price</th>
        <th v-if="!isCompact" class="assets-table__item--text-right">Balance</th>
        <th class="assets-table__item--text-right">
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

        <td class="assets-table__row__price assets-table__item--text-right">
          <!-- TODO: Get the price -->
          $20.50
        </td>

        <td v-if="!isCompact" class="assets-table__row__balance assets-table__item--text-right">
          <span>{{ asset.totalAmount }} {{ asset.denom }}</span>
        </td>

        <td class="assets-table__row__equivalent-balance assets-table__item--text-right">
          <!-- TODO: Implement the equivalement amount based on price * totalAmount -->
          $6,150.20
        </td>

        <td class="assets-table__row__chains assets-table__item--text-right">
          <div class="assets-table__row__chains__wrapper">
            <!-- TODO: Implement Chain Group component -->
            <span v-for="chainName of asset.chainsNames" :key="chainName"> {{ chainName }}/ </span>

            <button class="assets-table__row__arrow-button" @click="handleClick(asset)">
              <Icon name="ChevronRightIcon" />
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

import Icon from '@/components/ui/Icon.vue';
import { Balance, Balances } from '@/types/api';

export default defineComponent({
  name: 'AssetsTable',

  components: { Icon },

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

<style scoped>
.assets-table {
  width: 100%;
}

.assets-table th {
  opacity: 0.8;
  padding-bottom: 1rem;
  vertical-align: middle;
  font-weight: 400;
}

.assets-table__item--text-left {
  text-align: left;
}

.assets-table__item--text-right {
  text-align: right;
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

.assets-table__row__chains {
  width: 25rem;
}

.assets-table__row__chains__wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
