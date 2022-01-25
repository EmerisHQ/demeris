<template>
  <AppLayout>
    <div>Hello</div>
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import AppLayout from '@/layouts/AppLayout.vue';

export default defineComponent({
  name: 'Airdrops',
  components: { AppLayout },
  //   setup() {},
});
</script>
