<template>
  <div class="toast-container flex justify-between">
    <div class="theme-inverse text-text">Main toast message</div>
    <Button :name="'Undo'" class="text-secondary" variant="link" :click-function="undo" />
  </div>
</template>

<script lang="ts" setup>
import Button from '@/components/ui/Button.vue';

const undo = () => {
  console.log('undo');
};
</script>

<style lang="postcss">
.toast-container {
  @apply fixed z-50 bottom-3 h-32 translate-x-full px-4 py-3;
  border-radius: 0.5rem;
  width: 22.5rem;
  height: 3rem;
  background-color: #171717;
  left: 50%;
  transform: translateX(-50%);
}
</style>
