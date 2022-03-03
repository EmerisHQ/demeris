<template>
  <a
    href="https://medium.com/emeris-blog"
    target="_blank"
    rel="noopener noreferrer"
    class="intro-panel w-full flex flex-col items-stretch p-6 relative rounded-2xl dark:theme-inverse bg-cover transform hover:-translate-y-px active:transform-none active:opacity-70 transition text-text"
  >
    <h5 class="font-medium">{{ $t('components.intro.welcomeTo') }}</h5>
    <LogoWordmark class="w-32 h-auto mt-1.5" alt="Emeris" />
    <p class="-text-1 mt-16">{{ $t('components.intro.introductoryGuide') }}</p>
  </a>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import LogoWordmark from '@/components/common/LogoWordmark.vue';

export default defineComponent({
  name: 'Intro',
  components: {
    LogoWordmark,
  },
});
</script>
<style lang="scss" scoped>
.intro-panel {
  background-image: url('~@/assets/images/intro-panel.jpg');
}
</style>
