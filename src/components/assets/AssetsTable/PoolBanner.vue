<template>
  <Alert v-if="pool" status="info" class="mt-4" size="md" :show-icon="false">
    <h5 class="font-bold text-text">
      <i18n-t scope="global" keypath="components.poolBanner.title">
        <template #denom>
          <Denom :name="name" />
        </template>
      </i18n-t>
    </h5>
    <p class="mt-3 text-muted -text-1 leading-copy">
      <i18n-t scope="global" keypath="components.poolBanner.body">
        <template #denom>
          <Denom :name="name" />
        </template>
        <template #ticker>
          <Ticker :name="name" />
        </template>
        <template #pairName>
          <strong>{{ pairName }}</strong>
        </template>
      </i18n-t>
    </p>
    <p class="mt-3">
      <a
        class="font-medium cursor-pointer text-link hover:text-link-hover active:opacity-70 transition"
        href="#"
        @click="openPoolPage"
      >
        {{ $t('components.poolBanner.viewPool') }} &rarr;</a
      >
    </p>
  </Alert>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import Denom from '@/components/common/Denom.vue';
import Ticker from '@/components/common/Ticker.vue';
import Alert from '@/components/ui/Alert.vue';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';

interface Props {
  name?: string;
}

const props = withDefaults(defineProps<Props>(), { name: '' });

const router = useRouter();

const { pools } = usePools();

const pool = computed(() => {
  return pools.value?.find((pool) => pool.pool_coin_denom == props.name);
});

const { pairName } = usePool(
  computed(() => {
    return (pool.value?.id as string) ?? '';
  }),
);

const openPoolPage = () => {
  router.push({ name: 'Pool', params: { id: pool.value.id } });
};
</script>
