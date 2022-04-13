<template>
  <div class="receive relative flex flex-col w-full min-h-screen items-center">
    <header class="absolute w-full max-w-7xl mx-auto flex items-center justify-between py-6 px-8 h-24">
      <router-link to="/" class="ml-auto">
        <Button variant="link" :full-width="false">
          <Icon name="CloseIcon" :icon-size="1.5" />
        </Button>
      </router-link>
    </header>

    <main class="w-full max-w-7xl mx-auto md:pt-8 px-8 pb-0 flex-1 flex flex-col items-center overflow-hidden">
      <div class="-mt-9 h-full w-full max-w-md mx-auto">
        <DenomSelectModal
          :title="$t('pages.receive.select')"
          class="denom-select-modal h-full"
          type="receive"
          :assets="balances"
          :show-balance="true"
          :show-back-button="false"
          @select="assetSelectHandler"
        />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { EmerisAPI } from '@emeris/types';
import { reactive } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';
import orderBy from 'lodash.orderby';

import DenomSelectModal from '@/components/common/DenomSelectModal.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';

const { nativeBalances } = useAccount();

const balances = computed(() => {
  return orderBy(nativeBalances.value, (item) => (item.base_denom.startsWith('pool') ? 1 : -1));
});

const state = reactive({
  selectedAsset: undefined,
});

const assetSelectHandler = (asset: EmerisAPI.Balance) => {
  state.selectedAsset = asset;
};
</script>
