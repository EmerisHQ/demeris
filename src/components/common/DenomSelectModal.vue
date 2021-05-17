<template>
  <div>
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
					vuex getter to get balance for denom (idf any
		-->
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'DenomSelectModal'
})
</script>