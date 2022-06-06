<template>
  <div v-for="(mappedItem, mappedIndex) in mappedAirdrops" :key="mappedIndex">
    <table v-if="showSectionTitle(mappedItem.sectionTitle)" class="assets-table w-full">
      <tbody>
        <tr>
          <td v-if="mappedItem.sectionTitle" colspan="3" class="flex justify-between items-center mt-8 mb-4 pr-0 pl-0">
            <p class="text-2 font-medium capitalize">
              {{ sectionTitle(mappedItem.sectionTitle) }}
            </p>
            <a
              v-if="mappedItem.shouldMinimize"
              class="font-medium flex items-center cursor-pointer"
              @click="seeAllMappedSection({ ...mappedItem, shouldMinimize: false })"
            >
              {{ $t('context.airdrops.seeAll') }}<Icon name="ArrowRightIcon" :icon-size="0.6" class="ml-2" />
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="mappedItem.airdrops.length === 0 && !keyword" class="my-8 text-muted -text-1">
      {{ $t('context.airdrops.noResult.noAirdrops', { title: sectionTitle(mappedItem.sectionTitle) }) }}
    </p>
    <div v-if="mappedItem.airdrops.length === 0 && keyword" class="mt-12">
      <div class="w-1/3 mx-auto text-center">
        <img src="~@/assets/images/no-search-result.png" alt="No search result" />
        <div class="w-full mx-auto">
          <div class="text-1 font-medium mt-6">
            {{
              $t('context.airdrops.noResult.noAirdropForKeyword', {
                keyword,
                title: sectionTitle(mappedItem.sectionTitle),
              })
            }}
          </div>
          <p class="text-muted mt-4">{{ $t('context.airdrops.noResult.couldNotFind') }}</p>
        </div>
      </div>
    </div>
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

      <p v-if="keyword" class="my-6 font-medium">
        {{ $t('context.airdrops.noOfResults', { results: mappedItem.airdrops.length, keyword }) }}
      </p>

      <tbody
        v-for="(airdrop, index) in mappedItem.shouldMinimize ? mappedItem.airdrops.slice(0, 3) : mappedItem.airdrops"
        :key="index"
      >
        <tr v-if="airdrop.project" class="assets-table__row group cursor-pointer" @click="handleClick(airdrop)">
          <td class="py-5 align-middle group-hover:bg-fg transition">
            <div class="flex items-center">
              <div>
                <img
                  v-if="!imageFailIndexes.includes(index)"
                  :src="airdrop.tokenIcon"
                  alt="Airdrop Logo"
                  class="w-10 rounded-full"
                  @error="imageLoadError(index)"
                />

                <div v-else class="w-10 h-10 bg-text text-inverse rounded-full text-center pt-2 text-0">
                  {{ airdrop.project ? airdrop.project.slice(0, 2) : '-' }}
                </div>
              </div>
              <div class="ml-4 whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
                <span class="font-medium"><ChainName :name="airdrop.project ? airdrop.project : '-'" /></span>
                <div class="-text-1 font-normal text-muted mt-0.5">
                  <Ticker :name="airdrop.tokenTicker ? airdrop.tokenTicker : '-'" />
                </div>
              </div>
            </div>
          </td>

          <td class="py-5 align-middle text-muted group-hover:bg-fg transition">
            <p v-if="airdrop.dateStatus === EmerisAirdrops.AirdropDateStatus.NOT_ANNOUNCED">{{ 'Not Announced' }}</p>
            <p v-if="airdrop.dateStatus === EmerisAirdrops.AirdropDateStatus.NOT_STARTED">
              {{ airdrop.airdropStartDate ? `Starts ${airdrop.airdropStartDate}` : 'Not announced' }}
            </p>
            <p v-else-if="airdrop.dateStatus === EmerisAirdrops.AirdropDateStatus.ONGOING">
              {{ airdrop.airdropEndDate ? `Ends ${airdrop.airdropEndDate}` : 'Not announced' }}
            </p>
            <p v-else>{{ airdrop.airdropEndDate ? `Ended ${airdrop.airdropEndDate}` : 'Not announced' }}</p>
          </td>

          <td class="py-5 align-middle group-hover:bg-fg transition text-right">
            <SkeletonLoader v-if="!airdrop.eligibility" width="100px" height="20px" />
            <div
              v-if="airdrop.eligibility === AirdropEligibilityStatus.AUTO_DROP"
              class="flex items-center float-right"
            >
              <Icon :name="'CheckIcon'" :icon-size="1" class="mr-2" />Auto-drop
            </div>
            <div v-else-if="airdrop.eligibility === AirdropEligibilityStatus.NOT_ELIGIBLE" class="text-muted">
              Not eligible
            </div>
            <div v-else-if="airdrop.eligibility === AirdropEligibilityStatus.ELIGIBLE">Eligible</div>
            <div v-else-if="airdrop.eligibility === AirdropEligibilityStatus.CLAIMABLE">
              <Button name="Claim" />
            </div>
            <div
              v-else-if="airdrop.eligibility === AirdropEligibilityStatus.CLAIMED"
              class="flex items-center float-right"
            >
              <Icon :name="'CheckIcon'" :icon-size="1" class="mr-2" />Claimed
            </div>
            <div v-if="airdrop.eligibility === AirdropEligibilityStatus.ELIGIBILITY_UNAVAILABLE" class="text-muted">
              Eligibility unavailable
            </div>
            <div v-if="airdrop.eligibility === AirdropEligibilityStatus.ENDED" class="text-muted">-</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
import { EmerisAirdrops } from '@emeris/types';
import { computed, ref, watch } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalGetterTypes } from '@/store';
import { typedstore } from '@/store/setup';
import { AirdropDateStatus } from '@/types/api';
import { AirdropEligibilityStatus } from '@/utils/airdropEligibility';

interface Props {
  showHeaders?: boolean;
  limitRows?: number;
  airdrops: EmerisAirdrops.Airdrop[];
  keyword?: string;
  activeFilter?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showHeaders: true,
  limitRows: undefined,
  keyword: '',
  activeFilter: '',
});

const emit = defineEmits<{
  (e: 'row-click', airdrop: any): void;
}>();

let watchedAirdrops = ref([]);
let mappedAirdrops = ref([]);
let imageFailIndexes = ref([]);

const handleClick = (airdrop: EmerisAirdrops.Airdrop) => {
  emit('row-click', airdrop);
};

const noAirdropsToClaim = computed(() => {
  return watchedAirdrops.value.some((item) => item.eligibility !== AirdropEligibilityStatus.CLAIMABLE);
});

const isDemoAccount = computed(() => {
  return (
    !typedstore.getters[GlobalGetterTypes.USER.isSignedIn] || typedstore.getters[GlobalGetterTypes.USER.isDemoAccount]
  );
});

const sections = computed(() => {
  if (props.activeFilter === 'mine') {
    if (noAirdropsToClaim.value) return ['CLAIMED', 'NOT_STARTED'];
    else return ['CLAIMABLE', 'CLAIMED', 'NOT_STARTED'];
  } else if (props.activeFilter === 'upcoming' || props.activeFilter === 'live') {
    if (isDemoAccount.value) return [];
    else return ['ELIGIBLE', 'ELIGIBILITY_UNAVAILABLE', 'NOT_ELIGIBLE'];
  }
  return [];
});

const setAirdropsTable = (activeFilter: string) => {
  mappedAirdrops.value = [];
  if (activeFilter === 'all') {
    const mappedAirdropsObj = { sectionTitle: 'all', airdrops: watchedAirdrops.value, shouldMinimize: false };
    mappedAirdrops.value.push(mappedAirdropsObj);
  } else if (activeFilter === 'past') {
    const mappedAirdropsObj = {
      sectionTitle: 'past',
      airdrops: watchedAirdrops.value.filter((airdropItem) => airdropItem.dateStatus === AirdropDateStatus.ENDED),
      shouldMinimize: false,
    };
    mappedAirdrops.value.push(mappedAirdropsObj);
  } else if (activeFilter === 'upcoming' && sections.value.length === 0) {
    const mappedAirdropsObj = {
      sectionTitle: 'upcoming',
      airdrops: watchedAirdrops.value.filter(
        (airdropItem) =>
          airdropItem.dateStatus === AirdropDateStatus.NOT_STARTED ||
          airdropItem.dateStatus === AirdropDateStatus.NOT_ANNOUNCED,
      ),
      shouldMinimize: false,
    };
    mappedAirdrops.value.push(mappedAirdropsObj);
  } else if (activeFilter === 'upcoming' && sections.value.length > 0) {
    sections.value.forEach((item) => {
      const airdrops = watchedAirdrops.value.filter(
        (airdropItem) =>
          airdropItem.eligibility === item &&
          (airdropItem.dateStatus === AirdropDateStatus.NOT_STARTED ||
            airdropItem.dateStatus === AirdropDateStatus.NOT_ANNOUNCED),
      );
      const mappedAirdropsObj = {
        sectionTitle: item,
        airdrops,
        shouldMinimize: airdrops.length > 3,
      };
      mappedAirdrops.value.push(mappedAirdropsObj);
    });
  } else if (activeFilter === 'live' && sections.value.length === 0) {
    const mappedAirdropsObj = {
      sectionTitle: 'live',
      airdrops: watchedAirdrops.value.filter((airdropItem) => airdropItem.dateStatus === AirdropDateStatus.ONGOING),
      shouldMinimize: false,
    };
    mappedAirdrops.value.push(mappedAirdropsObj);
  } else if (activeFilter === 'live' && sections.value.length > 0) {
    sections.value.forEach((item) => {
      const airdrops = watchedAirdrops.value.filter(
        (airdropItem) => airdropItem.eligibility === item && airdropItem.dateStatus === AirdropDateStatus.ONGOING,
      );
      const mappedAirdropsObj = {
        sectionTitle: item,
        airdrops,
        shouldMinimize: airdrops.length > 3,
      };
      mappedAirdrops.value.push(mappedAirdropsObj);
    });
  } else {
    sections.value.forEach((item) => {
      const airdrops = watchedAirdrops.value.filter((airdropItem) => airdropItem.eligibility === item);
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
  mappedAirdrops.value = [];
  mappedAirdrops.value.push(mappedItem);
};

const imageLoadError = (airdropIndex: number) => {
  imageFailIndexes.value.push(airdropIndex);
};

watch(
  () => [props.activeFilter, props.airdrops],
  async (props: any) => {
    watchedAirdrops.value = props[1];
    setAirdropsTable(props[0]);
  },
  { immediate: true },
);

const sectionTitle = (title: string) => {
  return title ? title.replace(/\_/g, ' ').toLowerCase() : '';
};

const showSectionTitle = computed(() => {
  return (title) => {
    return title !== 'all' && title !== 'past' && title !== 'upcoming' && title !== 'live';
  };
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
