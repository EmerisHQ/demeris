<template>
  <div>
    <ChainSelectModal
      v-show="isModalOpen"
      :assets="assets"
      :title="'Select chain'"
      :func="toggleChainSelectModal"
      @select="chainSelectHandler"
    />
    <div v-show="!isModalOpen" class="denom-select-modal-wrapper elevation-panel">
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
          :type="title === 'Receive' ? 'chain' : 'amount'"
          @select="coinListselectHandler"
        />
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
    func: { type: Function, required: true },
    title: { type: String, required: true },
  },
  emits: ['select'],
  setup(props, { emit }) {
    function coinListselectHandler(payload) {
      if (props.title === 'Receive') {
        payload.type = props.title;
        emit('select', payload);
      } else {
        toggleChainSelectModal();
      }
    }

    function chainSelectHandler(payload) {
      emit('select', payload);
      toggleChainSelectModal();
    }

    const isModalOpen = ref(false);
    const keyword = ref('');

    function toggleChainSelectModal() {
      isModalOpen.value = !isModalOpen.value;
    }

    function filterKeyword(assets, keyword) {
      const filteredAssets = assets.filter((asset) => {
        return asset.base_denom.substr(1).indexOf(keyword) !== -1;
      });

      return filteredAssets;
    }

    console.log('assets', props);
    return { isModalOpen, toggleChainSelectModal, coinListselectHandler, chainSelectHandler, keyword, filterKeyword };
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
