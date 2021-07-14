<template>
  <div class="denom-select-modal">
    <ChainSelectModal
      v-if="isModalOpen"
      :assets="assets"
      :title="'Select chain'"
      :func="toggleChainSelectModal"
      :selected-denom="selectedDenom"
      @select="chainSelectHandler"
    />
    <div v-else class="denom-select-modal-wrapper elevation-panel">
      <TitleWithGoback :title="title" :func="func" />

      <div class="search-bar">
        <Search v-model:keyword="keyword" />
      </div>
      <div class="coin-list">
        <CoinList
          :data="keywordFilteredAssets"
          :type="title === 'Receive' ? 'receive' : 'pay'"
          :show-balance="showBalance"
          :keyword="keyword"
          @select="coinListselectHandler"
        >
        </CoinList>
      </div>
      <WhiteOverlay />
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
.denom-select-modal-wrapper {
  position: absolute;
  width: 100%;
  height: 55.8rem;
  top: 0;
  left: 0;

  overflow: hidden;

  background-color: var(--surface);
  z-index: 10;

  .search-bar {
    padding: 0 2.4rem 2.4rem;
  }

  .coin-list {
    padding: 0 1.6rem 0 2.4rem;
    height: 37.8rem;

    overflow-y: scroll;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }
}
</style>
