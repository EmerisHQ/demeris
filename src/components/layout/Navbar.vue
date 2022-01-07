<template>
  <nav class="flex-1 max-w-7xl md:mx-auto lg:pl-4 xl:px-6 flex items-center text-muted">
    <router-link
      class="h-12 py-3.5 px-2 md:px-3 leading-5 hover:text-text active:opacity-70"
      exact-active-class="text-text font-medium"
      to="/"
    >
      {{ $t('navbar.portfolio') }}
    </router-link>
    <router-link
      class="h-12 py-3.5 px-2 md:px-3 leading-5 hover:text-text active:opacity-70"
      exact-active-class="text-text font-medium"
      to="/assets"
    >
      {{ $t('navbar.assets') }}
    </router-link>
    <router-link
      class="h-12 py-3.5 px-2 md:px-3 leading-5 hover:text-text active:opacity-70"
      exact-active-class="text-text font-medium"
      to="/pools"
    >
      {{ $t('navbar.pools') }}
    </router-link>
  </nav>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Navbar',
});
</script>

<style scoped lang="scss">
.router-link-exact-active {
  color: var(--text);
}
</style>
