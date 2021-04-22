<template>
	<div>
		<!-- Generic wrapper for displaying preview of an action to be performed 
		displays: title, description
		a specific action preview (using components in ./previews)
		confirmation button
		props:
		 action: ActionObject (tbd)
		
		Confirmation button generates an array of steps to be executed in order which are passed as a prop to ./Steps.vue
		e
		-->
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Preview'
})
</script>