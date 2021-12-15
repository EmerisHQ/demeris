<template>
  <div
    v-if="isHubDown"
    class="bg-negative text-text -text-1 flex items-center justify-center space-x-2 h-10 fixed w-full top-0 z-50"
  >
    <span>
      <Icon name="BanIcon" :icon-size="1.0" />
    </span>

    <span class="font-bold">
      <i18n-t keypath="components.chainDown.appearsDown">
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

<script lang="ts">
import { computed, defineComponent } from '@vue/runtime-core';
import { useStore } from 'vuex';

import ChainName from '@/components/common/ChainName.vue';
import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  components: {
    ChainName,
    Icon,
  },

  setup() {
    const store = useStore();

    const dexChain = store.getters['demeris/getDexChain'];

    const isHubDown = computed(() => {
      const status =
        store.getters['demeris/getChainStatus']({ chain_name: dexChain }) || window.location.pathname === '/simplex';
      return status === false;
    });

    return { dexChain, isHubDown };
  },
});
</script>
