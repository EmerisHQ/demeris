<template>
  <div>
    <!-- Basic button implementation. At minimum primary/secondary types, busy and disabled states, can be a link,router_link or trigger a custom clickHandler //-->
    <button @click="clickFunction" :class="status" class="button s-0 w-medium elevation-button">
      {{ name }}
    </button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Button',
  props: {
    name: { type: String, required: true },
    status: { type: String, required: false, default: 'normal' },
    clickFunction: { type: Function, required: false, default: null },
  },
});
</script>
<style lang="scss" scoped>
.button {
  width: 100%;
  padding: 1.6rem 0;
  color: var(--bg);

  border-radius: 8px;
  border: none;
  outline: none;
  cursor: pointer;
}

.normal {
  background-color: var(--text);
}

.muted {
  background-color: var(--muted);
}

.inactive {
  background-color: var(--inactive);
  pointer-events: none;
}
</style>