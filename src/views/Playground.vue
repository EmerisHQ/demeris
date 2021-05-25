<template>
  <AppLayout>
    <div class="home">
      <div class="bg-white">
        <div class="p-10 flex flex-col space-y-8 w-72 mx-auto">
          <AssetChainsIndicator :balances="balances" denom="stake" :max-chains-count="4" />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import AssetChainsIndicator from '@/components/common/AssetChainsIndicator';
import AppLayout from '@/layouts/AppLayout.vue';
import { useStore } from '@/store';

export default defineComponent({
  components: {
    AssetChainsIndicator,
    AppLayout,
  },
  setup() {
    const store = useStore();

    const balances = computed(() =>
      store.getters['demeris/getBalances']({ address: store.getters['demeris/getKeplrAddress'] }),
    );

    return {
      balances,
    };
  },
});
</script>
