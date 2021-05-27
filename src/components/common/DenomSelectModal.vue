<template>
  <div class="modal-wrapper elevation-card">
    <TitleWithGoback :title="'Pay with'" :func="setSteps" />
    <div class="search-bar">
      <Search />
    </div>

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
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import Search from '@/components/common/Search.vue';
export default defineComponent({
  name: 'DenomSelectModal',
  components: {
    TitleWithGoback,
    Search,
  },
  setup() {
    function setSteps() {
      alert('test');
    }
    return { setSteps };
  },
});
</script>

<style lang="scss" scoped>
.modal-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  background-color: var(--surface);
  z-index: 10;

  .search-bar {
    padding: 0 2.4rem;
  }
}
</style>
