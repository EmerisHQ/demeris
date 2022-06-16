<template>
  <Modal
    v-show="isModalOpen"
    variant="center"
    fullscreen
    :close-on-overlay-click="false"
    :show-close-button="true"
    max-width-class="max-w-sm"
    class="simplex-modal"
    @close="toggleSimplexModal"
  >
    <template #header>
      <h1 class="text-2 font-bold">{{ $t('components.simplexBanner.title', { asset: 'ATOM' }) }}</h1>
    </template>
    <div class="form-container">
      <div v-if="transactionStatus === 'success' || transactionStatus === 'failure'">
        {{ transactionCompletedText }}
      </div>
      <form v-else id="simplex-form">
        <div id="checkout-element"></div>
      </form>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import Modal from '@/components/ui/Modal.vue';
import useEmitter from '@/composables/useEmitter';
import { event } from '@/utils/analytics';

const emitter = useEmitter();
const { t } = useI18n({ useScope: 'global' });
const isModalOpen = ref(false);
const transactionStatus = ref('ongoing');
const toggleSimplexModal = () => {
  isModalOpen.value = !isModalOpen.value;
};
const setTransactionStatus = (status) => {
  transactionStatus.value = status;
  if (status === 'failure') {
    event('simplex_transaction', {
      event_label: 'Transaction with Simplex failure',
      event_category: 'Fiat Onramp',
    });
  } else if (status === 'success') {
    event('simplex_transaction', {
      event_label: 'Transaction with Simplex success',
      event_category: 'Fiat Onramp',
    });
  }
};
emitter.on('simplex', () => {
  toggleSimplexModal();
});

const transactionCompletedText = computed(() => {
  if (transactionStatus.value === 'success') {
    return t('components.simplex.transactionSuccessful');
  } else {
    return t('components.simplex.transactionFailed');
  }
});
const goSimplex = () => {
  try {
    if (!document.getElementById('simplex-iframe-script')) {
      (window as any).simplexAsyncFunction = function () {
        (window as any)?.Simplex?.init({ public_key: 'pk_live_450069ac-11e8-46bc-b1a9-73b7e812d113' });
      };
      const simplexCDNScript = document.createElement('script');
      simplexCDNScript.setAttribute('src', 'https://cdn.simplex.com/sdk/v1/js/sdk.js');
      simplexCDNScript.id = 'simplex-cdn-script';
      simplexCDNScript.async = true;
      document.head?.appendChild(simplexCDNScript);

      const simplexIframeScript = document.createElement('script');
      simplexIframeScript.setAttribute('src', 'https://iframe.simplex-affiliates.com/form-sdk.js');
      simplexIframeScript.type = 'text/javascript';
      simplexIframeScript.id = 'simplex-iframe-script';
      document.body?.appendChild(simplexIframeScript);

      simplexIframeScript.onload = () => {
        (window as any)?.simplex?.createForm();
        setTimeout(
          () =>
            (window as any).Simplex.subscribe('onlineFlowFinished', function (event) {
              setTransactionStatus(event.payload.result);
            }),
          1500,
        );
      };

      const simplexTrackingScript = document.createElement('script');
      simplexTrackingScript.setAttribute('src', 'https://checkout.simplexcc.com/splx.js');
      simplexTrackingScript.id = 'simplex-tracking-script';
      document.body?.appendChild(simplexTrackingScript);

      const styleTag = document.createElement('style');
      styleTag.id = 'simplex-css';
      const cssStyles = document.createTextNode(`
        .simplex-form{} .simplex-continue-button {background: #000000 !important;
        border-radius: 10px !important; color: #fff !important;} .simplex-continue-button:hover {transform: translateY(-1px)} .simplex-dd { width: 80px !important; color: #fff !important; background: #000 !important; border-radius: 10px !important; border: 0px !important; margin-left: 7px !important;}
        .form-control { border-radius: 10px !important;} .simplex-input {border: 1px solid #ced4da !important;} .error-box {padding: 15px 30px !important;}
      `);
      styleTag?.appendChild(cssStyles);
      document.head?.appendChild(styleTag);
    }
  } catch (e) {
    console.error('simplex: ', e);
  }
};

// const unloadCheckout = () => {
//   (window as any)?.Simplex?.unload((event) => console.log(event))
// }

watch(isModalOpen, (currentIsModalOpen) => {
  if (currentIsModalOpen) {
    goSimplex();
  }
});
</script>

<style lang="scss">
.form-container {
  padding: 15px;
  background: white;
  border-top: outset;
  color: black;
  min-height: 350px;
}
.error-box {
  font-family: inherit !important;
  width: 100% !important;
}
</style>
