<template>
  <AppLayout>
    <div class="home">
      <div>{{ $t('pages.chains.chains') }}</div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
export default {
  name: 'Chains',
  components: { AppLayout },
}
</script>
