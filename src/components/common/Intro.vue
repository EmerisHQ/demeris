<template>
  <div class="relative rounded-2xl dark:theme-inverse">
    <a href="https://medium.com/emeris-blog" target="_blank" rel="noopener noreferrer">
      <div class="absolute bottom-6 left-6 text-text">
        <p class="-text-1">Introductory guide</p>
      </div>
      <img class="w-auto block" src="@/assets/images/intro-panel.png" />
    </a>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Intro',
});
</script>
<style lang="scss" scoped></style>
