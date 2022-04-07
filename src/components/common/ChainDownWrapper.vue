<template>
  <div
    v-if="isHubDown"
    class="bg-negative text-text -text-1 flex items-center justify-center space-x-2 h-10 fixed w-full top-0 z-50"
  >
    <span>
      <Icon name="BanIcon" :icon-size="1.0" />
    </span>

    <span class="font-bold">
      <i18n-t scope="global" keypath="components.chainDown.appearsDown">
        <template #chain>
          <ChainName :name="dexChain" />
        </template>
      </i18n-t>
    </span>

    <span>{{ $t('components.chainDown.assetsUnavailable') }}</span>
  </div>
  <div :class="{ 'mt-10': isHubDown }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/runtime-core';
import { useStore } from 'vuex';

import ChainName from '@/components/common/ChainName.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';

const typedstore = useStore() as RootStoreTyped;

const dexChain = typedstore.getters[GlobalGetterTypes.API.getDexChain];

const isHubDown = computed(() => {
  const status = typedstore.getters[GlobalGetterTypes.API.getChainStatus]({ chain_name: dexChain });
  return status === false;
});
</script>
