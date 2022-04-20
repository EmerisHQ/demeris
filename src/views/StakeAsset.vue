<template>
  <div class="stake-asset relative flex flex-col w-full min-h-screen items-center">
    <header class="absolute w-full max-w-7xl mx-auto flex items-center justify-between py-6 px-8 h-24">
      <router-link to="/" class="ml-auto">
        <Button variant="link" :full-width="false">
          <Icon name="CloseIcon" :icon-size="1.5" />
        </Button>
      </router-link>
    </header>
    <main class="w-full max-w-7xl mx-auto px-8">
      <div class="w-full max-w-md mx-auto">
        <header class="w-full max-w-7xl mx-auto px-2">
          <TitleWithGoback
            :title="$t('pages.stakeAsset.select')"
            :func="() => $router.back()"
            :show-back-button="false"
          />
        </header>

        <div class="search-bar relative flex-1 min-h-0 flex flex-col">
          <Search v-model:keyword="keyword" placeholder="Search assets" class="w-full mx-auto max-w-md px-6 pb-3" />
          <div class="scroll-container overflow-y-auto grow min-h-0 pt-1">
            <div class="mx-auto max-w-md mb-20">
              <CoinList
                v-if="keywordFilteredAssets.length > 0"
                :data="keywordFilteredAssets"
                type="pay"
                show-balance
                :keyword="keyword"
                @select="assetSelectHandler"
              >
              </CoinList>
            </div>
          </div>
          <WhiteOverlay />
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { EmerisAPI } from '@emeris/types';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import CoinList from '@/components/common/CoinList.vue';
import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import Search from '@/components/common/Search.vue';
import WhiteOverlay from '@/components/common/WhiteOverlay.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import { GlobalGetterTypes } from '@/store';
import { StakingActions } from '@/types/actions';
import { getDisplayName } from '@/utils/actionHandler';
import { useStore } from '@/utils/useStore';

const { stakableBalances } = useAccount();
const router = useRouter();

const keyword = ref('');
const displayNameAddedList = ref([]);

watch(
  () => stakableBalances.value,
  async () => {
    if (stakableBalances.value.length) {
      displayNameAddedList.value = [
        await Promise.all(
          stakableBalances.value.map(async (asset) => {
            return {
              ...asset,
              display_name: await getDisplayName(
                asset.base_denom,
                useStore().getters[GlobalGetterTypes.API.getDexChain],
              ),
            };
          }),
        ),
      ];
    } else {
      return [];
    }
  },
  { immediate: true },
);

const keywordFilteredAssets = computed(() => {
  return (displayNameAddedList.value[0] ?? []).filter((asset) => {
    return asset.display_name?.toLowerCase().indexOf(keyword.value.toLowerCase()) !== -1;
  });
});

const assetSelectHandler = (asset: EmerisAPI.Balance) => {
  router.push(`/staking/${asset.base_denom}/${StakingActions.STAKE}`);
};
</script>
