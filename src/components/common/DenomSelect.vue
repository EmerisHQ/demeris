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
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'DenomSelect'
})
</script>