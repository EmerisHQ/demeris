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
      <!--Displays a denom selection component:
				input field (search box)
				denom badge
				denom name
				denom chain name
				denom balance  (uses ./Amount.vue)
				denom balance in preferred currency equivalent (uses ./Amount.vue)
			  Props:
					denoms: [] of denoms
					disabled: [] of denoms to display as disabled (fro parent DenomSelect.vue)
				Dependencies:
					vuex getter to get  chain name from chain id
					vuex getter to get  base_denom -> currency pricing
					vuex getter to get balance for denom (idf any-->
      <TitleWithGoback :title="title" :func="func" />

      <div class="search-bar">
        <Search v-model:keyword="keyword" />
      </div>
      <div class="coin-list">
        <CoinList
          :data="filterKeyword(assets, keyword)"
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
import { defineComponent, ref } from 'vue';

import ChainSelectModal from '@/components/common/ChainSelectModal.vue';
import CoinList from '@/components/common/CoinList.vue';
import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import Search from '@/components/common/Search.vue';
import WhiteOverlay from '@/components/common/WhiteOverlay.vue';
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

    function coinListselectHandler(payload) {
      if (props.title === 'Receive') {
        payload.type = props.title;
        emit('select', payload);
      } else {
        selectedDenom.value = payload.base_denom;
        toggleChainSelectModal();
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

    function filterKeyword(assets, keyword) {
      const filteredAssets = assets.filter((asset) => {
        return asset.display_name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
      });
      return filteredAssets;
    }

    return {
      isModalOpen,
      toggleChainSelectModal,
      coinListselectHandler,
      chainSelectHandler,
      keyword,
      filterKeyword,
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
