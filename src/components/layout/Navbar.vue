<template>
  <nav class="nav">
    <router-link class="nav-link" to="/">Portfolio</router-link>
    <router-link class="nav-link" to="/assets">Assets</router-link>
    <router-link class="nav-link" to="/pools">Pools</router-link>
    <router-link class="nav-link" to="/playground">Playground</router-link>
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
  padding-left: 5.2rem;
  font-size: 1.6rem;
  align-items: center;
  font-family: 'Inter', sans-serif;
  &-link {
    width: 8rem;
    margin-right: 2rem;
    color: #000;
    text-decoration: none;
    text-align: center;

    &:visited {
      color: inherit;
    }
  }
}

.router-link-exact-active {
  font-weight: bold;
}
</style>
