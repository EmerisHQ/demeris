<template>
  <div v-if="validPool && pool">
    <p class="-text-1 font-normal text-muted">
      LP <Ticker :name="pool.reserve_coin_denoms[0]" /> &middot; <Ticker :name="pool.reserve_coin_denoms[1]" />
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useStore } from 'vuex';

import Ticker from '@/components/common/Ticker.vue';
import usePools from '@/composables/usePools';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';

interface Props {
  name?: string;
}

const props = withDefaults(defineProps<Props>(), { name: '' });

const store = useStore() as RootStoreTyped;
const propsRef = toRefs(props);
const verifiedDenoms = computed(() => {
  return store.getters[GlobalGetterTypes.API.getVerifiedDenoms] ?? [];
});
const validPool = computed(() => {
  return verifiedDenoms.value.find((x) => x.name == propsRef.name.value) ?? false;
});
const { pools } = usePools();
const pool = computed(() => {
  return pools.value?.find((x) => x.pool_coin_denom == propsRef.name.value);
});
</script>
<style lang="scss" scoped></style>
