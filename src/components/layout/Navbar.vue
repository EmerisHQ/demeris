<template>
  <nav class="nav ml-4 flex items-center text-muted">
    <router-link
      class="nav-link h-12 py-4 px-3 leading-none hover:text-text"
      exact-active-class="text-text font-medium"
      to="/"
    >
      {{ $t('navbar.portfolio') }}
    </router-link>
    <router-link
      class="nav-link h-12 py-4 px-3 leading-none hover:text-text"
      exact-active-class="text-text font-medium"
      to="/assets"
    >
      {{ $t('navbar.assets') }}
    </router-link>
    <router-link
      class="nav-link h-12 py-4 px-3 leading-none hover:text-text"
      exact-active-class="text-text font-medium"
      to="/pools"
    >
      {{ $t('navbar.pools') }}
    </router-link>
    <div class="space"></div>
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
