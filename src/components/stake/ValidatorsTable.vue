<template>
  <section class="flex flex-col">
    <!-- search -->
    <div class="w-full">
      <h1 class="text-3 font-bold text-left">{{ $t('components.stakeTable.selectValidator') }}</h1>
      <Search
        v-model:keyword="keyword"
        :placeholder="$t('components.stakeTable.searchValidator')"
        class="py-6 max-w-xs w-full"
      />
    </div>

    <!-- validator table -->
    <table class="pools-table table-fixed -ml-6">
      <colgroup>
        <col width="25%" />
        <col width="25%" />
        <col width="10%" />
        <col width="25%" />
        <col width="15%" />
      </colgroup>

      <!-- table header -->
      <thead class="hidden md:table-header-group text-muted">
        <tr>
          <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-left transition">
            {{ $t('components.validatorTable.validator') }}
          </th>
          <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right transition">
            {{ $t('components.validatorTable.votingPower') }}
          </th>
          <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right transition">
            {{ $t('components.validatorTable.commission') }}
          </th>
          <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right transition">
            {{ $t('components.validatorTable.staked') }}
          </th>
          <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right transition"></th>
        </tr>
      </thead>

      <!-- table body -->
      <tbody>
        <tr
          v-for="validator of filteredValidatorList"
          :key="validator.operator_address"
          class="group cursor-pointer"
          @click="rowClickHandler(validator)"
        >
          <td class="py-5 flex items-center group-hover:bg-fg transition">
            <div class="inline-flex items-center mr-4">
              <!-- TODO: get logo url -->
              <CircleSymbol :denom="baseDenom" class="w-8 h-8 rounded-full bg-fg z-1" />
            </div>
            <span class="text-left overflow-hidden overflow-ellipsis whitespace-nowrap font-medium">
              {{ validator.moniker }}
            </span>
          </td>
          <td class="text-right group-hover:bg-fg transition">
            {{ showDisplayValue('votingPower', validator.tokens) }} <Ticker :name="baseDenom" />
            <div class="-text-1 text-muted">{{ showDisplayValue('votingPowerPercentage', validator.tokens) }}</div>
          </td>
          <td class="text-right group-hover:bg-fg transition">
            {{ showDisplayValue('commission', validator.commission_rate) }}
          </td>
          <td class="text-right group-hover:bg-fg transition">test 1</td>
          <td class="text-right group-hover:bg-fg transition">
            <div class="flex justify-center">
              <Button
                variant="secondary"
                class="ml-8"
                :name="$t('components.validatorTable.stake')"
                :click-function="stakeAsset"
                :full-width="false"
              />
              <Icon class="text-muted ml-5" name="CaretRightIcon" :icon-size="1" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { computed, onBeforeMount, PropType, watch } from '@vue/runtime-core';
import orderBy from 'lodash.orderby';
import { useRouter } from 'vue-router';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Search from '@/components/common/Search.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import useStaking from '@/composables/useStaking';
import { useStore } from '@/store';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { Pool } from '@/types/actions';

type DisplayValue = 'commission' | 'votingPower' | 'votingPowerPercentage';
//TODO: implement type for validator list
export default {
  name: 'ValidatorTable',
  components: { Search, CircleSymbol, Ticker, Button, Icon },

  // props: {
  //   pools: {
  //     type: Array as PropType<Pool[]>,
  //     required: true,
  //     default: () => [],
  //   },
  // },
  setup(props) {
    /* hooks */
    const { getValidatorsByBaseDenom } = useStaking();
    const router = useRouter();
    const store = useStore();
    const { stakingBalances } = useAccount();
    /* preset variables */
    const baseDenom = router.currentRoute.value.params.denom as string;
    const precision = store.getters['demeris/getDenomPrecision']({ name: baseDenom });

    /* variables */
    const validatorList = ref<Array<unknown>>([]);
    const totalStakedAmount = ref<number>(0);
    const keyword = ref<string>('');

    /* life cycle */
    onBeforeMount(async () => {
      validatorList.value = await getValidatorsByBaseDenom(baseDenom);
      validatorList.value.forEach((validator: any) => {
        totalStakedAmount.value += Number(validator.tokens);
      });
      console.log('valilist', validatorList.value);
      console.log('stakingBalance', stakingBalances.value);
    });

    /* functions */
    const showDisplayValue = (type: DisplayValue, value) => {
      if (type === 'commission') {
        return Math.trunc(parseFloat(value) * 10000) / 100 + '%';
      } else if (type === 'votingPower') {
        return Math.trunc(parseInt(value) / Math.pow(10, precision)).toLocaleString('en-US');
      } else {
        // type: votingPowerPercentage
        return Math.trunc((value / totalStakedAmount.value) * 10000) / 100 + '%';
      }
    };
    const orderPools = (unorderedPools) => {
      return orderBy(
        unorderedPools,
        ['ownShare', (x) => x.totalLiquidityPrice || 0, 'displayName'],
        ['desc', 'desc', 'asc'],
      );
    };
    const openAddLiqudityPage = () => {
      router.push({ name: 'AddLiquidity' });
    };
    const rowClickHandler = (pool: Pool) => {
      router.push({ name: 'Pool', params: { id: pool.id } });
    };
    const filteredValidatorList = computed(() => {
      const query = keyword.value.toLowerCase();
      return validatorList.value.filter((vali: any) => vali.moniker.toLowerCase().indexOf(query) !== -1);
    });

    return {
      baseDenom,
      filteredValidatorList,
      keyword,
      rowClickHandler,
      showDisplayValue,
      openAddLiqudityPage,
      orderPools,
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
