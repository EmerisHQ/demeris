<template>
  <Button
    :class="[status, 'btn flex-grow']"
    :name="name"
    :status="status"
    variant="secondary"
    full-width
    :disabled="disabled"
    :tooltip-text="tooltipText"
    @click="clickFunction"
  />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

import Button from './Button.vue';

export default defineComponent({
  name: 'ModalButton',

  components: { Button },

  props: {
    name: { type: String, required: true },
    status: { type: String, required: false, default: 'normal' },
    clickFunction: { type: Function, required: false, default: null },
    tooltipText: { type: String, required: false, default: '' },
    disabled: { type: Boolean, default: false },
  },
});
</script>
<style lang="scss" scoped>
::v-deep(.button) {
  --tw-shadow: none;
  background: none;
  height: 4rem;
  transform: none;
  border-radius: 0;

  &:hover:not(:active) {
    background-color: var(--fg);
  }

  .btn:first-child & {
    @apply rounded-bl-2xl;
  }

  .btn:last-child & {
    @apply rounded-br-2xl;
  }
}
</style>
