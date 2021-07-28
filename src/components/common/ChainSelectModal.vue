<template>
  <div class="chain-select-wrapper bg-surface shadow-panel rounded-2xl">
    <TitleWithGoback :title="title" :func="func" :show-back-button="showBackButton" />

    <div class="mb-6 -text-1 text-center font-normal">
      <template v-if="showSubtitle">
        {{
          $t('components.chainSelect.text1', {
            asset: selectedDenomDisplay,
            chainNo: chainsNumber,
            chains: chainsNumber > 1 ? 'chains' : 'chain',
          })
        }}
        <br />
      </template>
      <slot name="description">
        {{ $t('components.chainSelect.text2') }}
      </slot>
    </div>

    <div class="coin-list">
      <CoinList :data="filterAsset(assets, selectedDenom)" :type="'chain'" @select="coinListselectHandler" />
    </div>
    <WhiteOverlay />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';

import CoinList from '@/components/common/CoinList.vue';
import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import WhiteOverlay from '@/components/common/WhiteOverlay.vue';
import { getDisplayName } from '@/utils/actionHandler';
export default defineComponent({
  name: 'DenomSelectModal',
  components: {
    TitleWithGoback,
    CoinList,
    WhiteOverlay,
  },
  props: {
    assets: { type: Object, required: true },
    func: { type: Function, required: true },
    title: { type: String, required: true },
    selectedDenom: { type: String, required: true },
<<<<<<< HEAD
    showSubtitle: { type: Boolean, default: true },
=======
    showBackButton: { type: Boolean, default: true },
>>>>>>> style: various layouts and ui details
  },
  emits: ['select'],
  setup(props, { emit }) {
    const selectedDenomDisplay = ref(props.selectedDenom);
    const chainsNumber = ref(0);
    const store = useStore();
    onMounted(async () => {
      selectedDenomDisplay.value = await getDisplayName(props.selectedDenom, store.getters['demeris/getDexChain']);
    });
    watch(
      () => props.selectedDenom,
      async (newName) => {
        selectedDenomDisplay.value = await getDisplayName(newName, store.getters['demeris/getDexChain']);
      },
    );
    function filterAsset(assets, keyword) {
      const filteredList = assets.filter((asset) => {
        return asset.base_denom == keyword;
      });

      chainsNumber.value = filteredList.length;

      return filteredList;
    }

    function coinListselectHandler(payload) {
      payload.type = props.title;
      emit('select', payload);
    }

    return { coinListselectHandler, filterAsset, chainsNumber, selectedDenomDisplay };
  },
});
</script>

<style lang="scss" scoped>
.chain-select-wrapper {
  position: absolute;
  width: 100%;
  height: 27rem;
  top: 0;
  left: 0;

  overflow: hidden;
  z-index: 10;

  .sub-title {
    padding: 0 1.5rem 1.5rem;
  }

  .coin-list {
    min-height: 17rem;

    overflow-y: scroll;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }
}
</style>
