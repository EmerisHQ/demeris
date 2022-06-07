<template>
  <div class="flex">
    <ChainSelectModal
      v-if="isModalOpen"
      :assets="chainSelectModalData"
      :title="'Select chain'"
      :func="toggleChainSelectModal"
      :selected-denom="selectedDenom"
      @select="chainSelectHandler"
    />
    <div v-else class="denom-select-modal-wrapper w-full h-full flex-1 flex flex-col items-stretch">
      <header class="w-full max-w-7xl mx-auto px-2">
        <TitleWithGoback :title="title" :func="func" :show-back-button="showBackButton" />
      </header>

      <div class="search-bar relative flex-1 min-h-0 flex flex-col">
        <Search v-model:keyword="keyword" placeholder="Search assets" class="w-full mx-auto max-w-md px-6 pb-3" />
        <div class="scroll-container overflow-y-auto grow min-h-0 pt-1">
          <div class="mx-auto max-w-md mb-20">
            <CoinList
              v-if="keywordFilteredAssets[0].length > 0"
              :data="keywordFilteredAssets[0]"
              :type="title === 'Receive' ? 'receive' : type || 'pay'"
              :show-balance="showBalance"
              :keyword="keyword"
              @select="coinListselectHandler"
            >
            </CoinList>

            <div v-if="keywordFilteredAssets[1].length > 0" class="other-assets">
              <div class="other-assets__title text-base font-bold px-6">
                {{ $t('components.denomSelect.otherAssets') }}
              </div>
              <div class="other-assets__subtitle -text-1 px-6">
                {{ $t('components.denomSelect.unavailableSwapPair', { pair: displaySelectedPair }) }}
              </div>
              <CoinList
                :data="keywordFilteredAssets[1]"
                :type="title === 'Receive' ? 'receive' : type || 'pay'"
                :show-balance="showBalance"
                :keyword="keyword"
                @select="coinListselectHandler"
              >
              </CoinList>
            </div>
          </div>
        </div>
        <WhiteOverlay />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import ChainSelectModal from '@/components/common/ChainSelectModal.vue';
import CoinList from '@/components/common/CoinList.vue';
import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import Search from '@/components/common/Search.vue';
import WhiteOverlay from '@/components/common/WhiteOverlay.vue';
import { GlobalGetterTypes } from '@/store';
import { getDisplayName, getTicker } from '@/utils/actionHandler';
import { useStore } from '@/utils/useStore';

interface Props {
  type?: string;
  assets: any;
  otherAssets?: any;
  counterDenom: any;
  func?: any;
  title: string;
  showBalance?: boolean;
  showBackButton: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: undefined,
  otherAssets: () => {
    return {};
  },
  counterDenom: null,
  func: () => void 0,
  showBalance: false,
  showBackButton: true,
});

const emit = defineEmits<{
  (e: 'select', payload: any): void;
}>();

const isModalOpen = ref(false);
const keyword = ref('');
const selectedDenom = ref(null);

const chainSelectModalData = ref(props.assets);

const displayNameAddedList = ref([]);
const displayNameAddedOtherList = ref([]);
watch(
  () => props.assets,
  async () => {
    if (props.assets.length) {
      displayNameAddedList.value = [
        await Promise.all(
          props.assets.map(async (asset) => {
            return {
              ...asset,
              display_name: await getDisplayName(
                asset.base_denom,
                useStore().getters[GlobalGetterTypes.API.getDexChain],
              ),
              ticker: await getTicker(asset.base_denom, useStore().getters[GlobalGetterTypes.API.getDexChain]),
            };
          }),
        ),
      ];

      if (props.otherAssets.length > 0) {
        displayNameAddedOtherList.value = [
          await Promise.all(
            props.otherAssets.map(async (asset) => {
              return {
                ...asset,
                display_name: await getDisplayName(
                  asset.base_denom,
                  useStore().getters[GlobalGetterTypes.API.getDexChain],
                ),
                ticker: await getTicker(asset.base_denom, useStore().getters[GlobalGetterTypes.API.getDexChain]),
              };
            }),
          ),
        ];
      }
    } else {
      return [];
    }
  },
  { immediate: true },
);

const displaySelectedPair = ref('');
watch(
  () => props.counterDenom?.base_denom,
  async () => {
    if (props.counterDenom?.base_denom) {
      displaySelectedPair.value = await getDisplayName(
        props.counterDenom.base_denom,
        useStore().getters[GlobalGetterTypes.API.getDexChain],
      );
    }
  },
  { immediate: true },
);

const keywordFilteredAssets = computed(() => {
  const filteredAssets = (displayNameAddedList.value[0] ?? []).filter((asset) => {
    return (
      asset.display_name?.toLowerCase().indexOf(keyword.value.toLowerCase()) !== -1 ||
      asset.ticker?.toLowerCase().indexOf(keyword.value.toLowerCase()) !== -1
    );
  });
  const filteredOtherAssets = (displayNameAddedOtherList.value[0] ?? []).filter((asset) => {
    return (
      asset.display_name?.toLowerCase().indexOf(keyword.value.toLowerCase()) !== -1 ||
      asset.ticker?.toLowerCase().indexOf(keyword.value.toLowerCase()) !== -1
    );
  });

  return [filteredAssets, filteredOtherAssets];
});

function coinListselectHandler(payload) {
  if (props.title === 'Receive') {
    payload.type = props.title;
    emit('select', payload);
  } else {
    selectedDenom.value = payload.base_denom;

    if (props.assets.filter((asset) => asset.base_denom === payload.base_denom).length > 1) {
      chainSelectModalData.value = props.assets;
      toggleChainSelectModal();
      return;
    } else if (
      props.otherAssets.length > 0 &&
      props.otherAssets.filter((asset) => asset.base_denom === payload.base_denom).length > 1
    ) {
      chainSelectModalData.value = props.otherAssets;
      toggleChainSelectModal();
      return;
    }

    emit('select', payload);
  }
}

function chainSelectHandler(payload) {
  emit('select', payload);
  toggleChainSelectModal();
}

function toggleChainSelectModal() {
  isModalOpen.value = !isModalOpen.value;
  keyword.value = '';
}
</script>

<style lang="scss" scoped>
.scroll-container {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }

  .other-assets {
    &__title {
      padding-top: 1.5rem;
      color: var(--text);
    }

    &__subtitle {
      padding-bottom: 0.5rem;
      color: var(--muted);
    }
  }
}
</style>
