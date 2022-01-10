// v-show="isModalOpen"
<template>
  <Modal
    :open="isModalOpen"
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
      <!-- <div v-if="isReturn">Transaction completed.</div> -->
      <form id="simplex-form">
        <div id="checkout-element"></div>
      </form>
    </div>
  </Modal>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref, watch } from '@vue/runtime-core';

import Modal from '@/components/ui/Modal.vue';
import useEmitter from '@/composables/useEmitter';

export default {
  name: 'SimplexModal',
  components: { Modal },

  setup() {
    const emitter = useEmitter();
    const isModalOpen = ref(false);

    const toggleSimplexModal = () => {
      isModalOpen.value = !isModalOpen.value;
    };

    emitter.on('simplex', () => {
      toggleSimplexModal();
    });

    const goSimplex = () => {
      try {
        if (!document.getElementById('simplex-script')) {
          let simplexScript = document.createElement('script');
          simplexScript.id = 'simplex-script';
          let simplexFunction = document.createTextNode(`window.simplexAsyncFunction = function () {
            Simplex.init({public_key: 'pk_test_37a1ad27-8916-47a3-971a-b399b869b257'})
        };`);
          simplexScript?.appendChild(simplexFunction);
          document.head?.appendChild(simplexScript);

          let simplexCDNScript = document.createElement('script');
          simplexCDNScript.setAttribute('src', 'https://cdn.test-simplexcc.com/sdk/v1/js/sdk.js');
          simplexCDNScript.id = 'simplex-cdn-script';
          simplexCDNScript.async = true;
          document.head?.appendChild(simplexCDNScript);

          let simplexIframeScript = document.createElement('script');
          simplexIframeScript.setAttribute('src', 'https://iframe.sandbox.test-simplexcc.com/form-sdk.js');
          simplexIframeScript.id = 'simplex-iframe-script';
          document.body?.appendChild(simplexIframeScript);

          simplexIframeScript.onload = () => {
            let scriptTag = document.createElement('script');
            let createForm = document.createTextNode(`window.simplex.createForm();`);
            scriptTag.id = 'script';
            scriptTag?.appendChild(createForm);
            document.body?.appendChild(scriptTag);
          };

          let styleTag = document.createElement('style');
          styleTag.id = 'simplex-css';
          let cssStyles = document.createTextNode(`
          .simplex-form{} .simplex-continue-button {background: #000000 !important;
      border-radius: 10px !important; color: #fff !important;} .simplex-continue-button:hover {transform: translateY(-1px)} .simplex-dd { width: 80px !important; color: #fff !important; background: #000 !important; border-radius: 10px !important; border: 0px !important; margin-left: 7px !important;}
      .form-control { border-radius: 10px !important;} .simplex-input {border: 1px solid #ced4da !important;} .error-box {padding: 15px 30px !important;}
      `);

          styleTag?.appendChild(cssStyles);
          document.head?.appendChild(styleTag);
        }
        // console.log('gosimplex hit.. modaliopen: ', isModalOpen.value)
      } catch (e) {
        console.log('simplex: ', e);
      }
    };

    const deleteScripts = () => {
      for (let id of ['simplex-script', 'simplex-cdn-script', 'simplex-iframe-script', 'script']) {
        let element = document.getElementById(id);
        if (element) {
          //  console.log('script remove hit: ', element)
          element.remove();
        }
      }
    };

    watch(isModalOpen, (currentIsModalOpen) => {
      if (currentIsModalOpen) {
        goSimplex();
      } else {
        deleteScripts();
      }
    });

    onMounted(() => {
      if (isModalOpen.value) {
        goSimplex();
      }
    });

    onUnmounted(() => {
      deleteScripts();
    });
    return { isModalOpen, toggleSimplexModal };
  },
};
</script>

<style lang="scss">
.form-container {
  margin: 15px;
}
</style>
