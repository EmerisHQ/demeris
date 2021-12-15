<template>
  <div class="logo flex items-center h-auto" data-cy="navbar-logo">
    <Brandmark class="block w-12 h-12 transition-transform duration-300" />
    <div class="bg-fg ml-2 py-1 px-2 rounded-full text-muted -text-2 text-center">Beta</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Brandmark from '../common/Brandmark.vue';

export default defineComponent({
  name: 'NavbarLogo',
  components: {
    Brandmark,
  },
});
</script>

<style scoped lang="scss">
.logo:hover svg {
  transform: scale(1.08);
}
</style>
