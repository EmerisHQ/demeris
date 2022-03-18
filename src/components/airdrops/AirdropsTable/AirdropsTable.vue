<template>
  <div v-for="(mappedItem, mappedIndex) in mappedAirdrops" :key="mappedIndex">
    <table class="assets-table w-full">
      <tbody>
        <tr>
          <td
            v-if="mappedItem.sectionTitle"
            colspan="3"
            class="flex justify-between items-center mt-8 mb-4"
            style="padding-right: 0 !important; padding-left: 0 !important"
          >
            <p class="text-2 font-medium capitalize">
              {{ mappedItem.sectionTitle.replace(/\_/g, ' ').toLowerCase() }}
            </p>
            <a
              v-if="mappedItem.shouldMinimize"
              class="font-medium flex items-center cursor-pointer"
              @click="seeAllMappedSection({ ...mappedItem, shouldMinimize: false })"
            >
              See all<Icon name="ArrowRightIcon" :icon-size="0.6" class="ml-2" />
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="mappedItem.airdrops.length === 0" class="my-8 text-muted -text-1">
      No {{ mappedItem.sectionTitle.replace(/\_/g, ' ').toLowerCase() }} airdrops
    </p>
    <table v-else class="assets-table w-full">
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
          v-for="(airdrop, index) in mappedItem.shouldMinimize ? mappedItem.airdrops.slice(0, 3) : mappedItem.airdrops"
          :key="index"
          class="assets-table__row group cursor-pointer"
          @click="handleClick(airdrop)"
        >
          <td class="py-5 align-middle group-hover:bg-fg transition">
            <div class="flex items-center">
              <div>
                <img v-if="airdrop.tokenIcon" :src="airdrop.tokenIcon" alt="Airdrop Logo" class="w-10 rounded-full" />

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
            <p v-if="airdrop.dateStatus === 'NOT_ANNOUNCED'">{{ 'Not Announced' }}</p>
            <p v-if="airdrop.dateStatus === 'NOT_STARTED'">
              {{ airdrop.airdropStartDate ? `Starts ${airdrop.airdropStartDate}` : 'Not announced' }}
            </p>
            <p v-else-if="airdrop.dateStatus === 'ONGOING'">
              {{ airdrop.airdropEndDate ? `Ends ${airdrop.airdropEndDate}` : 'Not announced' }}
            </p>
            <p v-else>{{ airdrop.airdropEndDate ? `Ended ${airdrop.airdropEndDate}` : 'Not announced' }}</p>
          </td>

          <td class="py-5 align-middle group-hover:bg-fg transition text-right">
            <div v-if="airdrop.eligibility === 'AUTO_DROP'" class="flex items-center float-right">
              <Icon :name="'CheckIcon'" :icon-size="1" class="mr-2" />Auto-drop
            </div>
            <div v-else-if="airdrop.eligibility === 'NOT_ELIGIBLE'" class="text-muted">Not eligible</div>
            <div v-else-if="airdrop.eligibility === 'ELIGIBLE'">Eligible</div>
            <div v-else-if="airdrop.eligibility === 'CLAIMABLE'">
              <Button name="Claim" />
            </div>
            <div v-else-if="airdrop.eligibility === 'CLAIMED'" class="flex items-center float-right">
              <Icon :name="'CheckIcon'" :icon-size="1" class="mr-2" />Claimed
            </div>
            <div v-else class="text-muted">Not available</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { Airdrop, AirdropDateStatus } from '@/types/api';

export default defineComponent({
  name: 'AirdropsTable',

  components: {
    ChainName,
    Ticker,
    Button,
    Icon,
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
    activeFilter: {
      type: String,
      default: '',
    },
  },
  emits: ['row-click'],
  setup(props, { emit }) {
    const keyword = ref<string>('');
    let mappedAirdrops = ref([]);
    let tempMappedAirdrops = ref([]);

    const handleClick = (airdrop: Airdrop) => {
      emit('row-click', airdrop);
    };

    const sections = computed(() => {
      if (props.activeFilter === 'mine') {
        return ['CLAIMABLE', 'CLAIMED', 'upcoming'];
      } else if (props.activeFilter === 'upcoming') {
        return ['ELIGIBLE', 'NOT_AVAILABLE', 'NOT_ELIGIBLE'];
      } else if (props.activeFilter === 'live') {
        return ['ELIGIBLE', 'more_live'];
      }
      return [];
    });

    const setAirdropsTable = (activeFilter: string) => {
      mappedAirdrops.value = [];
      if (activeFilter === 'all') {
        const mappedAirdropsObj = { sectionTitle: null, airdrops: props.airdrops, shouldMinimize: false };
        mappedAirdrops.value.push(mappedAirdropsObj);
      } else if (activeFilter === 'past') {
        const mappedAirdropsObj = {
          sectionTitle: null,
          airdrops: props.airdrops.filter((airdropItem) => airdropItem.dateStatus === AirdropDateStatus.ENDED),
          shouldMinimize: false,
        };
        mappedAirdrops.value.push(mappedAirdropsObj);
      } else {
        sections.value.forEach((item) => {
          const airdrops = props.airdrops.filter((airdropItem) => airdropItem.eligibility === item);
          const mappedAirdropsObj = {
            sectionTitle: item,
            airdrops,
            shouldMinimize: airdrops.length > 3,
          };
          mappedAirdrops.value.push(mappedAirdropsObj);
        });
      }
    };

    const seeAllMappedSection = (mappedItem: any) => {
      tempMappedAirdrops.value = mappedAirdrops.value;
      mappedAirdrops.value = [];
      mappedAirdrops.value.push(mappedItem);
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
      seeAllMappedSection,
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
