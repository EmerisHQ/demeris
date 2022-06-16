<template>
  <Modal
    v-show="isModalOpen"
    :open="isModalOpen"
    variant="center"
    fullscreen
    :show-close-button="true"
    :close-on-overlay-click="false"
    max-width-class="max-w-sm"
    @close="toggleMoonpayModal"
  >
    <template #header>
      <h1 class="text-2 font-bold">{{ $t('components.moonpayBanner.title', { asset: 'ATOM' }) }}</h1>
    </template>
    <iframe
      allow="accelerometer; autoplay; camera; gyroscope; payment"
      width="100%"
      class="moonpay-iframe"
      frameborder="0"
      :src="mpUrl"
    >
    </iframe>
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import Modal from '@/components/ui/Modal.vue';
import useEmitter from '@/composables/useEmitter';

const emitter = useEmitter();
const isModalOpen = ref(false);
const mpDomain = ref('https://buy.moonpay.io');
const mpParams = computed(() => {
  return {
    apiKey: 'pk_live_C5H29zimSfFDzncZqYM4lQjuqZp2NNke',
    currencyCode: 'atom',
    baseCurrencyCode: 'usd',
    // colorCode: '#FFFFFF'
    // baseCurrencyAmount: '50',
  };
});
const mpQuery = computed(() => {
  return new URLSearchParams(mpParams.value).toString();
});
const mpUrl = computed(() => {
  return mpDomain.value + '/?' + mpQuery.value;
});
const toggleMoonpayModal = () => {
  isModalOpen.value = !isModalOpen.value;
};
emitter.on('moonpay', () => {
  toggleMoonpayModal();
});
</script>

<style lang="scss">
.moonpay-iframe {
  min-height: 450px;
  border-top: outset;
}
</style>
