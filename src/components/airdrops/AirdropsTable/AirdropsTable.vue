<template>
  <div class="relative flex flex-col">
    <!-- Filter Area -->
    <div class="flex items-center mb-4">
      <div class="w-3/4 flex">
        <div
          v-for="(item, index) in filtersItems"
          :key="index"
          class="mx-2 rounded-full bg-fg px-4 py-2 -text-1 cursor-pointer flex items-center"
          :class="item.value === activeFilterItem && activeFilterItem !== 'more' ? 'bg-black text-white' : ''"
        >
          <a v-if="item.value === 'more'" class="flex items-center" @click="toggleMoreFilters(item)">
            {{ showMoreFilters ? 'Less' : 'More' }}
            <span class="ml-2"><CaretDownIcon v-if="!showMoreFilters" /><CaretUpIcon v-if="showMoreFilters" /></span>
          </a>
          <a v-else @click="setActiveFilter(item)">
            {{ item.text }}
          </a>
        </div>
      </div>
      <div class="w-1/4">
        <Search v-model:keyword="keyword" placeholder="Search airdrops" class="pools__search max-w-xs w-full" />
      </div>
    </div>

    <div v-if="showMoreFilters" class="flex mb-6">
      <div
        v-for="(moreItem, moreIndex) in moreFiltersItems"
        :key="moreIndex"
        class="mx-2 rounded-full bg-fg px-4 py-2 -text-1 cursor-pointer items-center"
        :class="moreItem.value === activeFilterItem ? 'bg-black text-white' : ''"
      >
        <a @click="setActiveFilter(moreItem)">
          {{ moreItem.text }}
        </a>
      </div>
    </div>

    <table class="assets-table -ml-6">
      <colgroup>
        <col width="40%" />
        <col width="20%" />
        <col width="40%" />
      </colgroup>

      <thead v-if="showHeaders" class="hidden md:table-header-group text-muted">
        <tr>
          <th class="align-middle -text-1 font-normal py-4 pr-0 sticky top-0 z-20 bg-app text-left">
            {{ $t('context.airdrops.asset') }}
          </th>
          <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-left">
            {{ $t('context.airdrops.date') }}
          </th>
          <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-20 bg-app text-right">
            {{ $t('context.airdrops.action') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(airdrop, index) in airdrops"
          :key="index"
          class="assets-table__row group cursor-pointer"
          @click="handleClick(airdrop)"
        >
          <td class="py-5 align-middle group-hover:bg-fg transition">
            <div class="flex items-center">
              <CircleSymbol :denom="airdrop.tokenTicker.toLowerCase()" />
              <div class="ml-4 whitespace-nowrap overflow-hidden overflow-ellipsis min-w-0">
                <span class="font-medium"><ChainName :name="airdrop.chainName" /></span>
                <div class="-text-1 font-normal text-muted mt-0.5">
                  <Ticker :name="airdrop.tokenTicker" />
                </div>
              </div>
            </div>
          </td>

          <td class="py-5 align-middle text-center text-muted group-hover:bg-fg transition">
            Starts {{ airdrop.startDate }}
          </td>

          <td class="py-5 align-middle group-hover:bg-fg transition">
            <template v-if="airdrop.eligibilityType === 'claim'">
              <div class="flex float-right items-center color-blue">
                <a class="mr-2">Claim</a>
                <ArrowRightIcon />
              </div>
            </template>
            <template v-else-if="airdrop.eligibilityType === 'eligible'">
              <div class="flex float-right items-center">
                <a>Eligible</a>
              </div>
            </template>
            <template v-else-if="airdrop.eligibilityType === 'becomeEligible'">
              <div class="flex float-right items-center color-blue">
                <a class="mr-2">Become Eligible</a>
                <ArrowRightIcon />
              </div>
            </template>
            <template v-else-if="airdrop.eligibilityType === 'notEligible'">
              <div class="flex float-right items-center text-muted">
                <a>Not Eligible</a>
              </div>
            </template>
            <template v-else-if="airdrop.eligibilityType === 'claimed'">
              <div class="flex float-right items-center color-green">
                <a class="mr-2">Claimed</a>
                <ClaimedIcon />
              </div>
            </template>
            <template v-else-if="airdrop.eligibilityType === 'autoDropped'">
              <div class="flex float-right items-center color-green">
                <a class="mr-2">Auto-dropped</a>
                <ClaimedIcon />
              </div>
            </template>
            <template v-else>
              <div class="flex float-right items-center color-blue">
                <a class="mr-2">Learn More</a>
                <ArrowRightIcon />
              </div>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import ArrowRightIcon from '@/components/common/Icons/ArrowRightIcon.vue';
import CaretDownIcon from '@/components/common/Icons/CaretDownIcon.vue';
import CaretUpIcon from '@/components/common/Icons/CaretUpIcon.vue';
import ClaimedIcon from '@/components/common/Icons/ClaimedIcon.vue';
import Search from '@/components/common/Search.vue';
import Ticker from '@/components/common/Ticker.vue';
import { Airdrop } from '@/types/api';

export default defineComponent({
  name: 'AirdropsTable',

  components: {
    ChainName,
    CircleSymbol,
    Ticker,
    Search,
    ArrowRightIcon,
    ClaimedIcon,
    CaretDownIcon,
    CaretUpIcon,
  },

  props: {
    showHeaders: {
      type: Boolean,
      default: true,
    },
    limitRows: {
      type: Number,
      default: undefined,
    },
    airdrops: {
      type: Array as PropType<Airdrop[]>,
      required: true,
    },
  },
  emits: ['row-click'],
  setup(props, { emit }) {
    const keyword = ref<string>('');
    const activeFilterItem = ref('all');
    const showMoreFilters = ref(false);

    const handleClick = (airdrop: Airdrop) => {
      emit('row-click', airdrop);
    };

    const setActiveFilter = (item: any) => {
      activeFilterItem.value = item.value;
    };

    const toggleMoreFilters = (item: any) => {
      showMoreFilters.value = !showMoreFilters.value;
      activeFilterItem.value = item.value;
    };

    const filtersItems = [
      {
        text: 'All',
        value: 'all',
      },
      {
        text: 'Eligible',
        value: 'eligible',
      },
      {
        text: 'Live',
        value: 'live',
      },
      {
        text: 'Upcoming',
        value: 'upcoming',
      },
      {
        text: 'More',
        value: 'more',
      },
    ];

    const moreFiltersItems = [
      {
        text: 'Ended',
        value: 'ended',
      },
      {
        text: 'Claimed',
        value: 'claimed',
      },
      {
        text: 'Auto Dropped',
        value: 'autodropped',
      },
    ];

    return {
      keyword,
      activeFilterItem,
      showMoreFilters,
      handleClick,
      setActiveFilter,
      toggleMoreFilters,
      filtersItems,
      moreFiltersItems,
    };
  },
});
</script>

<style lang="scss" scoped>
.assets-table {
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
.color-blue {
  color: #094efd;
}
.color-green {
  color: #008223;
}
.bg-black {
  background: black;
}
.text-white {
  color: white;
}
</style>
