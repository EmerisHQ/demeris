<template>
  <div class=" w-full h-full m-0 p-0 z-50 text-text">
    <div class="mt-7 mb-24 flex justify-center">
      <img :src="logo" />
    </div>
    <div class="w-full mb-16 flex justify-center">
      <img :src="surfer" />
    </div>
    <div class="mb-48 w-full text-center flex justify-center">
      <div class="custom-width">
        <h1 class="font-bold text-3 mb-4">
          {{ $t('maintenance.title') }}
        </h1>
        <p class="text-text opacity-60">
          {{ $t('maintenance.subTitle') }}
        </p>
      </div>
    </div>
    <div class="w-full flex items-center flex justify-center text-link text-0 mb-32">
      <a class="mr-6 align-middle footer-link" href="https://t.me/EmerisHQ">
        <Icon class="text-text opacity-30 gray-icon mr-2" name="LinkIcon" :icon-size="0.813" />
        telegram&#8599;
      </a>
      <a class="mr-6 footer-link" href="https://twitter.com/emerisHQ">
        <Icon class="text-text opacity-30 gray-icon  mr-2" name="LinkIcon" :icon-size="0.813" /> 
        medium&#8599;
      </a>
      <a class="mr-6 footer-link" href="https://medium.com/emeris-blog">
        <Icon class="text-text opacity-30 gray-icon  mr-2" name="LinkIcon" :icon-size="0.813" /> 
        twitter&#8599;
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import logo from "@/assets/images/maintenance-logo.png"
import surfer from "@/assets/images/maintenance-surfer.png"
import Icon from '@/components/ui/Icon.vue';
</script>

<style>
.custom-width{
  width: 495px;
}
.footer-link{
 font-size: .813rem !important;
}
.gray-icon{
  display: inline-block !important;
}
</style>