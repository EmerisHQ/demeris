<template>
  <section class="flex flex-col">
    <div class="flex items-center justify-between md:mt-2 mb-3 sm:mb-4 md:mb-6">
      <Search v-model:keyword="keyword" placeholder="Search assets and pools" class="pools__search max-w-xs w-full" />
      <Button name="Add liquidity" variant="link" :full-width="false" @click="openAddLiqudityPage">
        <Icon name="PlusIcon" :icon-size="1.5" />
      </Button>
    </div>

    <table class="pools-table table-fixed -ml-6">
      <colgroup>
        <col width="34%" />
        <col width="33%" />
        <col width="33%" />
      </colgroup>

      <thead class="hidden md:table-header-group text-muted">
        <tr>
          <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-left transition">
            {{ $t('context.pools.pair') }}
          </th>
          <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right transition">
            {{ $t('context.pools.liquidity') }}
          </th>
          <!--<th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right transition">APY</th>//-->
          <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right transition">
            {{ $t('context.pools.share') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="pool of orderPools(filteredPools)"
          :key="pool.id"
          class="group cursor-pointer"
          @click="rowClickHandler(pool)"
        >
          <td class="py-5 flex items-center group-hover:bg-fg transition">
            <div class="inline-flex items-center mr-4">
              <CircleSymbol :denom="pool.reserve_coin_denoms[0]" class="w-8 h-8 rounded-full bg-fg z-1" />
              <CircleSymbol :denom="pool.reserve_coin_denoms[1]" class="w-8 h-8 rounded-full bg-fg z-0 -ml-1.5" />
            </div>
            <span class="text-left overflow-hidden overflow-ellipsis whitespace-nowrap font-medium">
              {{ pool.displayName }}
            </span>
          </td>
          <td class="text-right group-hover:bg-fg transition">
            <TotalLiquidityPrice :pool="pool" />
          </td>
          <!--<td class="text-right">10%</td>//-->
          <td class="text-right group-hover:bg-fg transition"><OwnLiquidityPrice :pool="pool" :show-share="true" /></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { computed, PropType, watch } from '@vue/runtime-core';
import orderBy from 'lodash.orderby';
import { useRouter } from 'vue-router';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import OwnLiquidityPrice from '@/components/common/OwnLiquidityPrice.vue';
import Search from '@/components/common/Search.vue';
import TotalLiquidityPrice from '@/components/common/TotalLiquidityPrice.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import usePools from '@/composables/usePools';
import { Pool } from '@/types/actions';
import getTotalLiquidityPrice from '@/utils/getTotalLiquidityPrice';

export default {
  name: 'PoolsTable',
  components: { Search, Icon, Button, CircleSymbol, TotalLiquidityPrice, OwnLiquidityPrice },

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

    const poolsWithTotalLiquidityPrice = computed(() => {
      let pools = renderedPools.value;
      pools.map((p) => {
        let tlp = getTotalLiquidityPrice(p);
        if (tlp) {
          p.totalLiquidityPrice = tlp;
        }
        return p;
      });
      return pools;
    });

    const orderPools = (unorderedPools) => {
      let pools = [];
      let lpPools = [];
      unorderedPools.map((x) => {
        if (x.displayName?.substring(0, 7) === 'Gravity') {
          lpPools.push(x);
        } else {
          pools.push(x);
        }
      });
      pools = orderBy(pools, ['totalLiquidityPrice', 'displayName'], ['desc', 'asc']);
      lpPools = orderBy(lpPools, ['totalLiquidityPrice'], ['desc']);
      lpPools = lpPools.sort((a, b) =>
        a.displayName.localeCompare(b.displayName, 0, { numeric: true, sensitivity: 'base' }),
      );
      return pools.concat(lpPools);
    };

    const filteredPools = computed(() => {
      const query = keyword.value.toLowerCase();
      return poolsWithTotalLiquidityPrice.value.filter(
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
      orderPools,
      poolsWithTotalLiquidityPrice,
    };
  },
};
</script>

<style lang="scss" scoped>
.pools-table {
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
