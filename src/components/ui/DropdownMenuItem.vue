<template>
  <Button
    class="py-3 px-6 hover:text-link"
    variant="link"
    align-text="left"
    data-test="menuItemButton"
    @click="emit('click')"
  >
    <slot />
  </Button>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue';
const emit = defineEmits<{ (e: 'click') }>();
</script>
