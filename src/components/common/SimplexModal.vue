<template>
  <Modal
    v-show="isModalOpen"
    variant="center"
    fullscreen
    :close-on-overlay-click="true"
    max-width-class="max-w-sm"
    class="simplex-modal"
    @close="toggleSimplexModal"
  >
    <div class="form-container">
      <!-- <h3 class="text-3 font-bold">
        {{ $t('components.simplexBanner.title', { asset: 'ATOM' }) }}
      </h3> -->
      <div v-if="isReturn">Transaction completed.</div>
      <form v-else id="simplex-form">
        <div id="checkout-element"></div>
      </form>
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, onMounted, ref } from '@vue/runtime-core';
import { useRoute } from 'vue-router';

import Modal from '@/components/ui/Modal.vue';
import useEmitter from '@/composables/useEmitter';

export default {
  name: 'SimplexModal',
  components: { Modal },

  setup() {
    const route = useRoute();
    const isReturn = computed(() => route.query?.isReturn as string);
    const emitter = useEmitter();
    const isModalOpen = ref(false);

    const toggleSimplexModal = () => {
      isModalOpen.value = !isModalOpen.value;
    };

    emitter.on('simplex', () => {
      toggleSimplexModal();
    });

    onMounted(() => {
      try {
        if (!document.getElementById('simplex-exists') || !isReturn.value) {
          let simplexScript = document.createElement('script');
          simplexScript.id = 'simplex-exists';
          let simplexFunction = document.createTextNode(`window.simplexAsyncFunction = function () {
            Simplex.init({public_key: 'pk_test_37a1ad27-8916-47a3-971a-b399b869b257'})
        };`);
          simplexScript?.appendChild(simplexFunction);
          document.head?.appendChild(simplexScript);

          let simplexCDNScript = document.createElement('script');
          simplexCDNScript.setAttribute('src', 'https://cdn.test-simplexcc.com/sdk/v1/js/sdk.js');
          simplexCDNScript.async = true;
          document.head?.appendChild(simplexCDNScript);

          let simplexIframeScript = document.createElement('script');
          simplexIframeScript.setAttribute('src', 'https://iframe.sandbox.test-simplexcc.com/form-sdk.js');
          document.body?.appendChild(simplexIframeScript);

          simplexIframeScript.onload = () => {
            let scriptTag = document.createElement('script');
            let createForm = document.createTextNode(`window.simplex.createForm();`);
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
      } catch (e) {
        console.log('simplex', e);
      }
    });
    return { isModalOpen, isReturn, toggleSimplexModal };
  },
};
</script>

<style lang="scss">
.form-container {
  margin: 15px;
}
</style>
