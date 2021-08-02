<template>
  <div class="chain-select-wrapper w-full h-full flex-1 flex flex-col items-stretch">
    <header class="w-full max-w-7xl mx-auto px-2">
      <TitleWithGoback :title="title" :func="func" :show-back-button="showBackButton" />
    </header>

    <div class="relative flex-1 min-h-0 flex flex-col">
      <div class="w-full mx-auto max-w-sm px-6 mb-8 text-center text-muted">
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
    </div>

      <div class="scroll-container overflow-y-auto flex-grow min-h-0 pt-1">
        <div class="mx-auto max-w-md mb-20">
          <CoinList :data="filterAsset(assets, selectedDenom)" :type="'chain'" @select="coinListselectHandler" />
        </div>
      </div>
      <WhiteOverlay />
    </div>
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
    showSubtitle: { type: Boolean, default: true },
    showBackButton: { type: Boolean, default: true },
    assetAction: { type: String, required: true, default: 'use' },
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
.scroll-container {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
}
</style>
