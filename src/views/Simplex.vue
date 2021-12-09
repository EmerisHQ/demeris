<template>
  <div class="form-container">
    <Brandmark class="mb-5" />
    <form id="simplex-form">
      <div id="checkout-element"></div>
    </form>
  </div>
</template>

<script lang="ts">
import { onMounted } from '@vue/runtime-core';

import Brandmark from '@/components/common/Brandmark.vue';

export default {
  name: 'Simplex',
  components: { Brandmark },

  setup() {
    onMounted(() => {
      if (!document.getElementById('simplex-exists')) {
        let simplexScript = document.createElement('script');
        simplexScript.id = 'simplex-exists';
        // simplexScript.onload = () => {
        // window.simplexAsyncFunction = function () {
        //     Simplex.init({public_key: '<partner_public_key>'})
        // };
        // }
        let simplexFunction = document.createTextNode(`window.simplexAsyncFunction = function () {
            Simplex.init({public_key: '<partner_public_key>'})
        };`);
        simplexScript.appendChild(simplexFunction);
        document.head.appendChild(simplexScript);

        let simplexCDNScript = document.createElement('script');
        simplexCDNScript.setAttribute('src', 'https://cdn.test-simplexcc.com/sdk/v1/js/sdk.js');
        document.head.appendChild(simplexCDNScript);

        let simplexIframeScript = document.createElement('script');
        simplexIframeScript.setAttribute('src', 'https://iframe.sandbox.test-simplexcc.com/form-sdk.js');
        document.body.appendChild(simplexIframeScript);

        simplexIframeScript.onload = () => {
          window.simplex.createForm();
        };

        let styleTag = document.createElement('style');
        styleTag.id = 'simplex-css';
        let cssStyles =
          document.createTextNode(`.simplex-form{} .simplex-continue-button {background: #000000 !important;
      border-radius: 10px !important; color: #fff !important;} .simplex-continue-button:hover {transform: translateY(-1px)} .simplex-dd { color: #fff !important; background: #000 !important; border-radius: 10px !important; border: 0px !important; margin-left: 7px !important;}
      .form-control { border-radius: 10px !important;} .simplex-input {border: 1px solid #ced4da !important;}
      `);

        styleTag.appendChild(cssStyles);
        document.head.appendChild(styleTag);

        // setTimeout(() => window.simplex.createForm(), 3000);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.form-container {
  margin: 15px;
}
</style>
