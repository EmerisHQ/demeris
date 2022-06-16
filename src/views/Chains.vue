<template>
  <AppLayout>
    <div class="home">
      <div>{{ $t('pages.chains.chains') }}</div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue';
export default {
  name: 'Chains',
  components: { AppLayout },
};
</script>
