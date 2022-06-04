<template>
  <div class="get-desktop">
    <div class="flex flex-col py-8 px-8 text-center">
      <slot name="title">
        <h2 class="text-3 font-bold">{{ $t('wallet.connect.modal5.title') }}</h2>
      </slot>

      <div class="flex-1 mt-8 leading-copy text-muted space-y-4">
        <slot name="description">
          <p>{{ $t('wallet.connect.modal5.text') }}</p>
        </slot>
      </div>

      <div class="flex items-center flex-col mt-12">
        <Button :name="$t('wallet.connect.modal5.button')" class="connect-wallet__controls__button" @click="openUrl" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue';

const openUrl = () => {
  window.open('https://emeris.com');
};
</script>
