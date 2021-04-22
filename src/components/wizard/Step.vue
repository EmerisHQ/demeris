<template>
	<div>
		<!-- Displays a single step		

		Uses ./Step.vue
		props:
		 step: StepObject
		generates array of Transactions to complete the step (uses StepTransaction.vue)
		pending,active,completed states
		emits started, active-step-index , completed etc. as it progressees

		-->
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Step'
})
</script>