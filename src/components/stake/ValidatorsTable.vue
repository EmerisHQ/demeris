<template>
  <section class="flex items-start">
    <div class="flex flex-col">
      <h2 class="text-3 font-bold pt-8 text-left">{{ $t('components.stakeForm.selectTitle') }}</h2>
      <!-- search -->
      <div class="w-full">
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
              :class="{ 'text-text': sortBy == 'name' }"
            >
              <span
                class="cursor-pointer"
                @click="
                  () => {
                    sort('name');
                  }
                "
              >{{ $t('components.validatorTable.validator') }}
                <span v-if="sortBy == 'name' && sortOrder == 'asc'">&uarr;</span><span v-else-if="sortBy == 'name'">&darr;</span></span>
            </th>
            <th
              class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right transition"
              :class="{ 'text-text': sortBy == 'power' }"
            >
              <span
                class="cursor-pointer"
                @click="
                  () => {
                    sort('power');
                  }
                "
              >{{ $t('components.validatorTable.votingPower') }}
                <span v-if="sortBy == 'power' && sortOrder == 'asc'">&uarr;</span><span v-else-if="sortBy == 'power'">&darr;</span></span>
            </th>
            <th
              class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right transition"
              :class="{ 'text-text': sortBy == 'commission' }"
            >
              <span
                class="cursor-pointer"
                @click="
                  () => {
                    sort('commission');
                  }
                "
              >{{ $t('components.validatorTable.commission') }}
                <span v-if="sortBy == 'commission' && sortOrder == 'asc'">&uarr;</span><span v-else-if="sortBy == 'commission'">&darr;</span></span>
            </th>
            <th
              class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right transition"
              :class="{ 'text-text': sortBy == 'staked' }"
            >
              <span
                class="cursor-pointer"
                @click="
                  () => {
                    sort('staked');
                  }
                "
              >{{ $t('components.validatorTable.staked') }}
                <span v-if="sortBy == 'staked' && sortOrder == 'asc'">&uarr;</span><span v-else-if="sortBy == 'staked'">&darr;</span></span>
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
            v-for="validator of filteredAndSortedValidatorList"
            :key="validator.operator_address"
            :set="(isDisabled = disabledList.includes(validator.operator_address))"
            class="group"
            :class="{ 'opacity-50': isDisabled, 'cursor-pointer': !isDisabled }"
            @click="
              () => {
                detailedValidator = validator;
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
                  v-tippy
                  class="ml-8"
                  :content="validator.jailed ? 'Validator jailed' : 'Stake'"
                  :name="$t('components.validatorTable.stake')"
                  :full-width="false"
                  :disabled="validator.jailed"
                  @click.stop="
                    () => {
                      if (
                        !disabledList.includes(validator.operator_address) ||
                        currentlyEditing != validator.operator_address
                      ) {
                        selectValidator(validator);
                      }
                    }
                  "
                />
                <Icon class="text-muted ml-5" name="CaretRightIcon" :icon-size="1" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex items-start pl-8 sticky top-0">
      <Transition>
        <ValidatorCard
          v-if="detailedValidator"
          :validator="detailedValidator"
          :disabled="
            disabledList.includes(detailedValidator.operator_address) &&
              currentlyEditing != detailedValidator.operator_address
          "
          @close="
            () => {
              detailedValidator = null;
            }
          "
          @clicked="
            if (
              !disabledList.includes(detailedValidator.operator_address) ||
              currentlyEditing != detailedValidator.operator_address
            ) {
              selectValidator(detailedValidator);
            }
          "
        />
      </Transition>
    </div>
  </section>
</template>

<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, PropType, ref, toRefs } from 'vue';
import { useStore } from 'vuex';

import Price from '@/components/common/Price.vue';
import Search from '@/components/common/Search.vue';
import Ticker from '@/components/common/Ticker.vue';
import ValidatorBadge from '@/components/common/ValidatorBadge.vue';
import ValidatorCard from '@/components/stake/ValidatorCard.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalDemerisGetterTypes } from '@/store';
import { ChainData } from '@/store/demeris-api/state';

enum ValStyle {
  LIST = 'list',
  ACTIONLIST = 'actionlist',
}
type ValStyleType = `${ValStyle}`;
//TODO: implement type for validator list
export default defineComponent({
  name: 'ValidatorTable',
  components: { Search, ValidatorBadge, Ticker, Button, Icon, Price, ValidatorCard },
  props: {
    validatorList: {
      type: Array as PropType<any[]>,
      required: true,
      default: () => [],
    },
    disabledList: {
      type: Array as PropType<any[]>,
      required: false,
      default: () => [],
    },
    tableStyle: {
      type: String as PropType<ValStyleType>,
      default: 'actionlist',
    },
    currentlyEditing: {
      type: String as PropType<string>,
      required: false,
      default: '',
    },
    sortingBy: {
      type: String as PropType<'power' | 'name' | 'commission' | 'staked'>,
      required: false,
      default: 'power',
    },
    sortingOrder: {
      type: String as PropType<'asc' | 'desc'>,
      required: false,
      default: 'desc',
    },
  },
  emits: ['selectValidator'],
  setup(props, { emit }) {
    /* hooks */
    const store = useStore();
    const isDisabled = ref(false);
    const propsRef = toRefs(props);
    /* preset variables */
    const chain = computed(() => {
      return store.getters[GlobalDemerisGetterTypes.API.getChain]({
        chain_name: propsRef.validatorList.value[0].chain_name,
      });
    });
    const baseDenom = (chain.value as ChainData)?.denoms.find((x) => x.stakable).name;
    const precision = store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({ name: baseDenom });
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
        .filter((vali: any) => vali.moniker.toLowerCase().indexOf(query) !== -1)
        .sort((a, b) => {
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
    const getAmountDisplayValue = (value) => {
      return Math.trunc(new BigNumber(value).dividedBy(10 ** precision).toNumber()).toLocaleString('en-US');
    };
    const getVotingPowerPercDisplayValue = (value) => {
      return (
        new BigNumber(value).dividedBy(totalStakedAmount.value).multipliedBy(100).decimalPlaces(2).toString() + '%'
      );
    };
    const selectValidator = (vali) => {
      emit('selectValidator', vali);
    };

    return {
      baseDenom,
      filteredAndSortedValidatorList,
      keyword,
      getCommissionDisplayValue,
      getAmountDisplayValue,
      getVotingPowerPercDisplayValue,
      selectValidator,
      detailedValidator,
      hasActions,
      sort,
      sortBy,
      sortOrder,
      isDisabled,
    };
  },
});
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
