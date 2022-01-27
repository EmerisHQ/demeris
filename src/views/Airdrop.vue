<template>
  <AppLayout>
    <div class="md:flex justify-between">
      <div class="flex flex-col md:col-span-5 lg:col-span-5 w-full max-w-3xl lg:pr-px mb-16 md:mb-0">
        <header class="w-full max-w-7xl mx-auto">
          <GoBack :title="`${$t('context.airdrops.allAirdrops')}`" @go-back="goBackToAirdropspage" />
        </header>

        <section>
          <!-- Airdrop Banner -->
          <div>
            <img src="~@/assets/images/airdrop-banner.png" alt="Airdrop Banner" />
          </div>

          <!-- Airdrop Title -->
          <div class="mt-8">
            <div class="text-2 font-bold mt-1 mb-2">Likecoin Airdrop</div>
            <div class="items-center">
              <span class="text-muted">LIKE</span><span class="live-tag -text-1 ml-2 font-medium">Live</span>
            </div>
          </div>

          <Divider extra-classes="my-12" />

          <!-- About the Project -->
          <div class="w-3/4">
            <div class="text-1 font-medium mt-1 mb-6">About the project</div>

            <!-- Description -->
            <div>
              <p class="mb-4 description-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae lacus quis ex congue accumsan.
                Pellentesque mattis ligula viverra, fermentum sem non, mollis quam. Mauris vel tincidunt dui. Donec at
                elit scelerisque, sagittis ex in, varius nibh.
              </p>

              <p class="mb-4 description-text">
                Cras tellus ligula, maximus eu nulla sed, tempus molestie lorem. Mauris euismod nunc a felis efficitur,
                at egestas risus vestibulum. Suspendisse nisl lectus, faucibus vel consequat congue, faucibus vel felis.
                Cras finibus consectetur lorem, vel tempor massa lobortis in.
              </p>

              <p class="mb-4 description-text">
                Morbipharetra ut dui ut vulputate. Pellentesque at ante non dolor efficitur condimentum. Duis diam erat,
                placerat sed ipsum at, sollicitudin pellentesque massa vulputate noahin.
              </p>
            </div>

            <!-- Links -->
            <div class="w-3/4 flex justify-between items-center mt-12">
              <a class="flex -text-1"><LinkIcon class="mr-2" /><span class="color-blue">Condex.com↗️</span></a>
              <a class="flex -text-1"><LinkIcon class="mr-2" /><span class="color-blue">Discord↗️</span></a>
              <a class="flex -text-1"><LinkIcon class="mr-2" /><span class="color-blue">Medium↗️</span></a>
              <a class="flex -text-1"><LinkIcon class="mr-2" /><span class="color-blue">Twitter↗️</span></a>
            </div>
          </div>

          <Divider extra-classes="my-12" />

          <!-- Eligibility Criteria -->
          <div class="w-3/4 mb-12">
            <div class="text-1 font-medium mt-1 mb-6">How to be eligible</div>
            <ul class="eligibility-criteria">
              <li>
                Snapshot taken at 8th October for: ATOM & XPRT. Luna is 1st block of columbus 5, still troubleshooting,
                will announce soon. ask to send to blockheight, stake.like.co↗️
              </li>
              <li>
                Balances that were vesting or unbonding at the time of the snapshot are not eligible. LPs of tokens were
                excluded from the airdrop.
              </li>
            </ul>
          </div>

          <!-- Quick Info -->
          <div class="w-3/4 flex items-center text-muted border border-border rounded-xl px-6 py-4">
            <WarningCircleIcon class="mr-4" />
            <p class="-text-1">Airdrop criteria is subject to change by project maintainers.</p>
          </div>
        </section>
      </div>

      <aside class="flex flex-col mx-auto md:ml-8 lg:ml-12 md:mr-0 max-w-xs">
        <AirdropClaim />
        <AirdropsInfo class="mt-8" />
      </aside>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed, defineComponent, toRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import AirdropClaim from '@/components/airdrops/AirdropClaim';
import AirdropsInfo from '@/components/airdrops/AirdropsInfo';
import GoBack from '@/components/common/headers/GoBack.vue';
import LinkIcon from '@/components/common/Icons/LinkIcon.vue';
import WarningCircleIcon from '@/components/common/Icons/WarningCircleIcon.vue';
import Divider from '@/components/ui/Divider.vue';
import airdropsData from '@/data/sampleAirdrops';
import AppLayout from '@/layouts/AppLayout.vue';
import { GlobalDemerisActionTypes, GlobalDemerisGetterTypes, TypedAPIStore } from '@/store';
import { Airdrop } from '@/types/api';
import { pageview } from '@/utils/analytics';

export default defineComponent({
  name: 'Airdrop',
  components: {
    AppLayout,
    AirdropClaim,
    GoBack,
    AirdropsInfo,
    Divider,
    LinkIcon,
    WarningCircleIcon,
  },

  setup() {
    const apistore = useStore() as TypedAPIStore;
    const { t } = useI18n({ useScope: 'global' });
    pageview({ page_title: 'Airdrops', page_path: '/' });
    useMeta(
      computed(() => ({
        title: t('navbar.airdrops'),
      })),
    );

    const router = useRouter();
    const airdrops = airdropsData.sampleAirdrops;

    const openAirdropPage = (airdrop: Airdrop) => {
      router.push('/airdrop');
      apistore.dispatch(GlobalDemerisActionTypes.API.GET_SELECTED_AIRDROP, {
        params: {
          airdrop,
        },
      });
    };

    const selectedAirdrop = computed(() => {
      return toRaw(apistore.getters[GlobalDemerisGetterTypes.API.getSelectedAirdrop]);
    });

    const goBackToAirdropspage = () => {
      router.push('/airdrops');
    };

    return { airdrops, openAirdropPage, selectedAirdrop, goBackToAirdropspage };
  },
});
</script>

<style lang="scss" scoped>
.live-tag {
  background: rgba(0, 207, 48, 0.16);
  color: #008223;
  padding: 4px 12px;
  border-radius: 6px;
}
.color-blue {
  color: #094efd;
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
</style>
