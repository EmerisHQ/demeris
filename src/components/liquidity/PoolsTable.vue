<template>
  <section class="pools">
    <div class="pools__subheader">
      <Search v-model:keyword="keyword" class="pools__search" />
      <button class="pools__add-button" @click="openAddLiqudityPage">
        <Icon name="PlusIcon" :icon-size="2" />
        <span class="pools__add-button__label">Add liquidity</span>
      </button>
    </div>

    <table class="pools-table">
      <colgroup>
        <col width="25%" />
        <col width="25%" />
        <col width="25%" />
      </colgroup>

      <thead>
        <tr>
          <th class="text-left">{{ $t('context.pools.pair') }}</th>
          <th class="text-right">{{ $t('context.pools.share') }}</th>
          <th class="text-right">{{ $t('context.pools.liquidity') }}</th>
          <!--<th class="text-right">APY</th>//-->
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="pool of filteredPools" :key="pool.id" class="pools-table__row" @click="rowClickHandler(pool)">
          <td class="pools-table__row__pair">
            <div class="pools-table__row__pair__pool">
              <CircleSymbol :denom="pool.reserve_coin_denoms[0]" class="pools-table__row__pair__pool__avatar token-a" />
              <CircleSymbol :denom="pool.reserve_coin_denoms[1]" class="pools-table__row__pair__pool__avatar token-b" />
            </div>
            <span class="pools-table__row__pair__name font-bold">
              {{ pool.displayName }}
            </span>
          </td>
          <td class="text-right"><OwnLiquidityPrice :pool="pool" :show-share="true" /></td>
          <td class="text-right"><TotalLiquidityPrice :pool="pool" /></td>
          <!--<td class="text-right">10%</td>//-->
          <td class="pools-table__row__controls text-right">
            <button class="pools-table__row__controls__button" @click="rowClickHandler(pool)">
              <Icon name="ChevronRightIcon" class="pools-table__row__controls__button__icon" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { computed, PropType, watch } from '@vue/runtime-core';
import { useRouter } from 'vue-router';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import OwnLiquidityPrice from '@/components/common/OwnLiquidityPrice.vue';
import Search from '@/components/common/Search.vue';
import TotalLiquidityPrice from '@/components/common/TotalLiquidityPrice.vue';
import Icon from '@/components/ui/Icon.vue';
import usePools from '@/composables/usePools';
import { Pool } from '@/types/actions';

export default {
  name: 'PoolsTable',
  components: { Search, Icon, CircleSymbol, TotalLiquidityPrice, OwnLiquidityPrice },

  props: {
    pools: {
      type: Array as PropType<Pool[]>,
      required: true,
      default: () => [],
    },
  },
  setup(props) {
    const router = useRouter();
    const keyword = ref<string>('');
    const renderedPools = ref([]);

    const { formatPoolName, getReserveBaseDenoms } = usePools();
    watch(
      () => props.pools,
      async (newVal) => {
        if (newVal.length > 0) {
          renderedPools.value = await Promise.all(
            props.pools.map(async (pool: any) => {
              pool.displayName = await formatPoolName(pool);
              pool.reserveBaseDenoms = await getReserveBaseDenoms(pool);
              return pool;
            }),
          );
        }
      },
      { immediate: true },
    );

    const filteredPools = computed(() => {
      const query = keyword.value.toLowerCase();
      return renderedPools.value.filter(
        (pool) =>
          pool.reserveBaseDenoms.join().indexOf(query) !== -1 || pool.displayName.toLowerCase().indexOf(query) !== -1,
      );
    });

    const openAddLiqudityPage = () => {
      router.push({ name: 'AddLiquidity' });
    };

    const rowClickHandler = (pool: Pool) => {
      router.push({ name: 'Pool', params: { id: pool.id } });
    };

    return {
      filteredPools,
      keyword,
      rowClickHandler,
      openAddLiqudityPage,
      formatPoolName,
    };
  },
};
</script>

<style lang="scss" scoped>
.pools {
  display: flex;
  flex-direction: column;
  font-size: 1rem;

  &__search {
    width: 22.5rem;
  }

  &__add-button {
    display: inline-flex;
    align-items: center;
    padding: 1rem 0.75rem;
    font-weight: 600;

    &__label {
      margin-left: 0.625rem;
    }
  }

  &__subheader {
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.pools-table {
  margin: 2.5rem -1.25rem 0 -1.25rem;
  width: calc(100% + 2.5rem);
  table-layout: fixed;

  .text-right {
    text-align: right;
  }

  .text-left {
    text-align: left;
  }

  th {
    color: var(--muted);
    background: var(--bg);
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
    transition: all 100ms ease-in;

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
        background: rgba(0, 0, 0, 0.03);
      }

      td:first-child {
        border-top-left-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
      }

      td:last-child {
        border-top-right-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
      }
    }

    &__pair {
      padding: 1.25rem 0;
      display: flex;
      align-items: center;

      &__pool {
        display: inline-flex;
        align-items: center;
        margin-right: 1rem;

        &__avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 1.5rem;
          background: #ddd;
          z-index: 0;

          &.token-a {
            z-index: 1;
          }

          & + & {
            margin-left: -0.375rem;
            background: #aaa;
          }
        }
      }

      &__name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
      }
    }

    &__controls {
      &__button {
        padding: 0.125rem;
        color: var(--inactive);
        margin-left: 0.625rem;

        &__icon {
          width: 1rem;
          height: 1rem;
        }
      }
    }
  }
}
</style>
