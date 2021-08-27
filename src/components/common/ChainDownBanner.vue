<template>
  <div v-if="currentDownChain" class="bg-negative text-text -text-1 flex items-center justify-center space-x-2 h-10">
    <span>
      <Icon name="BanIcon" :icon-size="1.0" />
    </span>

    <span class="font-bold">
      <i18n-t keypath="components.chainDown.appearsDown">
        <template #chain>
          <ChainName :name="currentDownChain.chain_name" />
        </template>
      </i18n-t>
    </span>

    <span>{{ $t('components.chainDown.assetsUnavailable') }}</span>
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

    const currentDownChain = computed(() => {
      const chains = store.getters['demeris/getChains'] || {};

      for (const chain of Object.values(chains)) {
        const status = store.getters['demeris/getChainStatus'](chain);
        if (!status) {
          return chain;
        }
      }

      return undefined;
    });

    return { currentDownChain };
  },
});
</script>
