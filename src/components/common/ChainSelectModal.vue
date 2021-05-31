<template>
  <div class="chain-select-wrapper elevation-card">
    <TitleWithGoback :title="title" :func="func" />

    <div class="coin-list">
      <CoinList :data="assets" :type="'chain'" @select="coinListselectHandler" />
    </div>
    <div class="white-front-shadow" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import CoinList from '@/components/common/CoinList.vue';
import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
export default defineComponent({
  name: 'DenomSelectModal',
  components: {
    TitleWithGoback,
    CoinList,
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
        alert('open chain select modal');
      }
    }

    console.log('assets', props);
    return { coinListselectHandler };
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

  background-color: var(--surface);
  z-index: 10;

  .sub-title {
    padding: 0 2.4rem 2.4rem;
  }

  .coin-list {
    padding: 0 1.6rem 0 2.4rem;
    height: 31.6rem;

    overflow-y: scroll;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }
}
</style>
