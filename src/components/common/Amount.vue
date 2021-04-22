<template>
	<div>
		<!--Displays an unstyled amount number.<template>
			  Props: 
					amount:number, 
					base_denom: string,
					currency_equivalent: boolean
				Will display either the raw amount or the $ equivalent depending on currency_equivalent (can be a global setting)
				On hover: tooltip displays both raw amount as well as currency equivalent
				Dependencies: 
					vuex getter to get base_denom -> currency pricing
					vuex getter to get user's preferred currency display
		-->
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Amount'
})
</script>