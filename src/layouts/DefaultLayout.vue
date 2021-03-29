<template>
  <div>
    <header class="header">Header</header>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
};
</script>

<style scoped>
.header {
  height: 5rem;
  background-color: green;
}
</style>