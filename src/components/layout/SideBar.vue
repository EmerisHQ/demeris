<template>
  <SpSidebar @sidebar-open="sidebarOpen = true" @sidebar-close="sidebarOpen = false">
    <template #default>
      <SpLinkIcon link="/" text="Dashboard" icon="Dashboard" />
      <SpLinkIcon link="/pool" text="Pool" icon="Form" />
      <SpLinkIcon link="/swap" text="Swap" icon="Form" />
    </template>
    <template #footer>
      <SpStatusAPI :show-text="sidebarOpen" />
      <SpStatusRPC :show-text="sidebarOpen" />
      <SpStatusWS :show-text="sidebarOpen" />
      <div class="sp-text">Build: v0.3.8</div>
    </template>
  </SpSidebar>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      sidebarOpen: true,
    };
  },
  computed: {
    hasWallet() {
      return this.$store.hasModule(['common', 'wallet']);
    },
  },
};
</script>