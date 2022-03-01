<template>
  <div class="w-full h-screen flex flex-col">
    <div class="flex justify-center mt-7 mb-8">
      <img v-if="!isBrowserDarkMode" :src="logo" />
      <img v-else :src="logoDark" />
    </div>
    <div class="w-full flex-1 pb-16">
      <div class="flex flex-col justify-center w-full h-full">
        <div class="mb-16 w-full text-center flex justify-center">
          <img :src="surfer" />
        </div>
        <div class="w-full text-center flex justify-center mb-8">
          <div class="custom-width">
            <h1 class="font-bold text-3 mb-4">{{ $t('maintenance.title') }}</h1>
            <p class="text-text opacity-60">{{ $t('maintenance.subTitle') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex w-full items-center justify-center text-link h-32 pb-32">
      <a v-for="{url,label} in footerLinks" :key="url" class="mr-6 align-middle -text-1" :href="url">
        <span class="inline-flex">
          <Icon class="text-text opacity-30 mr-2 dark:opacity-1" name="LinkIcon" :icon-size="0.813" />
        </span>
        {{ label }}&#8599;
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDark } from '@vueuse/core'
import { ref }from 'vue'

import logo from "@/assets/images/maintenance-logo.png"
import logoDark from "@/assets/images/maintenance-logo-dark.png"
import surfer from "@/assets/images/maintenance-surfer.png"
import Icon from '@/components/ui/Icon.vue';

const isBrowserDarkMode = useDark()
const footerLinks = ref([
  { label: 'telegram', url: 'https://t.me/EmerisHQ' },
  { label: 'medium', url: 'https://medium.com/emeris-blog' },
  { label: 'twitter', url: 'https://twitter.com/emerisHQ' },
])
</script>

<style>
.custom-width{
  width: 495px;
}
</style>
