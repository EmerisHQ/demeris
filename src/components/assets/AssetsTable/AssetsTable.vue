<template>
  <table class="assets-table">
    <thead>
      <tr>
        <th>Asset</th>
        <th>Price</th>
        <th v-if="!isCompact">Balance</th>
        <th>
          <!-- Equivalent Amount -->
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

        <td class="assets-table__row__price">
          <!-- TODO: Get the price -->
          -
        </td>

        <td v-if="!isCompact" class="assets-table__row__balance">
          <span>{{ asset.totalAmount }} {{ asset.denom }}</span>
        </td>

        <td class="assets-table__row__equivalent-balance w-bold">
          <!-- TODO: Implement the equivalement amount based on price * totalAmount -->
          -
        </td>

        <td class="assets-table__row__chains">
          <!-- TODO: Implement Chain Group component -->
          <span v-for="chainName of asset.chainsNames" :key="chainName"> {{ chainName }}/ </span>

          <button class="assets-table__row__arrow-button" @click="handleClick(asset)">
            <Icon name="ChevronRightIcon" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import groupBy from 'lodash.groupby';
import { computed, defineComponent, PropType } from 'vue';

import Icon from '@/components/ui/Icon.vue';
import { Balance,Balances } from '@/types/api';

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
      const denomsAggregate = groupBy(props.balances, 'base_denom');

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
.assets-table__row__chains {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.assets-table__row__arrow-button {
  margin-left: 1rem;
}
</style>
