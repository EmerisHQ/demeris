<template>
  <div>
    <!--Displays a denom selection component:
				Selected denom badge
				Selected denom name
				Selected chain name
				arrow to display full list in modal (DenomSelectModal.vue)
			  Props: 
					denoms: [] of denoms
					disabled: [] of denoms to display as disabled
				Dependencies: 
					vuex getter to get  chain name from chain id		

		-->
    {{ chains }}
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'DenomSelect',
  setup() {
    const store = useStore();
    const chains = computed(() => store.getters.getChain);
    console.log(chains);
    console.log(store.state.demeris.chains);
    return { chains };
  },
});
</script>