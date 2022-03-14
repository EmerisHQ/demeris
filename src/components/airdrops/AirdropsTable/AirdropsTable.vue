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

    <tbody v-for="(mappedItem, mappedIndex) in mappedAirdrops" :key="mappedIndex">
      <div v-if="mappedItem.sectionTitle" class="text-2 font-medium mt-2 mb-4">
        {{ mappedItem.sectionTitle }}
      </div>
      <tr
        v-for="(airdrop, index) in mappedItem.airdrops"
        :key="index"
        class="assets-table__row group cursor-pointer"
        @click="handleClick(airdrop)"
      >
        <td class="py-5 align-middle group-hover:bg-fg transition">
          <div class="flex items-center">
            <div>
              <img v-if="airdrop.tokenIcon" :src="airdrop.tokenIcon" alt="Airdrop Logo" class="w-10" />

              <div v-else class="w-10 h-10 bg-text text-inverse rounded-full text-center pt-1.5 text-1">
                {{ airdrop.chainName ? airdrop.chainName.slice(0, 1) : '-' }}
              </div>
            </div>
            <div class="ml-4 whitespace-nowrap overflow-hidden overflow-ellipsis min-w-0">
              <span class="font-medium"><ChainName :name="airdrop.project" /></span>
              <div class="-text-1 font-normal text-muted mt-0.5">
                <Ticker :name="airdrop.tokenTicker ? airdrop.tokenTicker : '-'" />
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
import { EmerisAirdrops } from '@emeris/types';
import { computed, defineComponent, PropType, ref, watch } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import Ticker from '@/components/common/Ticker.vue';

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
      type: Array as PropType<EmerisAirdrops.Airdrop[]>,
      required: true,
    },
    activeFilter: {
      type: String,
      default: '',
    },
  },
  emits: ['row-click'],
  setup(props, { emit }) {
    const keyword = ref<string>('');
    let mappedAirdrops = ref([]);

    const handleClick = (airdrop: EmerisAirdrops.Airdrop) => {
      emit('row-click', airdrop);
    };

    const sections = computed(() => {
      if (props.activeFilter === 'mine') {
        return ['claimable', 'claimed', 'upcoming'];
      } else if (props.activeFilter === 'upcoming') {
        return ['eligible', 'to_be_announced', 'not_eligible'];
      } else if (props.activeFilter === 'live') {
        return ['eligible', 'more_live_airdrops'];
      }
      return [];
    });

    const setAirdropsTable = (activeFilter: string) => {
      mappedAirdrops.value = [];
      if (activeFilter === 'all') {
        const mappedAirdropsObj = { sectionTitle: null, airdrops: props.airdrops };
        mappedAirdrops.value.push(mappedAirdropsObj);
      } else if (activeFilter === 'past') {
        const mappedAirdropsObj = {
          sectionTitle: null,
          airdrops: props.airdrops.filter((airdropItem) => airdropItem.dateStatus === 'ended'),
        };
        mappedAirdrops.value.push(mappedAirdropsObj);
      } else {
        sections.value.forEach((item) => {
          const mappedAirdropsObj = {
            sectionTitle: item,
            airdrops: props.airdrops.filter((airdropItem) => airdropItem.eligibility === item),
          };
          mappedAirdrops.value.push(mappedAirdropsObj);
        });
      }
    };

    watch(
      () => [props.activeFilter],
      async () => {
        setAirdropsTable(props.activeFilter);
      },
      { immediate: true },
    );

    return {
      keyword,
      handleClick,
      mappedAirdrops,
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
