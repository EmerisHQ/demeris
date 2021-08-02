<template>
  <div class="flex">
    <ChainSelectModal
      v-if="isModalOpen"
      :assets="assets"
      :title="'Select chain'"
      :func="toggleChainSelectModal"
      :selected-denom="selectedDenom"
      :asset-action="assetAction"
      @select="chainSelectHandler"
    />
    <div v-else class="denom-select-modal-wrapper w-full h-full flex-1 flex flex-col items-stretch">
      <header class="w-full max-w-7xl mx-auto px-2">
        <TitleWithGoback :title="title" :func="func" :show-back-button="showBackButton" />
      </header>

      <div class="relative flex-1 min-h-0 flex flex-col">
        <Search v-model:keyword="keyword" class="w-full mx-auto max-w-md px-6 pb-3" />
        <div class="scroll-container overflow-y-auto flex-grow min-h-0 pt-1">
          <div class="mx-auto max-w-md mb-20">
            <CoinList
              :data="keywordFilteredAssets"
              :type="title === 'Receive' ? 'receive' : 'pay'"
              :show-balance="showBalance"
              :keyword="keyword"
              @select="coinListselectHandler"
            />
          </div>
        </div>
        <WhiteOverlay />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';

import ChainSelectModal from '@/components/common/ChainSelectModal.vue';
import CoinList from '@/components/common/CoinList.vue';
import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import Search from '@/components/common/Search.vue';
import WhiteOverlay from '@/components/common/WhiteOverlay.vue';
import { store } from '@/store';
import { getDisplayName } from '@/utils/actionHandler';
export default defineComponent({
  name: 'DenomSelectModal',
  components: {
    TitleWithGoback,
    ChainSelectModal,
    Search,
    CoinList,
    WhiteOverlay,
  },
  props: {
    assets: { type: Object, required: true },
    func: { type: Function, default: () => void 0 },
    title: { type: String, required: true },
    showBalance: { type: Boolean, default: false },
    showBackButton: { type: Boolean, required: false, default: true },
    assetAction: { type: String, required: true, default: 'use' },
  },
  emits: ['select'],
  setup(props, { emit }) {
    const isModalOpen = ref(false);
    const keyword = ref('');
    const selectedDenom = ref(null);

    const displayNameAddedList = ref([]);
    watch(
      () => props.assets,
      async () => {
        if (props.assets.length) {
          displayNameAddedList.value = [
            await Promise.all(
              props.assets.map(async (asset) => {
                return {
                  ...asset,
                  display_name: await getDisplayName(asset.base_denom, store.getters['demeris/getDexChain']),
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
      const filteredAssets = (displayNameAddedList.value[0] ?? []).filter((asset) => {
        return asset.display_name?.toLowerCase().indexOf(keyword.value.toLowerCase()) !== -1;
      });

      return filteredAssets;
    });

    function coinListselectHandler(payload) {
      if (props.title === 'Receive') {
        payload.type = props.title;
        emit('select', payload);
      } else {
        selectedDenom.value = payload.base_denom;

        if (props.assets.filter((asset) => asset.base_denom === payload.base_denom).length > 1) {
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

    return {
      isModalOpen,
      toggleChainSelectModal,
      coinListselectHandler,
      chainSelectHandler,
      keyword,
      keywordFilteredAssets,
      displayNameAddedList,
      selectedDenom,
    };
  },
});
</script>

<style lang="scss" scoped>
.scroll-container {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
}
</style>
