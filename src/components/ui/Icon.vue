<template>
  <div>
    <!-- Displays an icon
		props: 
		  type: string (the icon to display)
		//-->
    <img :src="require(`@/assets/svg/${icon_name}.svg`)" alt="my-logo" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Icon',
  props: {
    icon_name: {
      type: String,
      required: true,
    },
  },
});
</script>