<template>
  <section class="pools">
    <nav class="pools__nav">
      <router-link to="/pools" class="pools__nav__item">My Pools</router-link>
      <router-link to="/pools" custom>
        <span class="pools__nav__item pools__nav__item--inactive">All Pools</span>
      </router-link>
    </nav>

    <div class="pools__subheader">
      <Search v-model:keyword="keyword" />
      <Button name="Add liquidity" @click="openAddLiqudityPage" />
    </div>

    <table class="pools-table">
      <colgroup>
        <col width="25%" />
        <col width="25%" />
        <col width="25%" />
      </colgroup>

      <thead>
        <tr>
          <th class="text-left">Token Pair</th>
          <th class="text-right">Your share</th>
          <th class="text-right">Liquidity</th>
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
            <span class="pools-table__row__pair__name w-bold">
              {{ pool.display_name }}
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
import { computed, onMounted, PropType } from '@vue/runtime-core';
import { useRouter } from 'vue-router';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import OwnLiquidityPrice from '@/components/common/OwnLiquidityPrice.vue';
import Search from '@/components/common/Search.vue';
import TotalLiquidityPrice from '@/components/common/TotalLiquidityPrice.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import usePools from '@/composables/usePools';
import { Pool } from '@/types/actions';

export default {
  name: 'PoolsTable',
  components: { Search, Button, Icon, CircleSymbol, TotalLiquidityPrice, OwnLiquidityPrice },

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

    const { formatPoolName } = usePools();
    onMounted(async () => {
      renderedPools.value = await Promise.all(
        props.pools.map(async (pool) => {
          pool.display_name = await formatPoolName(pool);
          return pool;
        }),
      );
    });
    const filteredPools = computed(() => {
      return renderedPools.value.filter((pool) => pool.reserve_coin_denoms.join().indexOf(keyword.value) !== -1);
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
  font-size: 1.6rem;

  &__subheader {
    margin-top: 2.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__nav {
    display: flex;

    &__item {
      font-size: 2.8rem;
      font-weight: 600;
      margin-right: 2.4rem;

      &--inactive {
        color: rgba(0, 0, 0, 0.33);
        cursor: not-allowed;
      }
    }
  }
}

.pools-table {
  margin: 2.4rem -2rem 0 -2rem;
  width: calc(100% + 4rem);
  table-layout: fixed;

  .text-right {
    text-align: right;
  }

  .text-left {
    text-align: left;
  }

  th {
    color: var(--muted);
    vertical-align: middle;
    font-size: 1.3rem;
    font-weight: 400;
    padding-bottom: 1.2rem;
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

    &__pair {
      padding: 2rem 0;
      display: flex;
      align-items: center;

      &__pool {
        display: inline-flex;
        align-items: center;
        margin-right: 1.6rem;

        &__avatar {
          width: 3.2rem;
          height: 3.2rem;
          border-radius: 2.4rem;
          background: #ddd;

          &.token-a {
            z-index: 1;
          }

          & + & {
            margin-left: -0.6rem;
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
        padding: 0.2rem;
        color: var(--inactive);
        margin-left: 1rem;

        &__icon {
          width: 1.6rem;
          height: 1.6rem;
        }
      }
    }
  }
}
</style>
