<script lang="ts">
/* eslint-disable vue/no-static-inline-styles */
</script>
<template>
  <div class="w-full h-screen flex flex-col">
    <div class="flex justify-start mt-4 mb-8">
      <div class="logo flex items-center h-auto ml-8" data-cy="navbar-logo">
        <Brandmark class="block w-12 h-12 transition-transform duration-300" />
        <div class="bg-fg ml-2 py-1 px-2 rounded-full text-muted -text-2 text-center">Beta</div>
      </div>
    </div>
    <div class="w-full flex-1 pb-16">
      <div class="flex flex-col justify-center w-full h-full">
        <div class="mb-16 w-full text-center flex justify-center">
          <img v-if="!isBrowserDarkMode" :src="surfer" style="max-width: 577px" />
          <img v-else :src="surferDark" style="max-width: 577px" />
        </div>
        <div class="w-full text-center flex justify-center mb-8">
          <div style="max-width: 495px">
            <h1 class="font-bold text-3 mb-4">{{ $t('maintenance.title') }}</h1>
            <p class="text-text opacity-60">{{ $t('maintenance.subTitle') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex w-full items-center justify-center text-link h-32 pb-32">
      <Button
        v-for="{ url, label } in footerLinks"
        :key="url"
        size="sm"
        variant="link"
        :name="`${label}&#8599;`"
        class="mr-6 align-middle -text-1"
        @click="openURL(url)"
      >
        <Icon name="LinkIcon" class="text-text opacity-30 dark:opacity-1" :icon-size="0.813" />
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDark } from '@vueuse/core';
import { ref } from 'vue';

import surfer from '@/assets/images/maintenance-surfer.png';
import surferDark from '@/assets/images/maintenance-surfer-dark.png';
import Brandmark from '@/components/common/Brandmark.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
const isBrowserDarkMode = useDark();
const footerLinks = ref([
  { label: 'Telegram', url: 'https://t.me/EmerisHQ' },
  { label: 'Medium', url: 'https://medium.com/emeris-blog' },
  { label: 'Twitter', url: 'https://twitter.com/emerisHQ' },
  { label: 'Support', url: 'https://support.emeris.com' },
]);
function openURL(url) {
  window.open(url, '_blank', 'noopener');
}
</script>
