<template>
  <nav class="nav">
    <router-link class="nav-link" to="/">{{ $t('navbar.portfolio') }}</router-link>
    <router-link class="nav-link" to="/assets">{{ $t('navbar.assets') }}</router-link>
    <router-link class="nav-link" to="/pools">{{ $t('navbar.pools') }}</router-link>
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
.nav {
  display: flex;
  margin-left: 6rem;
  align-items: center;

  &-link {
    padding: 1rem;
    margin-right: 1rem;
    text-decoration: none;
    text-align: left;

    &:visited {
      color: inherit;
    }
  }
}

.router-link-exact-active {
  font-weight: bold;
}
</style>
