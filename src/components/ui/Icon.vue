<template>
  <div>
    <!-- Displays an icon
		props: 
		  type: string (the icon to display)
		//-->
    <img src="../../assets/svg/ThreeDotsIcon.svg" alt="my-logo" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Icon',
});
</script>