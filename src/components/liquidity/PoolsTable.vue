<template>
  <section class="flex flex-col">
    <div class="flex items-center justify-between md:mt-2 mb-3 sm:mb-4 md:mb-6">
      <Search v-model:keyword="keyword" placeholder="Search assets and pools" class="pools__search max-w-xs w-full" />
      <FeatureRunningConditional name="DISABLE_ADD_LIQUIDITY">
        <template #default>
          <span>
            <b>{{ $t('context.pools.disabled.description') }}</b> &nbsp;
            <a
              variant="link"
              href="https://support.emeris.com/en/articles/6095013-how-to-withdraw-your-funds-from-liquidity-pools"
            >
              {{ $t('context.pools.disabled.linkText') }} ↗
            </a>
          </span>
        </template>
        <template #deactivated>
          <Button
            class="add-liquidity"
            name="Add liquidity"
            variant="link"
            :full-width="false"
            @click="openAddLiqudityPage"
          >
            <Icon name="PlusIcon" :icon-size="1.5" />
          </Button>
        </template>
      </FeatureRunningConditional>
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
              <CircleSymbol
                :denom="pool.reserve_coin_denoms[pool.isReversePairName ? 1 : 0]"
                class="w-8 h-8 rounded-full bg-fg z-1"
              />
              <CircleSymbol
                :denom="pool.reserve_coin_denoms[pool.isReversePairName ? 0 : 1]"
                class="w-8 h-8 rounded-full bg-fg z-0 -ml-1.5"
              />
            </div>
            <span class="text-left overflow-hidden text-ellipsis whitespace-nowrap font-medium">
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

<script lang="ts" setup>
import orderBy from 'lodash.orderby';
import { ref } from 'vue';
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import FeatureRunningConditional from '@/components/common/FeatureRunningConditional.vue';
import OwnLiquidityPrice from '@/components/common/OwnLiquidityPrice.vue';
import Search from '@/components/common/Search.vue';
import TotalLiquidityPrice from '@/components/common/TotalLiquidityPrice.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import { Pool } from '@/types/actions';
import { parseCoins } from '@/utils/basic';

interface Props {
  pools: Pool[];
}
const props = withDefaults(defineProps<Props>(), {
  pools: () => [],
});

const router = useRouter();
const keyword = ref<string>('');
const renderedPools = ref([]);
const poolsWithTotalLiquidityPrice = ref([]);

const { getPoolName, getReserveBaseDenoms, getLiquidityShare, getIsReversePairName } = usePools();
const { balancesByDenom } = useAccount();
watch(
  () => props.pools,
  async (newVal) => {
    if (newVal?.length > 0) {
      renderedPools.value = await Promise.all(
        props.pools.map(async (pool: any) => {
          pool.displayName = await getPoolName(pool);
          pool.reserveBaseDenoms = await getReserveBaseDenoms(pool);
          pool.isReversePairName = await getIsReversePairName(pool, pool.displayName);
          return pool;
        }),
      );
      poolsWithTotalLiquidityPrice.value = await Promise.all(
        renderedPools.value.map(async (pool) => {
          const { totalLiquidityPrice, initPromise } = usePool(pool.id);
          await initPromise;
          const poolCoinBalances = balancesByDenom(pool.pool_coin_denom);
          const poolCoinAmount = poolCoinBalances.reduce((acc, item) => acc + +parseCoins(item.amount)[0].amount, 0);

          const ownShare = getLiquidityShare(pool, poolCoinAmount);
          pool.totalLiquidityPrice = totalLiquidityPrice;
          pool.ownShare = totalLiquidityPrice.value * ownShare;

          return pool;
        }),
      );
    }
  },
  { immediate: true },
);

const orderPools = (unorderedPools) => {
  return orderBy(
    unorderedPools,
    ['ownShare', (x) => x.totalLiquidityPrice || 0, 'displayName'],
    ['desc', 'desc', 'asc'],
  );
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
