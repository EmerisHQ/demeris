<template>
  <div class="mt-8 flex justify-between bg-fg rounded-2xl relative cursor-pointer" @click="goToLink">
    <div class="p-6">
      <p class="-text-1 mb-1 text-muted">{{ $t('context.airdrops.airdropsInfo.title') }}</p>
      <p class="font-medium">{{ $t('context.airdrops.airdropsInfo.question') }}</p>
    </div>

    <img
      src="@/assets/images/what-is-airdrop-bg.png"
      alt="What is an airdrop"
      class="absolute right-0 rounded-2xl h-full"
    />
  </div>
</template>

<script setup lang="ts">
const goToLink = () => {
  window.open('https://support.emeris.com/en/articles/6099301-airdrop-tracker-page-step-by-step-tutorial', '_blank');
};
</script>
