<template>
  <div class="chain-select-wrapper elevation-panel">
    <TitleWithGoback :title="title" :func="func" />

    <div class="chain-info s-minus w-normal">
      You have {{ $filters.getCoinName(selectedDenom) }} on {{ chainsNumber }}
      {{ chainsNumber > 1 ? 'chains' : 'chain' }}.
      <br />
      Select the chain you wish to swap from.
    </div>

    <div class="coin-list">
      <CoinList :data="filterAsset(assets, selectedDenom)" :type="'chain'" @select="coinListselectHandler" />
    </div>
    <WhiteOverlay />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

import CoinList from '@/components/common/CoinList.vue';
import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import WhiteOverlay from '@/components/common/WhiteOverlay.vue';
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
  },
  emits: ['select'],
  setup(props, { emit }) {
    const chainsNumber = ref(0);
    function filterAsset(assets, keyword) {
      const filteredList = assets.filter((asset) => {
        return asset.base_denom.substr(1).indexOf(keyword.substr(1).toLowerCase()) !== -1;
      });

      chainsNumber.value = filteredList.length;

      return filteredList;
    }

    function coinListselectHandler(payload) {
      payload.type = props.title;
      emit('select', payload);
    }

    console.log('assets', props);
    return { coinListselectHandler, filterAsset, chainsNumber };
  },
});
</script>

<style lang="scss" scoped>
.chain-select-wrapper {
  position: absolute;
  width: 100%;
  height: 42.8rem;
  top: 0;
  left: 0;

  overflow: hidden;

  background-color: var(--surface);
  z-index: 10;

  .chain-info {
    text-align: center;
    margin-bottom: 2.4rem;
  }

  .sub-title {
    padding: 0 2.4rem 2.4rem;
  }

  .coin-list {
    padding: 0 1.6rem 0 2.4rem;
    height: 26.8rem;

    overflow-y: scroll;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }
}
</style>
