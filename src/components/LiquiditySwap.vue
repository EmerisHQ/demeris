<template>
  <div v-if="isDashBoard">dashboard page component</div>

  <div v-else>swap page component</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Swap',
  props: {
    isDashBoard: Boolean,
  },

  //   setup() {},
});
</script>