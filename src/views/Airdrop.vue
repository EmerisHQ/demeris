<template>
  <NoMarginLayout>
    <header class="-mt-32 w-full header-bg">
      <div class="pt-24 pb-12 px-5 md:px-8 max-w-7xl mx-auto">
        <GoBack :title="`${$t('context.airdrops.allAirdrops')}`" @go-back="goBackToAirdropspage" />
        <!-- Airdrop Title -->
        <div class="mt-8">
          <div class="text-3 font-bold mt-1 mb-2">
            {{ selectedAirdrop.project }} {{ $t('context.airdrops.airdrop') }}
          </div>
          <div class="items-center">
            <span class="text-muted">
              {{ selectedAirdrop.tokenTicker }}
              <span v-if="selectedAirdrop.chainName" class="bg-text h-1 w-1 rounded-full inline-block mb-1 mx-2"></span>
              <span v-if="selectedAirdrop.chainName"
                >{{ selectedAirdrop.chainName }} {{ $t('context.airdrops.chain') }}</span
              >
            </span>
            <span
              v-if="selectedAirdrop.dateStatus === EmerisAirdrops.AirdropDateStatus.ONGOING"
              class="live-tag -text-1 ml-2 font-medium"
              >{{ $t('context.airdrops.live') }}</span
            >
          </div>
        </div>
      </div>
    </header>

    <div class="md:flex justify-between px-5 md:px-8 max-w-7xl mx-auto">
      <div class="flex flex-col md:col-span-5 lg:col-span-5 w-full max-w-3xl lg:pr-px mb-16 md:mb-0">
        <section class="mt-8">
          <!-- About the Project -->
          <div class="w-3/4">
            <div class="text-1 font-medium mt-1 mb-6">
              {{ $t('context.airdrops.aboutAirdropTitle', { project: selectedAirdrop.project }) }}
            </div>

            <!-- Description -->
            <div>
              <p v-for="(item, index) in selectedAirdrop.projectDescription" :key="index" class="mb-4 description-text">
                {{ item }}.
              </p>
            </div>

            <!-- Links -->
            <div class="w-full flex justify-between items-center mt-12">
              <a :href="selectedAirdrop.projectWebsiteUrl" class="flex -text-1"
                ><LinkIcon class="mr-2" /><span class="text-link">{{ selectedAirdrop.projectWebsiteUrl }}</span></a
              >
              <a :href="selectedAirdrop.discordUrl" class="flex -text-1"
                ><LinkIcon class="mr-2" /><span class="text-link">Discord↗️</span></a
              >
              <a :href="selectedAirdrop.mediumUrl" class="flex -text-1"
                ><LinkIcon class="mr-2" /><span class="text-link">Medium↗️</span></a
              >
              <a :href="selectedAirdrop.twitterUrl" class="flex -text-1"
                ><LinkIcon class="mr-2" /><span class="text-link">Twitter↗️</span></a
              >
            </div>
          </div>

          <Divider class="my-12" />

          <!-- Eligibility Criteria -->
          <div class="w-3/4 mb-12">
            <div class="text-1 font-medium mt-1 mb-6">{{ $t('context.airdrops.howToBeEligible') }}</div>
            <ul class="eligibility-criteria">
              <li v-for="(criteriaItem, index) in selectedAirdrop.eligibilityCriteria" :key="index">
                {{ criteriaItem.description }}
              </li>
            </ul>
          </div>

          <!-- Quick Info -->
          <div>
            <p class="font-medium mb-4">{{ $t('context.airdrops.moreDetails') }}</p>
            <div class="w-3/4 flex items-center text-muted bg-fg rounded-xl px-6 py-4">
              <InformationIcon class="mr-4" />
              <p class="-text-1">{{ $t('context.airdrops.subjectToChange') }}</p>
            </div>
          </div>
        </section>
      </div>

      <aside class="-mt-32 flex flex-col mx-auto md:ml-8 lg:ml-12 md:mr-0 max-w-xs">
        <AirdropClaim :selected-airdrop="selectedAirdrop" />
        <!-- <AirdropsCurrentBalance :selected-airdrop="selectedAirdrop" class="mt-8" /> -->
      </aside>
    </div>
  </NoMarginLayout>
</template>

<script setup lang="ts">
import { EmerisAirdrops } from '@emeris/types';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import AirdropClaim from '@/components/airdrops/AirdropClaim';
import GoBack from '@/components/common/headers/GoBack.vue';
import InformationIcon from '@/components/common/Icons/InformationIcon.vue';
import LinkIcon from '@/components/common/Icons/LinkIcon.vue';
import Divider from '@/components/ui/Divider.vue';
import NoMarginLayout from '@/layouts/NoMarginLayout.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { pageview } from '@/utils/analytics';

const typedstore = useStore() as RootStoreTyped;
const { t } = useI18n({ useScope: 'global' });
pageview({ page_title: 'Airdrops', page_path: '/' });
useMeta(
  computed(() => ({
    title: t('navbar.airdrops'),
  })),
);

const router = useRouter();
const route = useRoute();

const airdrops = computed(() => {
  return typedstore.getters[GlobalGetterTypes.API.getAirdrops];
});

const selectedAirdrop = computed(() => {
  let projectDescription = [];
  const airdrop = airdrops.value.filter((item) => item.tokenTicker === route.params.airdrop)[0];
  if (airdrop && airdrop.projectDescription.includes('.')) {
    projectDescription = airdrop ? airdrop.projectDescription.split('.') : [];
  } else {
    projectDescription.push(airdrop ? airdrop.projectDescription : []);
  }
  return {
    ...airdrop,
    projectDescription: projectDescription.length > 1 ? projectDescription.slice(0, -1) : projectDescription,
  };
});

const goBackToAirdropspage = () => {
  router.push('/airdrops');
};
</script>

<style lang="scss" scoped>
.live-tag {
  background: rgba(0, 207, 48, 0.16);
  color: #008223;
  padding: 4px 12px;
  border-radius: 6px;
}
ul {
  &.eligibility-criteria {
    list-style: circle;
    padding-left: 1.5rem;
    li {
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
  }
}
.description-text {
  line-height: 1.5;
}
.header-bg {
  background: radial-gradient(100% 100% at 17.19% 0%, rgba(80, 206, 235, 0.08) 0%, rgba(22, 61, 70, 0.08) 100%);
}
.dark .header-bg {
  background: radial-gradient(100% 100% at 17.19% 0%, rgba(80, 206, 235, 0.8) 0%, rgba(22, 61, 70, 0.8) 100%);
}
</style>
