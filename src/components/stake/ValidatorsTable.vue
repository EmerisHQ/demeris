<template>
  <section class="flex items-start">
    <div class="flex flex-col w-full">
      <header class="flex flex-wrap justify-between items-end">
        <h2 class="text-3 font-bold pb-6">{{ tableTitle }}</h2>
        <!-- search -->
        <Search
          v-model:keyword="keyword"
          :placeholder="$t('components.stakeTable.searchValidator')"
          class="max-w-xs w-full pb-6"
        />
      </header>
      <!-- validator table -->
      <table class="validators-table table-fixed -ml-6 h-px">
        <colgroup>
          <col class="w-[30%]" />
          <col class="w-1/5" />
          <col class="w-[10%]" />
          <col class="md:w-[25%] w-[15%]" />
          <col :class="hasActions ? 'w-auto' : 'w-1/8'" />
        </colgroup>

        <!-- table header -->
        <thead class="hidden md:table-header-group text-muted font-normal -text-1">
          <tr>
            <th class="align-middle sticky top-0 z-20 bg-app text-left" :class="{ 'text-text': sortBy == 'name' }">
              <button
                class="thead-button px-2 py-4 rounded-lg hover:text-text border-none focus:outline-none focus-visible:ring-2 focus:ring-tertiary focus:ring-opacity-50 active:opacity-70 active:transform-none transition hover:transition-none cursor-pointer select-none text-ellipsis whitespace-nowrap"
                @click="
                  () => {
                    sort('name');
                  }
                "
              >
                {{ $t('components.validatorTable.validator') }}
                <span v-if="sortBy == 'name' && sortOrder == 'asc'">&uarr;</span
                ><span v-else-if="sortBy == 'name'">&darr;</span>
              </button>
            </th>
            <th class="align-middle sticky top-0 z-20 bg-app text-right" :class="{ 'text-text': sortBy == 'power' }">
              <button
                class="thead-button px-2 py-4 rounded-lg hover:text-text border-none focus:outline-none focus-visible:ring-2 focus:ring-tertiary focus:ring-opacity-50 active:opacity-70 active:transform-none transition hover:transition-none cursor-pointer select-none text-ellipsis whitespace-nowrap"
                @click="
                  () => {
                    sort('power');
                  }
                "
              >
                {{ $t('components.validatorTable.votingPower') }}
                <span v-if="sortBy == 'power' && sortOrder == 'asc'">&uarr;</span
                ><span v-else-if="sortBy == 'power'">&darr;</span>
              </button>
            </th>
            <th
              class="align-middle sticky top-0 z-20 bg-app text-right"
              :class="{ 'text-text': sortBy == 'commission' }"
            >
              <button
                class="thead-button px-2 py-4 rounded-lg hover:text-text border-none focus:outline-none focus-visible:ring-2 focus:ring-tertiary focus:ring-opacity-50 active:opacity-70 active:transform-none transition hover:transition-none cursor-pointer select-none text-ellipsis whitespace-nowrap"
                @click="
                  () => {
                    sort('commission');
                  }
                "
              >
                {{ $t('components.validatorTable.commission') }}
                <span v-if="sortBy == 'commission' && sortOrder == 'asc'">&uarr;</span
                ><span v-else-if="sortBy == 'commission'">&darr;</span>
              </button>
            </th>
            <th class="align-middle sticky top-0 z-20 bg-app text-right" :class="{ 'text-text': sortBy == 'staked' }">
              <button
                class="thead-button pl-2 pr-4 py-4 rounded-lg hover:text-text border-none focus:outline-none focus-visible:ring-2 focus:ring-tertiary focus:ring-opacity-50 active:opacity-70 active:transform-none transition hover:transition-none cursor-pointer select-none text-ellipsis whitespace-nowrap"
                @click="
                  () => {
                    sort('staked');
                  }
                "
              >
                {{ $t('components.validatorTable.staked') }}
                <span v-if="sortBy == 'staked' && sortOrder == 'asc'">&uarr;</span
                ><span v-else-if="sortBy == 'staked'">&darr;</span>
              </button>
            </th>
            <th class="align-middle py-4 sticky top-0 z-20 bg-app"></th>
          </tr>
        </thead>

        <!-- table body -->
        <tbody>
          <template v-for="validator of filteredAndSortedValidatorList" :key="validator.operator_address">
            <tr
              v-if="!disabledList.includes(validator.operator_address)"
              v-tippy
              :content="validator.jailed ? 'Validator jailed. Staking temporarily unavailable.' : null"
              class="group cursor-pointer"
              @click="
                () => {
                  detailedValidator = validator;
                }
              "
            >
              <td
                class="h-full py-4 pr-2 flex items-center overflow-hidden text-ellipsis whitespace-nowrap group-hover:bg-fg transition"
                :class="[{ 'text-negative-text': validator.jailed }]"
              >
                <div class="inline-flex items-center mr-4 align-middle">
                  <!-- TODO: get logo url -->
                  <ValidatorBadge :validator="validator" class="z-1" />
                </div>
                <span class="text-left font-medium" :class="{ 'text-inactive': validator.jailed }">
                  {{ validator.moniker }}
                </span>
                <ValidatorTag :validator="validator" />
              </td>
              <td class="py-4 px-2 text-right group-hover:bg-fg transition">
                {{ getAmountDisplayValueTruncated(validator.tokens) }} <Ticker :name="baseDenom" />
                <div class="-text-1 text-muted">
                  {{ getVotingPowerPercDisplayValue(validator.tokens) }}
                </div>
              </td>
              <td class="py-4 px-2 text-right group-hover:bg-fg transition">
                {{ getCommissionDisplayValue(validator.commission_rate) }}
              </td>
              <td class="py-4 pl-2 pr-4 text-right group-hover:bg-fg transition">
                <Price
                  :amount="{ denom: baseDenom, amount: validator.stakedAmount }"
                  :show-zero="true"
                  class="font-medium"
                />
                <div class="-text-1 text-muted">
                  {{ getAmountDisplayValue(validator.stakedAmount) }} <Ticker :name="baseDenom" />
                </div>
              </td>

              <td class="py-4 pl-2 text-right items-center whitespace-nowrap group-hover:bg-fg transition">
                <div v-if="hasActions" class="flex items-center">
                  <Button
                    :class="{ 'opacity-50': validator.jailed }"
                    :full-width="false"
                    :name="$t('components.validatorTable.stake')"
                    :disabled="validator.jailed"
                    data-cy="validator-table-stake"
                    @click.stop="
                      () => {
                        if (!validator.jailed) {
                          selectValidator(validator);
                        }
                      }
                    "
                  />
                  <Icon
                    class="text-muted inline-flex ml-6"
                    name="CaretRightIcon"
                    :icon-size="1"
                    :class="detailedValidator == validator || hasActions ? 'visible' : 'opacity-0'"
                  />
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="flex items-start pl-8 sticky top-8 z-20">
      <Transition>
        <ValidatorCard
          v-if="detailedValidator"
          :validator="detailedValidator"
          :disabled="
            detailedValidator.jailed ||
            (disabledList.includes(detailedValidator.operator_address) &&
              currentlyEditing != detailedValidator.operator_address)
          "
          @close="
            () => {
              detailedValidator = null;
            }
          "
          @clicked="
            if (
              (!disabledList.includes(detailedValidator.operator_address) ||
                currentlyEditing == detailedValidator.operator_address) &&
              !detailedValidator.jailed
            ) {
              selectValidator(detailedValidator);
            }
          "
        />
      </Transition>
    </div>
  </section>
</template>

<script setup lang="ts">
/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { EmerisAPI } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { computed, ref, toRefs } from 'vue';
import { useStore } from 'vuex';

import Price from '@/components/common/Price.vue';
import Search from '@/components/common/Search.vue';
import Ticker from '@/components/common/Ticker.vue';
import ValidatorBadge from '@/components/common/ValidatorBadge.vue';
import ValidatorCard from '@/components/stake/ValidatorCard.vue';
import ValidatorTag from '@/components/stake/ValidatorTag.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { isValidatorOffline } from '@/utils/basic';

enum ValStyle {
  LIST = 'list',
  ACTIONLIST = 'actionlist',
}
type ValStyleType = `${ValStyle}`;

interface Props {
  tableTitle: string;
  validatorList: EmerisAPI.Validator[];
  disabledList?: any[];
  tableStyle?: ValStyleType;
  currentlyEditing?: string;
  sortingBy?: 'power' | 'name' | 'commission' | 'staked';
  sortingOrder?: 'asc' | 'desc';
}

const props = withDefaults(defineProps<Props>(), {
  validatorList: () => [],
  disabledList: () => [],
  tableStyle: 'actionlist',
  currentlyEditing: '',
  sortingBy: 'power',
  sortingOrder: 'desc',
});

const emit = defineEmits<{
  (e: 'selectValidator', validator: any): void;
}>();

const store = useStore() as RootStoreTyped;
const propsRef = toRefs(props);
/* preset variables */
const chain = computed(() => {
  return store.getters[GlobalGetterTypes.API.getChain]({
    chain_name: propsRef.validatorList.value[0].chain_name,
  });
});
const baseDenom = chain.value?.denoms.find((x) => x.stakable).name;
const precision = store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: baseDenom });
const detailedValidator = ref(null);
/* variables */
const keyword = ref<string>('');
const hasActions = computed(() => props.tableStyle == ValStyle.ACTIONLIST && detailedValidator.value === null);
const sortBy = ref(props.sortingBy);
const sortOrder = ref(props.sortingOrder);
const totalStakedAmount = computed(() => {
  return propsRef.validatorList.value
    .reduce((acc, validator) => {
      return acc.plus(new BigNumber(validator.tokens));
    }, new BigNumber(0))
    .toString();
});
/* functions */
const filteredAndSortedValidatorList = computed(() => {
  const query = keyword.value.toLowerCase();
  return propsRef.validatorList.value
    .filter((vali: any) => vali.moniker?.toLowerCase().indexOf(query) !== -1)
    .sort((a, b) => {
      let res = 0;
      //  if only one of a and b are offline
      if ((isValidatorOffline(a) || isValidatorOffline(b)) && !(isValidatorOffline(a) && isValidatorOffline(b))) {
        return isValidatorOffline(a) ? 1 : -1;
      } else {
        switch (sortBy.value) {
          case 'power':
            if (Number(a.tokens) < Number(b.tokens)) res = 1;
            if (Number(a.tokens) > Number(b.tokens)) res = -1;
            break;
          case 'name':
            if (a.moniker < b.moniker) res = 1;
            if (a.moniker > b.moniker) res = -1;
            break;
          case 'commission':
            if (Number(a.commission_rate) < Number(b.commission_rate)) res = 1;
            if (Number(a.commission_rate) > Number(b.commission_rate)) res = -1;
            break;
          case 'staked':
            if (Number(a.stakedAmount) < Number(b.stakedAmount)) res = 1;
            if (Number(a.stakedAmount) > Number(b.stakedAmount)) res = -1;
            break;
        }
        if (res === 0) {
          if (Number(a.tokens) < Number(b.tokens)) res = 1;
          if (Number(a.tokens) > Number(b.tokens)) res = -1;
        }
      }
      if (sortOrder.value === 'asc') return -res;
      return res;
    });
});
const sort = (by) => {
  if (sortBy.value == by && sortOrder.value == 'asc') {
    sortOrder.value = 'desc';
  } else {
    sortOrder.value = 'asc';
  }
  sortBy.value = by;
};
const getCommissionDisplayValue = (value) => {
  return Math.trunc(parseFloat(value) * 10000) / 100 + '%';
};
const getAmountDisplayValueTruncated = (value) => {
  return Math.trunc(new BigNumber(value).dividedBy(10 ** precision).toNumber()).toLocaleString('en-US');
};
const getAmountDisplayValue = (value) => {
  return new BigNumber(value)
    .dividedBy(10 ** precision)
    .toNumber()
    .toLocaleString('en-US');
};
const getVotingPowerPercDisplayValue = (value) => {
  return new BigNumber(value).dividedBy(totalStakedAmount.value).multipliedBy(100).decimalPlaces(2).toString() + '%';
};
const selectValidator = (vali) => {
  emit('selectValidator', vali);
  detailedValidator.value = null;
};
</script>

<style lang="scss" scoped>
.validators-table {
  width: calc(100% + 3rem);

  th:first-child {
    padding-left: 1rem;
  }

  th:last-child {
    padding-right: 1rem;
  }

  td:first-child {
    padding-left: 1.5rem;
    @apply rounded-l-xl;
  }

  td:last-child {
    padding-right: 1.5rem;
    @apply rounded-r-xl;
  }
}

.thead-button {
  &:active {
    transition-duration: 0s;
  }
}
</style>
