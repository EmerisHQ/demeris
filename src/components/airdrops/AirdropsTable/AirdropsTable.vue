<template>
  <table class="assets-table">
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

    <tbody v-if="true">
      <tr
        v-for="(airdrop, index) in airdrops"
        :key="index"
        class="assets-table__row group cursor-pointer"
        @click="handleClick(airdrop)"
      >
        <td class="py-5 align-middle group-hover:bg-fg transition">
          <div class="flex items-center">
            <div>
              <img v-if="airdrop.tokenIcon" :src="airdrop.tokenIcon" alt="Airdrop Logo" class="w-10" />

              <div v-else class="w-10 h-10 bg-text text-inverse rounded-full text-center pt-1.5 text-1">
                {{ airdrop.chainName.slice(0, 1) }}
              </div>
            </div>
            <div class="ml-4 whitespace-nowrap overflow-hidden overflow-ellipsis min-w-0">
              <span class="font-medium"><ChainName :name="airdrop.chainName" /></span>
              <div class="-text-1 font-normal text-muted mt-0.5">
                <Ticker :name="airdrop.tokenTicker" />
              </div>
            </div>
          </div>
        </td>

        <td class="py-5 align-middle text-muted group-hover:bg-fg transition">
          <p v-if="airdrop.dateStatus === 'not_started'">
            {{ airdrop.airdropStartDate ? `Starts ${airdrop.airdropStartDate}` : 'Start date not announced' }}
          </p>
          <p v-else-if="airdrop.dateStatus === 'ongoing'">
            {{ airdrop.airdropEndDate ? `Ends ${airdrop.airdropEndDate}` : 'End date not announced' }}
          </p>
          <p v-else>{{ airdrop.airdropEndDate ? airdrop.airdropEndDate : 'End date not announced' }}</p>
        </td>

        <td class="py-5 align-middle group-hover:bg-fg transition">
          <SkeletonLoader width="50%" height="30px" class="float-right" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import Ticker from '@/components/common/Ticker.vue';
import { GlobalDemerisActionTypes } from '@/store';
import { apistore } from '@/store/setup';
import { Airdrop } from '@/types/api';

export default defineComponent({
  name: 'AirdropsTable',

  components: {
    ChainName,
    Ticker,
    SkeletonLoader,
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

    const handleClick = (airdrop: Airdrop) => {
      emit('row-click', airdrop);
    };

    return {
      keyword,
      handleClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.assets-table {
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
