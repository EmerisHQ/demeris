<template>
  <div class="modal-wrapper elevation-card">
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
      <Search />
    </div>

    <div class="coin-list">
      <CoinList :data="assets" :type="title === 'Receive' ? 'chain' : 'amount'" @select="coinListselectHandler" />
    </div>
    <div class="white-front-shadow" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import CoinList from '@/components/common/CoinList.vue';
import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import Search from '@/components/common/Search.vue';
export default defineComponent({
  name: 'DenomSelectModal',
  components: {
    TitleWithGoback,
    Search,
    CoinList,
  },
  props: {
    assets: { type: Object, required: true },
    func: { type: Function, required: true },
    title: { type: String, required: true },
  },
  emits: ['select'],
  setup(props, {emit}) {
  
    function coinListselectHandler(payload) {
      if(props.title === 'Receive') {
        payload.type = props.title
        emit('select', payload)
      } else {
        alert('open chain select modal')
      }
    }

    console.log('assets', props);
    return { coinListselectHandler };
  },
});
</script>

<style lang="scss" scoped>
.modal-wrapper {
  position: absolute;
  width: 100%;
  height: 55.8rem;
  top: 0;
  left: 0;

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
