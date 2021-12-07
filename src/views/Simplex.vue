<template>
  <!-- <div id="simplex-form"></div> -->
  <form id="simplex-form">
    <div id="checkout-element"></div>
  </form>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';

import AssetsTable from '@/components/assets/AssetsTable';
import AppLayout from '@/layouts/AppLayout.vue';
import { pageview } from '@/utils/analytics';

export default {
  name: 'Simplex',
  //   components: { AppLayout, AssetsTable },

  setup() {
    const { t } = useI18n({ useScope: 'global' });

    onMounted(() => {
      let simplexScript = document.createElement('script');
      let tn = document.createTextNode(`window.simplexAsyncFunction = function () {
            Simplex.init({public_key: '<partner_public_key>'})
        };`);
      simplexScript.appendChild(tn);
      document.head.appendChild(simplexScript);

      let simplexCDNScript = document.createElement('script');
      simplexCDNScript.setAttribute('src', 'https://cdn.test-simplexcc.com/sdk/v1/js/sdk.js');
      document.head.appendChild(simplexCDNScript);

      document.head.insertAdjacentHTML('beforeend', `<style>body{background:red}</style>`);

      let simplexIframeScript = document.createElement('script');
      simplexIframeScript.setAttribute('src', 'https://iframe.sandbox.test-simplexcc.com/form-sdk.js');
      document.body.appendChild(simplexIframeScript);

      setTimeout(() => window.simplex.createForm(), 3000);
      // window.simplex.createForm()
    });

    useMeta(
      computed(() => ({
        title: t('context.assets.title'),
      })),
    );

    const router = useRouter();
    pageview({ page_title: 'Assets', page_path: '/assets' });
    const openAssetPage = (asset: Record<string, string>) => {
      router.push({ name: 'Asset', params: { denom: asset.denom } });
    };

    return { openAssetPage };
  },
};
</script>

<style lang="scss" scoped>
.simplex-continue-button {
  background-color: green !important;
}

.simplex-dd {
  background: red;
}
</style>
