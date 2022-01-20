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
          v-for="validator of sortedValidatorList"
          :key="validator.operator_address"
          class="group cursor-pointer"
          @click="selectValidator(validator)"
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
            {{ getAmountDisplayValue(validator.tokens) }} <Ticker :name="baseDenom" />
            <div class="-text-1 text-muted">
              {{ getVotingPowerPercDisplayValue(validator.tokens) }}
            </div>
          </td>
          <td class="text-right group-hover:bg-fg transition">
            {{ getCommissionDisplayValue(validator.commission_rate) }}
          </td>
          <td class="text-right group-hover:bg-fg transition">
            <Price :amount="{ denom: baseDenom, amount: validator.stakedAmount }" :show-zero="true" />
            <div class="-text-1 text-muted">
              {{ getAmountDisplayValue(validator.stakedAmount) }} <Ticker :name="baseDenom" />
            </div>
          </td>
          <td class="text-right group-hover:bg-fg transition">
            <div class="flex justify-center">
              <Button
                variant="secondary"
                class="ml-8"
                :name="$t('components.validatorTable.stake')"
                :full-width="false"
                @click.stop="() => selectValidator(validator)"
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
import { computed } from '@vue/runtime-core';
import orderBy from 'lodash.orderby';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Price from '@/components/common/Price.vue';
import Search from '@/components/common/Search.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalDemerisGetterTypes } from '@/store';

//TODO: implement type for validator list
export default {
  name: 'ValidatorTable',
  components: { Search, CircleSymbol, Ticker, Button, Icon, Price },
  props: {
    validatorList: {
      type: Array,
      required: true,
      default: () => [],
    },
    totalStakedAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  emits: ['selectValidator'],
  setup(props, { emit }) {
    /* hooks */
    const router = useRouter();
    const store = useStore();

    /* preset variables */
    const baseDenom = router.currentRoute.value.params.denom as string;
    const precision = store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({ name: baseDenom });

    /* variables */
    const keyword = ref<string>('');

    /* functions */
    const filteredValidatorList = computed(() => {
      const query = keyword.value.toLowerCase();
      return props.validatorList.filter((vali: any) => vali.moniker.toLowerCase().indexOf(query) !== -1);
    });
    const sortedValidatorList = computed(() => {
      return filteredValidatorList.value.sort((a, b) => {
        if (Number(a.tokens) < Number(b.tokens)) return -1;
        if (Number(a.tokens) > Number(b.tokens)) return 1;
        return 0;
      });
    });
    const getCommissionDisplayValue = (value) => {
      return Math.trunc(parseFloat(value) * 10000) / 100 + '%';
    };
    const getAmountDisplayValue = (value) => {
      return Math.trunc(parseInt(value) / Math.pow(10, precision)).toLocaleString('en-US');
    };
    const getVotingPowerPercDisplayValue = (value) => {
      return Math.trunc((value / props.totalStakedAmount) * 10000) / 100 + '%';
    };
    const selectValidator = (vali) => {
      emit('selectValidator', vali);
    };

    const orderPools = (unorderedPools) => {
      return orderBy(
        unorderedPools,
        ['ownShare', (x) => x.totalLiquidityPrice || 0, 'displayName'],
        ['desc', 'desc', 'asc'],
      );
    };

    return {
      baseDenom,
      filteredValidatorList,
      sortedValidatorList,
      keyword,
      getCommissionDisplayValue,
      getAmountDisplayValue,
      getVotingPowerPercDisplayValue,
      selectValidator,
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
