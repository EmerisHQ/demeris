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
        <template v-if="hasActions">
          <col width="25%" />
          <col width="25%" />
          <col width="10%" />
          <col width="25%" />
          <col width="15%" />
        </template>
        <template v-else>
          <col width="30%" />
          <col width="30%" />
          <col width="15%" />
          <col width="25%" />
        </template>
      </colgroup>

      <!-- table header -->
      <thead class="hidden md:table-header-group text-muted">
        <tr>
          <th
            class="align-middle font-normal -text-1 py-4 px-0 sticky top-0 z-20 bg-app text-left transition"
            :class="{ 'font-bold': sortBy == 'name' }"
          >
            <span
              @click="
                () => {
                  sort('name');
                }
              "
            >{{ $t('components.validatorTable.validator') }}</span>
            <template v-if="sortBy == 'name'">
              <SendIcon v-if="sortOrder == 'asc'" class="inline" />
              <ReceiveIcon v-else class="inline" />
            </template>
          </th>
          <th
            class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right transition"
            :class="{ 'font-bold': sortBy == 'power' }"
          >
            <span
              @click="
                () => {
                  sort('power');
                }
              "
            >{{ $t('components.validatorTable.votingPower') }}</span>
            <template v-if="sortBy == 'power'">
              <SendIcon v-if="sortOrder == 'asc'" class="inline" />
              <ReceiveIcon v-else class="inline" />
            </template>
          </th>
          <th
            class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right transition"
            :class="{ 'font-bold': sortBy == 'commission' }"
          >
            <span
              @click="
                () => {
                  sort('commission');
                }
              "
            >{{ $t('components.validatorTable.commission') }}</span>
            <template v-if="sortBy == 'commission'">
              <SendIcon v-if="sortOrder == 'asc'" class="inline" />
              <ReceiveIcon v-else class="inline" />
            </template>
          </th>
          <th
            class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right transition"
            :class="{ 'font-bold': sortBy == 'staked' }"
          >
            <span
              @click="
                () => {
                  sort('staked');
                }
              "
            >{{ $t('components.validatorTable.staked') }}</span>
            <template v-if="sortBy == 'staked'">
              <SendIcon v-if="sortOrder == 'asc'" class="inline" />
              <ReceiveIcon v-else class="inline" />
            </template>
          </th>
          <th
            v-if="hasActions"
            class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right transition"
          ></th>
        </tr>
      </thead>

      <!-- table body -->
      <tbody>
        <tr
          v-for="validator of sortedValidatorList"
          :key="validator.operator_address"
          :set="(isDisabled = disabledListAddresses.includes(validator.operator_address))"
          class="group"
          :class="{ 'opacity-50': isDisabled, 'cursor-pointer': !isDisabled }"
          @click="
            () => {
              if (!isDisabled) {
                selectValidator(validator);
              }
            }
          "
        >
          <td class="py-5 flex items-center" :class="{ 'group-hover:bg-fg transition': !isDisabled }">
            <div class="inline-flex items-center mr-4">
              <!-- TODO: get logo url -->
              <ValidatorBadge :validator="validator" class="w-8 h-8 rounded-full bg-fg z-1" />
            </div>
            <span class="text-left overflow-hidden overflow-ellipsis whitespace-nowrap font-medium">
              {{ validator.moniker }}
            </span>
          </td>
          <td class="text-right" :class="{ 'group-hover:bg-fg transition': !isDisabled }">
            {{ getAmountDisplayValue(validator.tokens) }} <Ticker :name="baseDenom" />
            <div class="-text-1 text-muted">
              {{ getVotingPowerPercDisplayValue(validator.tokens) }}
            </div>
          </td>
          <td class="text-right" :class="{ 'group-hover:bg-fg transition': !isDisabled }">
            {{ getCommissionDisplayValue(validator.commission_rate) }}
          </td>
          <td class="text-right" :class="{ 'group-hover:bg-fg transition': !isDisabled }">
            <Price :amount="{ denom: baseDenom, amount: validator.stakedAmount }" :show-zero="true" />
            <div class="-text-1 text-muted">
              {{ getAmountDisplayValue(validator.stakedAmount) }} <Ticker :name="baseDenom" />
            </div>
          </td>
          <td v-if="hasActions" class="text-right" :class="{ 'group-hover:bg-fg transition': !isDisabled }">
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
import { computed } from '@vue/runtime-core';
import orderBy from 'lodash.orderby';
import { PropType, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import ReceiveIcon from '@/components/common/Icons/ReceiveIcon.vue';
import SendIcon from '@/components/common/Icons/SendIcon.vue';
import Price from '@/components/common/Price.vue';
import Search from '@/components/common/Search.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalDemerisGetterTypes } from '@/store';

import ValidatorBadge from '../common/ValidatorBadge.vue';

enum ValStyle {
  LIST = 'list',
  ACTIONLIST = 'actionlist',
}

//TODO: implement type for validator list
export default {
  name: 'ValidatorTable',
  components: { Search, ValidatorBadge, Ticker, Button, Icon, Price, ReceiveIcon, SendIcon },
  props: {
    validatorList: {
      type: Array,
      required: true,
      default: () => [],
    },
    disabledList: {
      type: Array,
      required: true,
      default: () => [],
    },
    tableStyle: {
      type: String as PropType<ValStyle>,
      default: 'actionlist',
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
    const hasActions = computed(() => props.tableStyle == ValStyle.ACTIONLIST);
    const sortBy = ref('power');
    const sortOrder = ref('desc');

    /* functions */
    const filteredValidatorList = computed(() => {
      const query = keyword.value.toLowerCase();
      return props.validatorList.filter((vali: any) => vali.moniker.toLowerCase().indexOf(query) !== -1);
    });
    const disabledListAddresses = computed(() => {
      return props.disabledList?.map((x) => x.operator_address) ?? [];
    });
    const sort = (by) => {
      if (sortBy.value == by && sortOrder.value == 'asc') {
        sortOrder.value = 'desc';
      } else {
        sortOrder.value = 'asc';
      }
      sortBy.value = by;
    };
    const sortedValidatorList = computed(() => {
      return filteredValidatorList.value.sort((a, b) => {
        switch (sortBy.value) {
          case 'power':
            if (Number(a.tokens) < Number(b.tokens)) return sortOrder.value == 'asc' ? -1 : 1;
            if (Number(a.tokens) > Number(b.tokens)) return sortOrder.value == 'asc' ? 1 : -1;
            return 0;
          case 'name':
            if (a.moniker < b.moniker) return sortOrder.value == 'asc' ? -1 : 1;
            if (a.moniker > b.moniker) return sortOrder.value == 'asc' ? 1 : -1;
            return 0;
          case 'commission':
            if (Number(a.commission_rate) < Number(b.commission_rate)) return sortOrder.value == 'asc' ? -1 : 1;
            if (Number(a.commission_rate) > Number(b.commission_rate)) return sortOrder.value == 'asc' ? 1 : -1;
            return 0;
          case 'staked':
            if (Number(a.stakedAmount) < Number(b.stakedAmount)) return sortOrder.value == 'asc' ? -1 : 1;
            if (Number(a.stakedAmount) > Number(b.stakedAmount)) return sortOrder.value == 'asc' ? 1 : -1;
            return 0;
        }
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
      hasActions,
      sort,
      sortBy,
      sortOrder,
      disabledListAddresses,
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
